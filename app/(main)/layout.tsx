import React from "react";
import { MobileHeader } from "@/components/mobile-header";
import { SignOut } from "@/components/signout";
import { PermanentSideBar } from "@/components/PermanentSideBar";
import UserDropdownMenu from "@/components/UserDropdownMenu";
import NotificationsBell from "@/components/NotificationsBell";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <div className="flex justify-end items-center gap-4 px-8 py-4 bg-white shadow-sm">
        <SignOut />
        <NotificationsBell />
        <UserDropdownMenu />
      </div>
      <div className="flex">
        <PermanentSideBar className="hidden lg:flex" />
        <main className="flex-grow pl-16 h-full lg:pt-0">
          <div className="mx-auto pt-6 lg:pt-0 h-full">{children}</div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;