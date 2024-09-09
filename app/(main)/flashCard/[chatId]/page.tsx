import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import FlashCardComponent from "@/components/FlashCardComponenet"
import FlashCardSideBar from "@/components/FlashCardSideBar";

type Props = {
  params: {
    chatId: string;
  };
};

const FlashCardPage: React.FC<Props> = async ({ params: { chatId } }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/cognohub");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/cognohub");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-blue-50 shadow-md md:shadow-none">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Flashcards</h2>
          <FlashCardSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-4 md:mb-6">Flashcards</h1>
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-blue-200">
            <FlashCardComponent chatId={parseInt(chatId)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardPage;