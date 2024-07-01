const { Logger } = require('@nestjs/common');
const fs = require('fs');
const path = require('path');
const { ConfigService } = require('@nestjs/config');
const { HttpService } = require('@nestjs/axios');
const { map, catchError } = require('rxjs/operators');
const { throwError } = require('rxjs');

class OpenSignService {
  constructor(configService, httpService) {
    this.logger = new Logger(OpenSignService.name);
    this.apiUrl = configService.get('OPENSIGN_API_URL');
    this.httpService = httpService;

    this.logger.log(`OpenSign API URL: ${this.apiUrl}`);
  }

  async signPDF(documentId) {
    const url = `${this.apiUrl}/sign`;
    return this.httpService.post(url, { documentId }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'arraybuffer' // Expecting a binary response (PDF)
    })
    .pipe(
      map((response) => {
        const signedPdfPath = path.join(__dirname, `../../storage/${documentId}-signed.pdf`);
        fs.writeFileSync(signedPdfPath, response.data);
        this.logger.log(`PDF signed successfully: ${signedPdfPath}`);
        return { signedPdfPath };
      }),
      catchError(err => {
        this.logger.error('Error signing PDF with OpenSign API', err);
        return throwError(() => new Error('Error signing PDF with OpenSign API'));
      })
    )
    .toPromise();
  }
}

module.exports = OpenSignService;
