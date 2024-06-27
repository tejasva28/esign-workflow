import { Injectable } from '@nestjs/common';
import { PDFService } from '../../domain/services/pdf.service';
import { PDF } from '../../domain/entities/pdf.entity';

@Injectable()
export class SignPDFUseCase {
  constructor(private readonly pdfService: PDFService) {}

  async execute(file: Express.Multer.File, signTags: string[]): Promise<PDF> {
    return this.pdfService.savePDF(file, signTags);
  }
}
