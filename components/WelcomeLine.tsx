import React from "react";
import { useUser } from "@clerk/nextjs";
import CurrentMood from "@/components/CurrentMood";

const WelcomeLine: React.FC = () => {
  const { user } = useUser();
  const firstName = user?.firstName || "User";

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{formattedDate}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            {getGreeting()}, {firstName}
          </h1>
        </div>
        <div className="mt-2 sm:mt-0">
          <CurrentMood />
        </div>
      </div>
    </div>
  );
};

export default WelcomeLine;