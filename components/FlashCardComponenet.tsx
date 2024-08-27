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
      className="relative max-h-screen overflow-scroll bg-white"
      id="flashcard-container"
    >
      {/* Header */}
      <div className="bg-blue-100 px-8 py-6 shadow-md">
        {/* You can add a header title or additional content here if needed */}
      </div>
      
      {/* Chat list */}
      <div className="mb-4">
        <FlashCardList messages={messages} isLoading={isLoading} />
      </div>
      
      {/* Generate Flashcards */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-100 px-8 py-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <Input
            className="w-full max-w-3xl mx-auto p-3 border border-blue-300 rounded-lg shadow-inner bg-white text-blue-900 placeholder-blue-400"
            value={input}
            placeholder="Type 'generate flashcards' to create new flashcards"
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default FlashCardComponent;