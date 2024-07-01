const { Logger } = require('@nestjs/common');
const fs = require('fs/promises');

class PDFRepositoryImpl {
  constructor() {
    this.logger = new Logger(PDFRepositoryImpl.name);
  }

  async savePDF(pdf) {
    this.logger.log('Saving PDF to storage');
    const dir = './storage';
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(`${dir}/${pdf.id}.json`, JSON.stringify(pdf));
  }

  async getPDF(id) {
    this.logger.log('Retrieving PDF from storage');
    const data = await fs.readFile(`./storage/${id}.json`, 'utf-8');
    return JSON.parse(data);
  }
}

module.exports = PDFRepositoryImpl;
