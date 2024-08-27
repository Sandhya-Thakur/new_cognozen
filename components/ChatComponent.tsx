"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { Message } from "ai";
import MessageList from "@/components/MessageList";
import axios from "axios";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-chat-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, messages, handleSubmit } = useChat({
    api: "/api/pdf-chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll bg-white"
      id="message-container"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <h3 className="text-xl font-bold text-blue-800">Ask about PDF</h3>
      </div>
      
      {/* Chat list */}
      <div className="mb-4 px-6">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-6 py-4 bg-white border-t border-blue-100"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;