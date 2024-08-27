"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from "lucide-react";
import axios from "axios";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
};

const colorPalette = [
  'from-stone-700 to-stone-600',
  'from-neutral-700 to-neutral-600',
  'from-zinc-700 to-zinc-600',
  'from-slate-700 to-slate-600',
  'from-gray-700 to-gray-600'
];

const AllPdf: React.FC = () => {
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
      <div className="flex h-screen justify-center items-center">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-gray-600 text-lg">Your library is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-stone-100">
      <h1 className="text-3xl font-serif font-bold mb-8 text-stone-800 text-center">Your Book Collection</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {data.map((pdf, index) => (
          <div key={pdf.id} className="flex flex-col items-center">
            <div 
              className="group perspective cursor-pointer w-full"
              onClick={() => router.push(`/readPdf/${pdf.id}`)}
            >
              <div className={`relative preserve-3d group-hover:my-rotate-y-15 duration-1000 w-full aspect-[5/7]`}>
                <div className={`absolute backface-hidden w-full h-full ${colorPalette[index % colorPalette.length]} bg-gradient-to-r shadow-xl rounded-sm border-l-4 border-l-stone-300`}>
                  <div className="w-full h-full p-4 flex items-center justify-center bg-[url('/rustic-leather-texture.png')] bg-cover bg-center bg-blend-overlay bg-opacity-30">
                    <h2 className="font-serif font-bold text-sm sm:text-base text-center text-stone-200 drop-shadow-md line-clamp-3">
                      {pdf.pdfName}
                    </h2>
                  </div>
                </div>
                <div className="absolute backface-hidden w-8 h-full -left-4 top-0 bg-stone-900 bg-opacity-20 my-rotate-y-90 origin-right"></div>
              </div>
            </div>
            <p className="mt-2 text-xs text-stone-500 font-serif">
              Added: {new Date(pdf.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPdf;