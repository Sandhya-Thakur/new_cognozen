import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import GetBackButton from "@/components/GetBackButton";
import WebcamAComponent from "@/components/WebCamComponenet"

type Props = {
  params: {
    chatId: string;
  };
};

const ReadPdfPage: React.FC<Props> = async ({ params: { chatId } }) => {
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
  console.log(currentChat);

  return (
    <div className="flex h-full overflow-scroll">
      <div className="flex w-full overflow-scroll ">
        <div className="max-h-screen p-2 oveflow-scroll flex-[8]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
      </div>
      <div className="flex-[4]">
        <WebcamAComponent />
      </div>
      <div className="absolute bottom-0 right-4 p-8">
        <GetBackButton />
      </div>
    </div>
  );
};

export default ReadPdfPage;
