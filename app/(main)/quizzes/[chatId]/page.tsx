import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import QuizSideBar from "@/components/QuizSideBar";
import QuizHeader from "@/components/QuizHeader";
import QuizGenerator from "@/components/QuizGenerator";
import { Toaster } from "@/components/ui/toaster";


type Props = {
  params: {
    chatId: string;
  };
};

const QuizPage: React.FC<Props> = async ({ params: { chatId } }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/cognohub");
  }

  const chat = _chats.find((chat) => chat.id === parseInt(chatId));
  if (!chat) {
    return redirect("/cognohub");
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 h-screen overflow-y-auto bg-white shadow-lg">
        <QuizSideBar chats={_chats} chatId={parseInt(chatId)} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <QuizHeader
          title={`Quiz: ${chat.pdfName}`}
          description="Test your knowledge about the PDF"
        />
        <div className="mt-6">
          <QuizGenerator
            chatId={parseInt(chatId)}
            pdfName={chat.pdfName}
            userId={userId}
          />
        </div>
      </div>

      {/* Toast component for notifications */}
      <Toaster />
    </div>
  );
};

export default QuizPage;
