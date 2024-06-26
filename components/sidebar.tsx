import Link from "next/link";
import Image from "next/image";
import { SidebarItem } from "./sidebar-item";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col shadow-lg shadow-indigo-500/40 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-50",
        className,
      )}
    >
      <Link href="/dashboard">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/cognozen.svg" height={50} width={50} alt="cognozen" />
          <h1 className="text-2xl font-extrabold text-blue-800 tracking-wide">
            Cognozen
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Dashboard" href="/dashboard" iconSrc="/dash.svg" />
        <SidebarItem label="CognoHub" href="/cognohub" iconSrc="/library.svg" />
        <SidebarItem
          label="Classroom"
          href="/classroom"
          iconSrc="/school.svg"
        />
      </div>
    </div>
  );
};
