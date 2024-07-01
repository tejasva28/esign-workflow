const { Router } = require('express');
const multer = require('multer');
const upload = multer(); // Initialize multer for file handling

class PDFController {
  constructor(pdfService) {
    this.pdfService = pdfService;
    this.uploadPDF = this.uploadPDF.bind(this);
  }

  async uploadPDF(req, res) {
    const file = req.file;
    const body = req.body;
    const { emails, signTags } = body;
    try {
      const result = await this.pdfService.savePDF(file, emails, signTags);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

const pdfControllerFactory = (pdfService) => {
  const controller = new PDFController(pdfService);
  const router = Router();

  router.post('/upload', upload.single('file'), (req, res) => controller.uploadPDF(req, res));

  return router;
};

module.exports = pdfControllerFactory;
