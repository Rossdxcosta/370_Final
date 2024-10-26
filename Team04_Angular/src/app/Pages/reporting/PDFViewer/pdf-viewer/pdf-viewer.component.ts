import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
})
export class PdfViewerComponent implements OnChanges {
  @Input() pdfSrc: Uint8Array | null = null;
  @ViewChild('pdfContainer', { static: true }) pdfContainerRef!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('PdfViewerComponent ngOnChanges called with changes:', changes);
    if (changes['pdfSrc'] && this.pdfSrc) {
      console.log('pdfSrc changed, loading PDF');
      this.loadPdf(this.pdfSrc);
    }
  }

  async loadPdf(pdfData: Uint8Array) {
    try {
      console.log('Loading PDF with data:', pdfData);
      const pdfContainer = this.pdfContainerRef.nativeElement;
      if (pdfContainer) {
        pdfContainer.innerHTML = '';
      }

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf: PDFDocumentProxy = await loadingTask.promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page: PDFPageProxy = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        if (pdfContainer) {
          pdfContainer.appendChild(canvas);
        }
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }
}
