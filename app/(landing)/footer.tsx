import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-blue-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Image src="/logo_name.svg" alt="CognoZen Logo" width={80} height={80} />
        </div>
 
    </footer>
  );
};
