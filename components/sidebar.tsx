import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item"; // Make sure this path is correct

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full w-64 fixed left-0 top-0 px-4 flex-col text-white",
        className
      )}
      style={{ background: 'var(--BG-Sidebar, #000066)' }}
    >
      <Link href="/dashboard">
        <div className="pt-8 pb-6 flex items-center justify-center pr-8">
          <Image
            src="/cog.svg"
            height={40}
            width={40}
            alt="cognozen"
            className="mr-3"
          />
          <h1 className="text-2xl font-bold text-white pl-2">Cognozen</h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Home" iconSrc="/home.svg" href="/dashboard" />
        <SidebarItem label="Analytics" iconSrc="/insites.svg" href="/seeAllEmotionAttentionData" />
        <SidebarItem
          label="FeelFlow"
          iconSrc="/feelflow.png"
          href="/emotionsTracker"
        />
        <SidebarItem label="CognoHub" iconSrc="/layers.svg" href="/cognohub" />
        <SidebarItem
          label="CognoBuddy"
          iconSrc="/heart.svg"
          href="/CognoBuddy"
        />
        <SidebarItem
          label="Habit Tracker"
          iconSrc="/habitTracker.svg"
          href="/habitsTracker"
        />
        <SidebarItem
          label="Classroom"
          iconSrc="/classroom.png"
          href="/classroom"
        />
        <SidebarItem
          label="MindBliss"
          iconSrc="/mindfulness.png"
          href="/mindBliss"
        />
      </div>
    </div>
  );
};

export default Sidebar;