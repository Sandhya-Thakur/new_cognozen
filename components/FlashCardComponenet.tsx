"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { Message } from "ai";
import FlashCardList from "@/components/FlashCardsList";
import axios from "axios";

type Props = { chatId: number };

const FlashCardComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["flashcard-details", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-flashcards-details", { chatId });
      return response.data;
    },
  });

  const { input, handleInputChange, messages, handleSubmit } = useChat({
    api: "/api/pdf-flashcards",
    body: { chatId },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("flashcard-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="flashcard-container"
    >
      {/* Header */}
      <div className="px-64 py-4">
        <h3 className="text-xl font-bold">Generate Flashcards</h3>
      </div>
      {/* Chat list */}
      <div className="mb-4">
        <FlashCardList messages={messages} isLoading={isLoading} />
      </div>
      {/* Generate Flashcards */}
      <div className="px-32 py-8">
        <form onSubmit={handleSubmit}>
          <Input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Type 'generate flashcards' to generate flashcards"
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default FlashCardComponent;
