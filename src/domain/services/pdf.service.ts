import { Injectable, Inject, Logger } from '@nestjs/common';
import { PDFRepository } from '../repositories/pdf.repository';
import { PDF } from '../entities/pdf.entity';

@Injectable()
export class PDFService {
  private readonly logger = new Logger(PDFService.name);

  constructor(@Inject('PDFRepository') private readonly pdfRepository: PDFRepository) {}

  async savePDF(file: Express.Multer.File, signTags: string[]): Promise<PDF> {
    this.logger.log('Saving PDF');
    const pdf = new PDF('generated-id', file.path, signTags);
    await this.pdfRepository.savePDF(pdf);
    return pdf;
  }

  async getPDF(id: string): Promise<PDF> {
    this.logger.log('Getting PDF');
    return this.pdfRepository.getPDF(id);
  }
}
