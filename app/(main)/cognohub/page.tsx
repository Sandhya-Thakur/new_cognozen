"use client";

import { Header } from "./cognoHeader";
import { CognoHubLibrary } from "@/components/cognohub-library";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
};

type Props = {
  chatId: number;
};

const CognoHub: React.FC<Props> = ({ chatId }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<PdfData[]>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await axios.get<PdfData[]>(`/api/get-all-chat-ids`);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Received data:", data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full justify-center items-center">
        <p>Error loading data...</p>
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

  const viewAll = () => {
    router.push("/pdf");
  };

  const sampleCards = data.slice(0, 6); // Display only the first 6 PDFs

  return (
    <>
      <Header />
      <CognoHubLibrary />
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
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <p>{`Chat ID: ${card.id}`}</p>
                    </div>
                  </div>
                </CardContent>
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

export default CognoHub;
