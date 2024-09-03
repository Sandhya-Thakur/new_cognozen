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
  createdAt: string;
}

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
  const [groupedFlashcards, setGroupedFlashcards] = useState<FlashcardGroup[]>(
    []
  );

  useEffect(() => {
    if (data) {
      const grouped: FlashcardGroup[] = data.reduce(
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
              createdAt: set.createdAt,
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
              createdAt: set.createdAt,
            });
          }
          return acc;
        },
        []
      );

      // Sort by createdAt date (newest first) and take only the first 6
      const sortedAndLimited = grouped
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6);

      setGroupedFlashcards(sortedAndLimited);
    }
  }, [data]);

  if (isLoading) return <Skeleton className="w-full h-48" />;
  if (isError)
    return (
      <div className="text-center text-[#0F52BA]">
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
    <div className="bg-[#F8F9FA] p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#0F52BA]">
          Flashcards
        </h2>
        <button
          onClick={viewAll}
          className="flex items-center text-[#0F52BA] hover:text-[#0D47A1] transition-colors duration-200 font-semibold"
        >
          View All
          <ChevronRight className="ml-1 w-5 h-5" />
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groupedFlashcards.map((group) => (
          <Card
            key={group.pdfName}
            className="overflow-hidden border border-[#0F52BA] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="bg-[#E3F2FD] border-b border-[#0F52BA] p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-[#0F52BA]" />
                  <span className="text-lg font-semibold text-[#0F52BA] truncate">
                    {group.pdfName.trim()}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-sm bg-[#0F52BA] text-white"
                >
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
                    className="px-4 py-3 hover:bg-[#E3F2FD] text-base"
                  >
                    <span className="font-medium text-[#0F52BA]">
                      View Flashcards
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y divide-[#E3F2FD]">
                      {group.flashcards.map((flashcard, index) => (
                        <li key={index} className="hover:bg-[#E3F2FD]">
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
                                className="text-left p-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <ChevronRight className="h-4 w-4 text-[#0F52BA] flex-shrink-0" />
                                  <span className="text-sm font-medium text-[#0F52BA]">
                                    {flashcard.question}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="mt-2 text-sm text-[#0D47A1] pl-6 pr-3 pb-3">
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
