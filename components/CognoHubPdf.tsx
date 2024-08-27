"use client";

import { ChevronRight, Loader } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
};

const colorPalette = [
  'from-blue-700 to-blue-600',
  'from-blue-600 to-blue-500',
  'from-blue-500 to-blue-400',
  'from-blue-400 to-blue-300',
  'from-blue-300 to-blue-200'
];

const CognoZenPdf: React.FC = () => {
  const [data, setData] = useState<PdfData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/api/get-all-pdf");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch PDFs", error);
      }
      setIsLoading(false);
    };
    fetchPdfs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-full justify-center items-center">
        <p className="text-blue-600 text-lg">No PDFs found</p>
      </div>
    );
  }

  const viewAll = () => {
    router.push("/pdf");
  };

  const sampleCards = data.slice(0, 6); // Display only the first 6 PDFs

  return (
    <div className="bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-blue-800">Recent Uploads</h2>
        <button
          onClick={viewAll}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          View All
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-6 pb-4">
        {sampleCards.map((pdf, index) => (
          <div key={pdf.id} className="flex flex-col items-center flex-shrink-0">
            <div
              className="group perspective cursor-pointer w-48"
              onClick={() => router.push(`/readPdf/${pdf.id}`)}
            >
              <div className="relative preserve-3d group-hover:my-rotate-y-15 duration-1000 w-full aspect-[5/7]">
                <div className={`absolute backface-hidden w-full h-full ${colorPalette[index % colorPalette.length]} bg-gradient-to-r shadow-xl rounded-sm border-l-4 border-l-blue-200`}>
                  <div className="w-full h-full p-4 flex items-center justify-center bg-[url('/subtle-blue-pattern.png')] bg-cover bg-center bg-blend-overlay bg-opacity-30">
                    <h2 className="font-serif font-bold text-sm text-center text-white drop-shadow-md line-clamp-3">
                      {pdf.pdfName}
                    </h2>
                  </div>
                </div>
                <div className="absolute backface-hidden w-6 h-full -left-3 top-0 bg-blue-900 bg-opacity-20 my-rotate-y-90 origin-right"></div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 font-serif">
              Added: {new Date(pdf.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CognoZenPdf;