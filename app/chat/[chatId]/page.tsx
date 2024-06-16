
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage: React.FC<Props> = async ({ params: { chatId } }) => {
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
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));


  return (

    <div className="flex h-full overflow-scroll">
      
      <div className="flex w-full overflow-scroll">
        {/* å sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>

  );
};

export default ChatPage;