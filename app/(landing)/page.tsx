import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Empower Your Mind with CognoZen
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
        Transform your cognitive abilities with our AI-powered Empowerment Suite.
      </p>
    </section>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Personalized Analytics"
            description="Track your progress with detailed insights."
            icon="📊"
          />
          <FeatureCard
            title="CognoHub Library"
            description="Access a vast library of resources."
            icon="📚"
          />
          <FeatureCard
            title="CognoBuddy Support"
            description="Get support from your AI companion."
            icon="🤖"
          />
          <FeatureCard
            title="Interactive Learning"
            description="Engage with gamified learning experiences."
            icon="🎮"
          />
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
        <div className="flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  afterSignInUrl="/emotionsTracker"
                  afterSignUpUrl="/emotionsTracker"
                >
                  <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton
                  mode="modal"
                  afterSignInUrl="/emotionsTracker"
                  afterSignUpUrl="/emotionsTracker"
                >
                  <Button size="lg" className="w-full bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    I already have an account
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                  <Link href="/emotionsTracker">Continue Learning</Link>
                </Button>
                <SignOutButton>
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
                    Logout
                  </Button>
                </SignOutButton>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </main>
  );
}
