"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { useChat, useCompletion } from "ai/react";
import { Message } from "ai";
import MessageList from "@/components/MessageList";
import axios from "axios";

type Props = { chatId: number };

const SummaryComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-summary-details", {
        chatId,
      });
      return response.data;
    },
  });

  const { messages, input, handleSubmit, handleInputChange } = useChat({
    api: "/api/pdf-summary",
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
      className="relative max-h-screen overflow-scroll "
      id="message-container"
    >
      {/* Header */}
      <div className="px-32 py-4">
        <h3 className="text-xl font-bold">Generate Summary</h3>
      </div>
      {/* Chat list */}
      <div className="mb-4">
        {" "}
        {/* Added margin bottom */}
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      {/* Generate Summary Button */}
      <div className="px-32 py-4">
        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Generate summary..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default SummaryComponent;
