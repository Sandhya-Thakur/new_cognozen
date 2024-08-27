"use client";

import { DrizzleChat } from "@/lib/db/schema";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ClassRoom = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full max-h-screen overflow-scroll soff p-4 text-blue-800 bg-blue-50">
      Class Room
      
    </div>
  );
};

export default ClassRoom;