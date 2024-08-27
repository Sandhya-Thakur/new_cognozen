"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

type Props = {
  pdfUrl: string;
};

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PDFViewer: React.FC<Props> = ({ pdfUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<string>('Not started');
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const renderPage = (pdf: any, pageNum: number, viewer: HTMLElement) => {
    pdf.getPage(pageNum).then((page: any) => {
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-page';
      canvas.style.display = 'block';
      canvas.style.margin = '10px auto';
      const context = canvas.getContext('2d');
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
        viewer.appendChild(canvas);
        setLoadingState(`Rendered page ${pageNum} of ${pdf.numPages}`);
      } else {
        setError('Failed to get canvas context');
      }
    }).catch((err: Error) => setError(`Error rendering PDF page ${pageNum}: ${err.message}`));
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleFitToWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      setScale(containerWidth / 595); // Assuming a standard page width of 595 points (8.5 inches)
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      setLoadingState('Loading PDF.js script');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js';
      script.onload = () => {
        setLoadingState('PDF.js script loaded');
        const viewer = document.createElement('div');
        viewer.id = 'viewer';
        viewer.style.width = '100%';
        viewer.style.minHeight = '100%';
        containerRef.current?.appendChild(viewer);

        if (!window.pdfjsLib) {
          setError('PDF.js library not found on window object');
          return;
        }

        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

        setLoadingState('Loading PDF document');
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then((pdf: any) => {
          setLoadingState('PDF document loaded, rendering pages');
          setNumPages(pdf.numPages);
          renderPage(pdf, currentPage, viewer);
        }).catch((err: Error) => setError(`Error loading PDF: ${err.message}`));
      };
      script.onerror = () => setError('Failed to load PDF.js script');
      document.body.appendChild(script);

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        document.body.removeChild(script);
      };
    }
  }, [pdfUrl, currentPage, scale]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-100 flex flex-col">
      <div className="p-2 bg-gray-100 text-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          Page {currentPage} of {numPages} | Scale: {scale.toFixed(2)}x
        </div>
        <div className="flex space-x-2">
          <button onClick={handleZoomOut} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleZoomIn} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleFitToWidth} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Maximize size={16} />
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            <ChevronUp size={16} />
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))} 
            disabled={currentPage === numPages}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-grow overflow-auto" />
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      <div className="p-2 bg-gray-100 text-sm">
        Loading state: {loadingState}
      </div>
    </div>
  );
};

export default PDFViewer;