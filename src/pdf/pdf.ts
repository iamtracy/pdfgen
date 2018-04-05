import PdfService from './pdf.service';
import { Pdf } from './pdf.model';

export function getPdf(pdfData, total: number): string {
    return new PdfService().generatePdf(pdfData, total);
}