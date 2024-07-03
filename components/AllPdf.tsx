"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div>
      {data.map((pdf) => (
        <Card key={pdf.id} className="mb-4">
          <CardHeader>
            <CardTitle>{pdf.pdfName}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button
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
