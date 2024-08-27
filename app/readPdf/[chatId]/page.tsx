import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import SidebarContent from "@/components/ReadPdfSidebarContent";
import SidebarToggle from "@/components/ReadPdfSidebarToggle";

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
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Dashboard
            </button>
          </Link>
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


        <div className="sidebar w-96 bg-white shadow-lg absolute right-0 top-0 bottom-0 transition-transform duration-300 transform translate-x-full">
          <SidebarContent />
        </div>

        <SidebarToggle />
      </main>
    </div>
  );
};

export default ReadPdfPage;
