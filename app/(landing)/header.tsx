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
    <header className="h-20 w-full border-b-2 border-indigo-200 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <Link href="/" className="flex items-center gap-x-3">
          <Image
            src="/cognozen.svg"
            height={50}
            width={50}
            alt="CognoZen Logo"
          />
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            CognoZen
          </h1>
        </Link>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-white animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/emotionsTracker"
              afterSignUpUrl="/emotionsTracker"
            >
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};