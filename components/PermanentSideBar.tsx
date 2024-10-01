import React from 'react';
import Link from 'next/link';
import { Home, BarChart, Activity, Layers, Heart, Calendar, BookOpen, Brain, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const GradientCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B6B" />
        <stop offset="1" stopColor="#4A67E7" />
      </linearGradient>
    </defs>
  </svg>
);

const IconButton = ({ icon: Icon, title, href }: { icon: React.ElementType; title: string; href?: string }) => {
  const ButtonContent = (
    <button className="mb-8">
      <Icon size={20} color="white" />
    </button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>
              {ButtonContent}
            </Link>
          ) : (
            ButtonContent
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PermanentSideBar = ({ className }: Props) => {
  return (
    <div className={cn("fixed left-0.5 top-0.5 rounded-xl h-full w-16 flex flex-col items-center py-4", className)} style={{ background: 'var(--BG-Sidebar, #000066)' }}>
      <Sheet>
        <SheetTrigger asChild>
          <button className="mt-2 mb-16">
            <GradientCircleIcon />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <div className="bg-white h-full relative">
            <SheetClose className="absolute top-4 right-4">
              <X size={24} />
            </SheetClose>
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>

      <IconButton icon={Home} title="Home" href="/dashboard" />
      <IconButton icon={BarChart} title="Analytics" href="/seeAllEmotionAttentionData" />
      <IconButton icon={Activity} title="FeelFlow" href="/emotionsTracker" />
      <IconButton icon={Layers} title="CognoHub" href="/cognohub" />
      <IconButton icon={Heart} title="CognoBuddy" />
      <IconButton icon={Calendar} title="Habit Tracker" href="/habitsTracker" />
      <IconButton icon={BookOpen} title="Classroom" href="/classroom" />
      <IconButton icon={Brain} title="MindBliss" href="/mindBliss" />
    </div>
  );
};