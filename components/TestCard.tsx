
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Brain, Car, MessageSquare, FileText } from "lucide-react";

const IconWrapper: React.FC<{
  icon: React.ElementType;
  className?: string;
}> = ({ icon: Icon, className = "" }) => {
  return <Icon className={`w-6 h-6 ${className}`} />;
};

type SectionCardProps = {
  icon: React.ElementType;
  title: string;
  description?: string;
  link: string;
  onClick: () => void;
  isDisabled?: boolean;
};

const SectionCard: React.FC<SectionCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  isDisabled,
}) => {
  return (
    <div
      className={`bg-[#4355FF] transition-all duration-300 rounded-2xl p-6
                 relative overflow-hidden group w-full h-full min-h-[180px]
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3A4BE0] cursor-pointer"}`}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FEF]/30 to-transparent" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/10 rounded-lg p-2">
            <IconWrapper icon={Icon} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-semibold">{title}</h2>
        </div>
        {description && (
          <p className="text-white/80 text-sm leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

const components = [
  {
    title: "Quizzes",
    href: "/quizzes",
    description:
      "Review, retake, or create new challenges based on your learning progress.",
    icon: Brain,
  },
  {
    title: "Flash Notes",
    href: "/flashCard",
    description:
      "Access custom flashcard decks for rapid memory reinforcement.",
    icon: Car,
  },
  {
    title: "ChatConnect",
    href: "/chat",
    description:
      "Ask questions, gain insights, request clarifications, and explore more through real-time chat.",
    icon: MessageSquare,
  },
  {
    title: "Summaries",
    href: "/summary",
    description:
      "Get the gist of your documents quickly, helping you focus on essential information.",
    icon: FileText,
  },
];

const CognoHubQuizzesSection = () => {
  const router = useRouter();

  const {
    data: chatId,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latest-chat-id"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/get-latest-chat-id");
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        if (error.response?.status === 401) {
          router.push("/sign-in");
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });

  const handleCardClick = async (type: string) => {
    if (chatId) {
      switch (type) {
        case "Quizzes":
          router.push(`/quizzes/${chatId}`);
          break;
        case "Flash Notes":
          router.push(`/flashCard/${chatId}`);
          break;
        case "ChatConnect":
          router.push(`/chat/${chatId}`);
          break;
        case "Summaries":
          router.push(`/summary/${chatId}`);
          break;
        default:
          break;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="animate-pulse bg-[#4355FF]/50 rounded-2xl p-6 min-h-[180px]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {components.map((component, index) => (
          <SectionCard
            key={index}
            icon={component.icon}
            title={component.title}
            description={component.description}
            link={component.href}
            onClick={() => handleCardClick(component.title)}
            isDisabled={!chatId}
          />
        ))}
      </div>
    </div>
  );
};

export default CognoHubQuizzesSection;