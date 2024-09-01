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
  'from-[#0F52BA] to-[#1E65CE]',
  'from-[#1E65CE] to-[#2D78E2]',
  'from-[#2D78E2] to-[#3C8BF6]',
  'from-[#3C8BF6] to-[#4B9EFA]',
  'from-[#4B9EFA] to-[#5AB1FE]'
];

const CognoZenPdf: React.FC = () => {
  const [data, setData] = useState<PdfData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/api/get-all-pdf");
        // Sort PDFs by createdAt date, newest first
        const sortedData = response.data.sort((a: PdfData, b: PdfData) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setData(sortedData);
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
        <Loader className="w-8 h-8 animate-spin text-[#0F52BA]" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-full justify-center items-center">
        <p className="text-[#0F52BA] text-lg">No PDFs found</p>
      </div>
    );
  }

  const viewAll = () => {
    router.push("/pdf");
  };

  const sampleCards = data.slice(0, 6); // Display only the first 6 PDFs

  return (
    <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#0F52BA]">Recent Uploads</h2>
        <button
          onClick={viewAll}
          className="flex items-center text-[#0F52BA] hover:text-[#0D47A1] transition-colors duration-200 font-semibold"
        >
          View All
          <ChevronRight className="ml-1 w-5 h-5" />
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-8 pb-6">
        {sampleCards.map((pdf, index) => (
          <div key={pdf.id} className="flex flex-col items-center flex-shrink-0">
            <div
              className="group perspective cursor-pointer w-56"
              onClick={() => router.push(`/readPdf/${pdf.id}`)}
            >
              <div className="relative preserve-3d group-hover:my-rotate-y-15 duration-1000 w-full aspect-[5/7]">
                <div className={`absolute backface-hidden w-full h-full ${colorPalette[index % colorPalette.length]} bg-gradient-to-r shadow-xl rounded-lg border-l-4 border-l-blue-200`}>
                  <div className="w-full h-full p-6 flex items-center justify-center bg-[url('/subtle-blue-pattern.png')] bg-cover bg-center bg-blend-overlay bg-opacity-30">
                    <h2 className="font-serif font-bold text-lg text-center text-white drop-shadow-md line-clamp-3">
                      {pdf.pdfName}
                    </h2>
                  </div>
                </div>
                <div className="absolute backface-hidden w-6 h-full -left-3 top-0 bg-[#0F52BA] bg-opacity-20 my-rotate-y-90 origin-right"></div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 font-serif">
              Added: {new Date(pdf.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CognoZenPdf;