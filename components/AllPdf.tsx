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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.map((pdf) => (
        <Card key={pdf.id} className="p-2 shadow-lg shadow-indigo-500/40 bg-gradient-to-r from-blue-100 via-purple-120 to-blue-150">
          <CardHeader className="bg-transparent text-blue-800 text-xl">
            <CardTitle>
              {pdf.pdfName.trim().length > 10
                ? `${pdf.pdfName.trim().substring(0, 10)}...`
                : pdf.pdfName.trim()}
            </CardTitle>
            <Separator className="my-4" />
          </CardHeader>
          <CardFooter>
            <Button
              size="sm"
              onClick={() => {
                router.push(`/readPdf/${pdf.id}`);
              }}
            >
              View PDF
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AllPdf;
