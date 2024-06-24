import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const FlashCardList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;

  const isValidJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex flex-wrap space-x-4 p-4 space-y-4">
      {messages.map((message) => {
        if (!isValidJSON(message.content)) {
          return null;
        }

        const flashcards = JSON.parse(message.content).flashcards;

        return flashcards.map(
          (flashcard: { question: string; answer: string }, index: number) => (
            <Card
              key={index}
              className="w-[250px] p-2 shadow-lg shadow-indigo-500/40 bg-gradient-to-r from-blue-100 via-purple-120 to-blue-150"
            >
              <CardHeader>
                <strong>Question: {flashcard.question} </strong>
              </CardHeader>
              <CardContent>
                <CardDescription>Answer: {flashcard.answer}</CardDescription>
              </CardContent>
            </Card>
          )
        );
      })}
    </div>
  );
};

export default FlashCardList;
