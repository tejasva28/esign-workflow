import { PDF } from '../entities/pdf.entity';

export interface PDFRepository {
  savePDF(pdf: PDF): Promise<void>;
  getPDF(id: string): Promise<PDF>;
}
