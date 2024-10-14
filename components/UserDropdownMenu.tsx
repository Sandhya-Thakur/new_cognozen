"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SignOut } from "@/components/signout";
import { useRouter } from "next/navigation";

const UserDropdownMenu = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-8 h-8 p-0 rounded-full">
            <ChevronDown className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 px-6" align="end">
          <DropdownMenuLabel>
            <div className="flex items-center">
              <SignOut />
              <div className="ml-4">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigation("/account")}>Account</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/settings")}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/upgrade")}>
            Upgrade to{" "}
            <span className="ml-1 px-1 bg-yellow-200 text-yellow-800 rounded">
              PRO
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/notifications")}>
            Notifications{" "}
            <span className="ml-1 px-1 bg-red-500 text-white rounded-full text-xs">
              12
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/download-insights")}>
            Download Insights{" "}
            <span className="ml-1 text-xs text-blue-500">Free Trial</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/saved-insights")}>Insights & Tips Saved</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/invite-cognopal")}>
            Invite CognoPal{" "}
            <span className="ml-1 text-xs text-gray-500">Coming Soon</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/schedule-habit")}>
            Schedule Habit{" "}
            <span className="ml-1 px-1 bg-green-200 text-green-800 rounded text-xs">
              New
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/faqs")}>FAQs</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/about")}>About CognoZen</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/feedback")}>Feedback</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/legal")}>Legal & Terms</DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdownMenu;