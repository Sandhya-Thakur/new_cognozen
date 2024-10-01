import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 w-full clearNav z-50">
      <div className="max-w-7xl mx-auto p-4 md:p-5 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-x-3">
            <Image
              src="/cognozen.svg"
              height={41}
              width={208}
              alt="CognoZen Logo"
            />
          </Link>
        </div>
        <div className="hidden md:flex flex-grow items-center"></div>
        {/* Authentication Buttons */}
        <div className="flex items-center">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-white animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="ml-4 font-inter text-[16px] bg-[#B2FF0D] text-[#1A1A1E] px-6 hover:bg-[#E3F2FD] border-1 hover:border-[#87CEEB]"
                >
                  Go to Home Page
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                <Button
                  size="lg"
                  className="hidden md:block font-inter text-[16px] bg-[#B2FF0D] text-[#1A1A1E] px-6 hover:bg-[#E3F2FD] border-1 hover:border-[#87CEEB]"
                >
                  Start Free Trial Today
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
        
        {/* Mobile Button - Shown on Small Screens */}
        <div className="block md:hidden">
          <ClerkLoaded>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="font-inter text-[14px] bg-[#B2FF0D] text-[#1A1A1E] px-4 hover:bg-[#E3F2FD] border-1 hover:border-[#87CEEB]">
                  Home
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/dashboard">
                <Button className="font-inter text-[14px] bg-[#B2FF0D] text-[#1A1A1E] px-4 hover:bg-[#E3F2FD] border-1 hover:border-[#87CEEB]">
                  Start Free Trial Today
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};