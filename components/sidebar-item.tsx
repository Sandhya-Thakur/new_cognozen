"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebar" : "ghost"}
      className={`justify-start h-[52px] w-full text-white hover:text-white hover:bg-white/10 transition-colors ${
        active ? 'bg-white/20' : ''
      }`}
      asChild
    >
      <Link href={href} className="flex items-center">
        <div className="relative w-5 h-5 mr-3">
          <Image
            src={iconSrc}
            alt={label}
            layout="fill"
            className="invert"
          />
        </div>
        <span>{label}</span>
      </Link>
    </Button>
  );
};