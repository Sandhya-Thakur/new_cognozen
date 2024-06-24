"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PdfData = {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
};

type Props = { chatId: number };

const PdfPage: React.FC<Props> = ({ chatId }) => {
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

  return (
    <div className="flex h-full overflow-scroll p-8">
      <div className="flex w-full overflow-scroll flex-wrap ">
        {data.map((pdf, index) => (
          <div className="flex justify-center items-center p-8">
            <Card
              key={index}
              className="w-[350px] p-2 shadow-lg shadow-indigo-500/40 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100"
            >
              <CardHeader>
                <CardTitle>{pdf.pdfName.trim()}</CardTitle>
                <Separator className="my-4" />
                <CardDescription>{`Uploaded at: ${new Date(
                  pdf.createdAt
                ).toLocaleString()}`}</CardDescription>
                <Separator className="my-4" />
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <p>{`Chat ID: ${pdf.id}`}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => router.push(`/readPdf/${pdf.id}`)}
                >
                  View PDF
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <Button
        onClick={() => router.push("/cognohub")}
        className="fixed bottom-8 right-8"
      >
        Upload PDF
      </Button>
    </div>
  );
};

export default PdfPage;
