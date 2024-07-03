"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
};

const CognoHubPdf: React.FC = () => {
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

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!Array.isArray(data)) {
    return (
      <div className="flex h-full justify-center items-center">
        <p>Unexpected data format received...</p>
      </div>
    );
  }

  if (!data) {
    return <div>No PDFs found</div>;
  }
  const viewAll = () => {
    router.push("/pdf");
  };

  const sampleCards = data.slice(0, 6); // Display only the first 6 PDFs

  return (
    <>
      <div className="grainy min-h-screen p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Uploaded PDFs</h2>
          <button onClick={viewAll} className="text-blue-500 hover:underline">
            View All
          </button>
        </div>
        <div className="flex overflow-x-scroll space-x-8">
          {sampleCards.map((card) => (
            <div key={card.id} className="min-w-[250px]">
              <Card className="w-[250px] p-2 shadow-lg shadow-indigo-500/40 bg-gradient-to-r from-blue-100 via-purple-120 to-blue-150">
                <CardHeader className="bg-transparent text-blue-800 text-xl ">
                  <CardTitle>
                    {card.pdfName.trim().length > 10
                      ? `${card.pdfName.trim().substring(0, 10)}...`
                      : card.pdfName.trim()}
                  </CardTitle>
                  <Separator className="my-4" />
                </CardHeader>

                <CardFooter>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/readPdf/${card.id}`)}
                  >
                    View PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CognoHubPdf;
