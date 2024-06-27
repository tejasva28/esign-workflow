import { Injectable, Logger } from '@nestjs/common';
import { PDFRepository } from '../../domain/repositories/pdf.repository';
import { PDF } from '../../domain/entities/pdf.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PDFRepositoryImpl implements PDFRepository {
  private readonly storagePath = './storage';
  private readonly logger = new Logger(PDFRepositoryImpl.name);

  constructor() {
    this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
      this.logger.log('Storage directory ensured');
    } catch (err) {
      this.logger.error('Error creating storage directory', err);
    }
  }

  async savePDF(pdf: PDF): Promise<void> {
    const filePath = path.join(this.storagePath, `${pdf.id}.json`);
    this.logger.log(`Saving PDF to ${filePath}`);
    await fs.writeFile(filePath, JSON.stringify(pdf));
  }

  async getPDF(id: string): Promise<PDF> {
    const filePath = path.join(this.storagePath, `${id}.json`);
    this.logger.log(`Getting PDF from ${filePath}`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }
}
