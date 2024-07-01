const PDFService = require('../../domain/services/pdf.service');

class SignPDFUseCase {
  constructor(pdfService) {
    this.pdfService = pdfService;
  }

  async execute(file, emails, signTags) {
    return this.pdfService.savePDF(file, emails, signTags);
  }
}

module.exports = SignPDFUseCase;
