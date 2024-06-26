import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import ChatSideBar from "@/components/ChatSideBar";
import SummaryComponent from "@/components/SummaryComponent";

type Props = {
  params: {
    chatId: string;
  };
};

const SummaryPage: React.FC<Props> = async ({ params: { chatId } }) => {
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
    <div className="flex h-full overflow-scroll">
      <div className="flex w-full overflow-scroll">
        {/* Sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* Summary component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <SummaryComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
