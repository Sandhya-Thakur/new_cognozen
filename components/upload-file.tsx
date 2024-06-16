"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { uploadFileToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      console.log("Mutating with:", { file_key, file_name });
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      console.log("Response from API:", response.data);
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadFileToS3(file);
        console.log("Data from S3 upload:", data);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("PDF uploaded successfully");
            console.log("Chat ID:", chat_id);
            router.push(`/pdf/${chat_id}`);
          },
          onError: (error) => {
            console.log("Mutation error:", error);
            toast.error("Something went wrong");
          },
        });
      } catch (error) {
        console.log("Error during upload:", error);
        toast.error("Something went wrong");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex flex-col items-center">
        <div
          {...getRootProps({
            className:
              "rounded-2xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
          })}
        >
          <input {...getInputProps()} />
          {uploading || isPending ? (
            <>
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-slate-400">
                Uploading PDF, please wait...
              </p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10 text-blue-500" />
              <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
