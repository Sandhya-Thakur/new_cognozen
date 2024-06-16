"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FileUpload } from "@/components/upload-file";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";
import axios from "axios";


const baseComponents = [
  {
    title: "Pdfs",
    href: "/pdf",
    description: "View all your pdfs in folder",
    icon: "/folder.png",
  },
  {
    title: "Summaries",
    href: "/summaries",
    description: "View all your notes summaries",
    icon: "/summery.png",
  },
  {
    title: "Flash Notes",
    href: "/flashcards",
    description: "View all your flashcards",
    icon: "/flash-card.png",
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    description: "View all your quizzes",
    icon: "/q.jpg",
  },
  {
    title: "Chats",
    href: "/chat",
    description: "View all your chats",
    icon: "/chat.png",
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Manage your account settings",
    icon: "/setting.png",
  },
];

type Props = { chatId: number };

export function CognoHubMenu({ chatId }: Props) {
  const [latestId, setLatestId] = React.useState<number | null>(null);
  const router = useRouter();

  const { data, isLoading } = useQuery<Message[]>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const response = await axios.get<Message[]>(
        `/api/get-latest-chat-id?chatId=${chatId}`
      );
      return response.data;
    },
  });

  React.useEffect(() => {
    if (!isLoading && data) {
      const latestId = data; // Assuming the data array has objects with an 'id' property
      setLatestId(Number(latestId)); // Convert latestId to a number
    }
  }, [data, isLoading]);

  const components = baseComponents.map((component) => ({
    ...component,
    href:
      component.title === "Pdfs"
        ? component.href
        : latestId
        ? `${component.href}/${latestId}`
        : component.href,
  }));

  const handleChatClick = () => {
    if (latestId !== null) {
      router.push(`/chat/${latestId}`);
    }
  };
  const handlePdfClick = () => {
    router.push("/pdf");
  };

  return (
    <NavigationMenu className="text-blue-800  ">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Your library</NavigationMenuTrigger>
          <NavigationMenuContent className=" shadow-indigo-500/40 bg-gradient-to-r from-red-100 via-purple-100 to-blue-100">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] text-blue-800 ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}
                >
                  <div className="p-1 text-blue-800">
                    {component.description}
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Upload notes</NavigationMenuTrigger>
          <NavigationMenuContent className=" shadow-indigo-500/40 bg-gradient-to-r from-red-100 via-purple-100 to-blue-100">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <a className="flex h-full w-full select-none flex-col justify-center items-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                  <FileUpload />
                </a>
              </li>
              <div className="p-2">
                <ListItem>
                  <Button
                    variant="ghost"
                    size="rounded"
                    onClick={handlePdfClick}
                  >
                    <Image
                      src="/reading.png"
                      height={40}
                      width={40}
                      alt="cognozen"
                      className="pr-4"
                    />
                    Read Now
                  </Button>
                </ListItem>
                <ListItem>
                  <Button variant="ghost" size="rounded">
                    <Image
                      src="/summery.png"
                      height={50}
                      width={40}
                      alt="cognozen"
                      className="pr-4"
                    />
                    Generate Summary
                  </Button>
                </ListItem>
                <ListItem>
                  <Button variant="ghost" size="rounded">
                    <Image
                      src="/q.jpg"
                      height={50}
                      width={40}
                      alt="cognozen"
                      className="pr-4"
                    />
                    Generate Quizzes
                  </Button>
                </ListItem>
                <ListItem>
                  {latestId && (
                    <Button
                      variant="ghost"
                      size="rounded"
                      onClick={handleChatClick}
                    >
                      <Image
                        src="/pal.png"
                        height={50}
                        width={40}
                        alt="cognozen"
                        className="pr-4"
                      />
                      Chat with PDF
                    </Button>
                  )}
                </ListItem>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon?: string;
    onClick?: (e: React.MouseEvent) => void;
  }
>(({ className, title, children, icon, onClick, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex items-center space-y-1 space-x-2 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          href={href}
          onClick={onClick}
          {...props}
        >
          {icon && (
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="flex-shrink-0"
            />
          )}
          <div>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
