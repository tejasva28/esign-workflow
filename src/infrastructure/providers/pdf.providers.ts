import { PDFRepository } from '../../domain/repositories/pdf.repository';
import { PDFRepositoryImpl } from '../repositories/pdf.repository.impl';
import { SignPDFUseCase } from '../../application/use_cases/sign-pdf.usecase';
import { PDFService } from '../../domain/services/pdf.service';
import { Provider } from '@nestjs/common';

export const pdfProviders: Provider[] = [
  {
    provide: 'PDFRepository',
    useClass: PDFRepositoryImpl,
  },
  PDFService,
  SignPDFUseCase,
];
