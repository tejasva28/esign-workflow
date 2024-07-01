const { Logger } = require('@nestjs/common');
const fs = require('fs');
const path = require('path');
const { map, catchError } = require('rxjs/operators');
const { throwError } = require('rxjs');

class PDFService {
  constructor(configService, httpService, pdfRepository) {
    this.logger = new Logger(PDFService.name);
    this.apiUrl = configService.get('OPENSIGN_API_URL');
    this.storageDir = path.resolve(__dirname, '../../storage');
    this.httpService = httpService;
    this.pdfRepository = pdfRepository;

    this.logger.log(`OpenSign API URL: ${this.apiUrl}`);
    this.ensureDirectoryExists(this.storageDir);
  }

  async savePDF(file, emails, signTags) {
    const filePath = path.join(this.storageDir, file.originalname);
    await this.saveFile(filePath, file.buffer);
    this.logger.log(`Saved PDF to ${filePath}`);

    const pdf = {
      id: file.originalname,
      originalname: file.originalname,
      filePath,
      signTags,
    };
    await this.pdfRepository.savePDF(pdf);

    await this.signPDF(filePath, signTags);

    return pdf;
  }

  async signPDF(documentPath, signTags) {
    const url = `${this.apiUrl}/sign`;
    this.logger.log(`Signing PDF with documentPath: ${documentPath} and signTags: ${JSON.stringify(signTags)}`);
    return this.httpService.post(url, { documentPath, signTags }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'arraybuffer'
    })
    .pipe(
      map((response) => {
        const signedPdfPath = path.join(this.storageDir, `${path.basename(documentPath, '.pdf')}-signed.pdf`);
        this.logger.log(`Received response from sign API, saving to ${signedPdfPath}`);
        fs.writeFileSync(signedPdfPath, response.data);
        this.logger.log(`PDF signed successfully: ${signedPdfPath}`);
        return { signedPdfPath };
      }),
      catchError(err => {
        this.logger.error('Error signing PDF with OpenSign API', err.response ? err.response.data : err.message);
        return throwError(() => new Error('Error signing PDF with OpenSign API'));
      })
    )
    .toPromise();
  }

  async saveFile(filePath, content) {
    const fsPromises = fs.promises;
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
    await fsPromises.writeFile(filePath, content);
  }

  async getPDF(id) {
    return this.pdfRepository.getPDF(id);
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

module.exports = PDFService;
