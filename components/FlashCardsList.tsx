import React, { useState } from "react";
import { Message } from "ai/react";
import { Loader2, BookOpen, RotateCw } from "lucide-react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const FlashCardList = ({ messages, isLoading }: Props) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-blue-600 font-medium">Loading Flashcards...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-400">
        <BookOpen className="w-12 h-12 mb-2" />
        <p className="font-light">No flashcards generated yet</p>
      </div>
    );
  }

  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCardClick = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {messages.map((message) => {
        if (!isValidJSON(message.content)) {
          return null;
        }

        const flashcards = JSON.parse(message.content).flashcards;

        return flashcards.map(
          (flashcard: { question: string; answer: string }, index: number) => {
            const cardId = `${message.id}-${index}`;
            const isFlipped = flippedCards[cardId];

            return (
              <div
                key={cardId}
                className="perspective cursor-pointer"
                onClick={() => handleCardClick(cardId)}
              >
                <div className={`relative preserve-3d w-full aspect-[3/2] duration-500 ${isFlipped ? 'my-rotate-y-180' : ''}`}>
                  {/* Front of the card */}
                  <div className="absolute backface-hidden w-full h-full bg-white shadow-md rounded-lg border border-blue-200 transition-shadow hover:shadow-lg">
                    <div className="w-full h-full p-6 flex flex-col justify-between">
                      <h3 className="font-bold text-xl text-blue-800 mb-2">Question:</h3>
                      <p className="text-bold text-blue-700">{flashcard.question}</p>
                      <div className="flex items-center justify-end mt-4 text-blue-400">
                        <RotateCw className="w-4 h-4 mr-1" />
                        <span className="text-xs">Flip</span>
                      </div>
                    </div>
                  </div>
                  {/* Back of the card */}
                  <div className="absolute my-rotate-y-180 backface-hidden w-full h-full bg-blue-50 shadow-md rounded-lg border border-blue-200 transition-shadow hover:shadow-lg">
                    <div className="w-full h-full p-6 flex flex-col justify-between">
                      <h3 className="font-bold text-xl text-blue-800 mb-2">Answer</h3>
                      <p className="text-bold text-blue-700">{flashcard.answer}</p>
                      <div className="flex items-center justify-end mt-4 text-blue-400">
                        <RotateCw className="w-4 h-4 mr-1" />
                        <span className="text-xs">Flip back</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        );
      })}
    </div>
  );
};

export default FlashCardList;