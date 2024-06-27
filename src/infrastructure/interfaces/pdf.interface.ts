// src/infrastructure/interfaces/pdf.interface.ts

import { PDF } from '../../domain/entities/pdf.entity';

export interface PDFRepository {
  savePDF(pdf: PDF): Promise<void>;
  getPDF(id: string): Promise<PDF>;
  // Other necessary methods
}
