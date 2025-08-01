import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";


type Props = {
  params: {
    chatId: string;
  };
};

const ReadPdfPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));
  if (!userChats.length) return redirect("/cognohub");

  const currentChat = userChats.find((chat) => chat.id === parseInt(chatId));
  if (!currentChat) return redirect("/cognohub");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            CognoHub PDF Reader
          </h1>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden relative">
        <div className="flex-grow overflow-hidden bg-white">
          {currentChat.pdfUrl ? (
            <PDFViewer pdfUrl={currentChat.pdfUrl} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No PDF URL provided
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReadPdfPage;
