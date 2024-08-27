import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardSet {
  id: number;
  pdfName: string;
  content: string;
  createdAt: string;
  role: "user" | "system";
}

interface FlashcardGroup {
  pdfName: string;
  flashcards: Flashcard[];
}

// Custom hook for screen size
const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isLargeScreen;
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const FlashCardGroups: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<FlashcardSet[], Error>({
    queryKey: ["flashcardGroups"],
    queryFn: async () => {
      const response = await axios.get<FlashcardSet[]>(
        "/api/get-all-flashcards"
      );
      return response.data;
    },
  });

  const [expandedGroups, setExpandedGroups] = useState<
    Record<string, string[]>
  >({});
  const isLargeScreen = useScreenSize();

  const [shuffledGroups, setShuffledGroups] = useState<FlashcardGroup[]>([]);

  useEffect(() => {
    if (data) {
      const groupedFlashcards: FlashcardGroup[] = data.reduce(
        (acc: FlashcardGroup[], set) => {
          let parsedContent;
          try {
            parsedContent = JSON.parse(set.content);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return acc;
          }

          if (parsedContent && Array.isArray(parsedContent.flashcards)) {
            acc.push({
              pdfName: set.pdfName,
              flashcards: parsedContent.flashcards,
            });
          } else if (
            set.role === "system" &&
            typeof parsedContent === "object"
          ) {
            const flashcards = Object.entries(parsedContent).map(
              ([key, value]) => ({
                question: key,
                answer: value as string,
              })
            );
            acc.push({
              pdfName: set.pdfName,
              flashcards,
            });
          }
          return acc;
        },
        []
      );

      setShuffledGroups(
        isLargeScreen ? groupedFlashcards : shuffleArray(groupedFlashcards)
      );
    }
  }, [data, isLargeScreen]);

  if (isLoading) return <Skeleton className="w-full h-48" />;
  if (isError)
    return (
      <div className="text-center text-blue-500">
        Error loading flashcard groups
      </div>
    );

  const toggleGroup = (pdfName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [pdfName]: prev[pdfName] ? [] : ["group"],
    }));
  };

  const toggleFlashcard = (pdfName: string, index: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [pdfName]: prev[pdfName]?.includes(`card-${index}`)
        ? prev[pdfName].filter((item) => item !== `card-${index}`)
        : [...(prev[pdfName] || []), `card-${index}`],
    }));
  };
  const viewAll = () => {
    router.push("/allFlashCards");
  };

  return (
    <div className="bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-blue-800">Flashcards</h2>
        <button 
          onClick={viewAll} 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          View All
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shuffledGroups.map((group) => (
          <Card key={group.pdfName} className="overflow-hidden border border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100 p-3 sm:p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span className="text-base sm:text-lg font-semibold text-blue-700 truncate">
                    {group.pdfName.trim()}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs sm:text-sm bg-blue-100 text-blue-700">
                  {group.flashcards.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                value={expandedGroups[group.pdfName] || []}
                onValueChange={(value) =>
                  setExpandedGroups((prev) => ({
                    ...prev,
                    [group.pdfName]: value,
                  }))
                }
              >
                <AccordionItem value="group">
                  <AccordionTrigger
                    onClick={() => toggleGroup(group.pdfName)}
                    className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-blue-50 text-sm sm:text-base"
                  >
                    <span className="font-medium text-blue-600">
                      View Flashcards
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y divide-blue-100">
                      {group.flashcards.map((flashcard, index) => (
                        <li key={index} className="hover:bg-blue-50">
                          <Accordion
                            type="multiple"
                            value={expandedGroups[group.pdfName] || []}
                            onValueChange={(value) =>
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [group.pdfName]: value,
                              }))
                            }
                          >
                            <AccordionItem value={`card-${index}`}>
                              <AccordionTrigger
                                onClick={() =>
                                  toggleFlashcard(group.pdfName, index)
                                }
                                className="text-left p-2 sm:p-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-medium text-blue-700">
                                    {flashcard.question}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="mt-2 text-xs sm:text-sm text-blue-600 pl-5 sm:pl-6 pr-2 pb-2">
                                  {flashcard.answer}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlashCardGroups;