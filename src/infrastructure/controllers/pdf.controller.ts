import { Controller, Post, UploadedFile, UseInterceptors, Body, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignPDFUseCase } from '../../application/use_cases/sign-pdf.usecase';
import { Express } from 'express';

@Controller('pdf')
export class PDFController {
  private readonly logger = new Logger(PDFController.name);

  constructor(private readonly signPDFUseCase: SignPDFUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(@UploadedFile() file: Express.Multer.File, @Body('signTags') signTags: string[]) {
    this.logger.log('Received file upload request');
    const pdf = await this.signPDFUseCase.execute(file, signTags);
    return { id: pdf.id, filePath: pdf.filePath };
  }
}