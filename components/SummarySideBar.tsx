"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrizzleChat } from "@/lib/db/schema";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const SummarySideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full max-h-screen overflow-scroll soff p-4 text-blue-800 bg-blue-50">
      <Link href="/cognohub">
        <Button size="lg" variant="secondary" className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
          <PlusCircle className="mr-2 w-4 h-4" />
          Upload PDF
        </Button>
      </Link>
      <div className="flex max-h-screen overflow-scroll pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/summary/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 flex items-center transition-colors duration-200", {
                "bg-blue-500 text-white": chat.id === chatId,
                "bg-white text-blue-800 hover:bg-blue-100": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SummarySideBar;