"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { Message } from "ai";
import MessageList from "@/components/MessageList"
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
 
  const { input, handleInputChange,messages, handleSubmit} = useChat({
    api: "/api/pdf-chat",
    body:{
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
      className="relative max-h-screen overflow-scroll "
      id="message-container"
    >
      {/* Header */}
      <div className="px-32 py-4">
      <h3 className="text-xl font-bold">Ask about pdf</h3>
      </div>
      {/* Chat list */}
      <div className="mb-4"> {/* Added margin bottom */}
      <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
    
      {/* Input */}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;