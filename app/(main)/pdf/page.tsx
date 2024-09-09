"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Search, BookOpen, Filter } from "lucide-react";
import axios from "axios";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
  category: string;
};

const colorPalette = [
  'from-blue-700 to-blue-600',
  'from-blue-600 to-blue-500',
  'from-blue-500 to-blue-400',
  'from-blue-400 to-blue-300',
  'from-blue-300 to-blue-200'
];

const categories = ['All', 'Work', 'Personal', 'Education', 'Other'];

const PdfLibraryPage: React.FC = () => {
  const [data, setData] = useState<PdfData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const filteredData = data?.filter(pdf => 
    pdf.pdfName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || pdf.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-800 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">PDF Library</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search PDFs..."
              className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-blue-400" size={20} />
          </div>
          <div className="relative w-full sm:w-48">
            <select
              className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 text-blue-400" size={20} />
          </div>
        </div>

        {/* PDF Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filteredData.map((pdf, index) => (
              <div key={pdf.id} className="flex flex-col items-center">
                <div 
                  className="group perspective cursor-pointer w-full"
                  onClick={() => router.push(`/readPdf/${pdf.id}`)}
                >
                  <div className={`relative preserve-3d group-hover:my-rotate-y-15 duration-1000 w-full aspect-[5/7]`}>
                    <div className={`absolute backface-hidden w-full h-full ${colorPalette[index % colorPalette.length]} bg-gradient-to-r shadow-xl rounded-sm border-l-4 border-l-blue-300`}>
                      <div className="w-full h-full p-4 flex items-center justify-center bg-[url('/subtle-blue-pattern.png')] bg-cover bg-center bg-blend-overlay bg-opacity-30">
                        <h2 className="font-serif font-bold text-sm sm:text-base text-center text-white drop-shadow-md line-clamp-3">
                          {pdf.pdfName}
                        </h2>
                      </div>
                    </div>
                    <div className="absolute backface-hidden w-8 h-full -left-4 top-0 bg-blue-900 bg-opacity-20 my-rotate-y-90 origin-right"></div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-blue-500 font-serif">
                  Added: {new Date(pdf.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <BookOpen className="w-16 h-16 text-blue-400 mb-4" />
            <p className="text-blue-600 text-lg">No PDFs found</p>
          </div>
        )}
      </main>
      <footer className="bg-blue-800 text-white py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-2 sm:mb-0">&copy; 2024 CognoZen PDF Library. All rights reserved.</p>
          <nav>
            <ul className="flex space-x-4 text-sm">
              <li><a href="#" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-300">Contact</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PdfLibraryPage;