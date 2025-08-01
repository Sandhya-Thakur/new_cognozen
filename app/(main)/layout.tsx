"use client"
import React from "react";
import { usePathname } from "next/navigation";
import { MobileHeader } from "@/components/mobile-header";
import { SignOut } from "@/components/signout";
import { PermanentSideBar } from "@/components/PermanentSideBar";
import UserDropdownMenu from "@/components/UserDropdownMenu";
import NotificationsBell from "@/components/NotificationsBell";
import WebcamAnalyzer from "@/components/WebCamComponenet";
import { Maximize2 } from 'lucide-react';
import QuizWebcamAnalyzer from "@/components/QuizWebcamAnalyzer";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const pathname = usePathname();

  const renderWebcam = () => {
    if (pathname?.startsWith('/readPdf/')) {
      return <WebcamAnalyzer />;
    } else if (pathname?.startsWith('/quizzes/')) {
      return <QuizWebcamAnalyzer />;
    }
    return null;
  };

  return (
    <>
      <MobileHeader />
      <div className="flex justify-end items-center gap-4 px-8 py-4 bg-white shadow-sm mr-8">
        <SignOut/>
        {renderWebcam()}
        <NotificationsBell />
        <UserDropdownMenu />
        <div className="p-2">
        </div>
        <Maximize2 className="w-6 h-6 text-blue-700 cursor-pointer" />
      </div>
      <div className="flex">
        <PermanentSideBar className="hidden lg:flex" />
        <main className="flex-grow pl-16 h-full lg:pt-2">
          <div className="mx-auto pt-6 lg:pt-0 h-full">{children}</div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;