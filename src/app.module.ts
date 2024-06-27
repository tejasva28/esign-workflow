import { Module } from '@nestjs/common';
import { PDFController } from './infrastructure/controllers/pdf.controller';
import { pdfProviders } from './infrastructure/providers/pdf.providers';

@Module({
  imports: [],
  controllers: [PDFController],
  providers: [...pdfProviders],
})
export class AppModule {}
