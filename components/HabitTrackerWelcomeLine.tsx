import React, { useState, useEffect } from "react";

const HabitTrackerWelcomeLine: React.FC = () => {
  const [motivationalLine, setMotivationalLine] = useState("Stay motivated!");
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchMotivationalLine = async () => {
    try {
      const response = await fetch('/api/motivational-quote');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data: { quote: string } = await response.json();
      setMotivationalLine(data.quote);
    } catch (error) {
      console.error("Error fetching motivational line:", error);
      setMotivationalLine("Stay motivated!");
    }
  };

  useEffect(() => {
    fetchMotivationalLine();

    const interval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        fetchMotivationalLine();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentHour]);

  return (
    <div className="p-4">
      <h2>{formattedDate}</h2>
      <p className="text-xl pt-2 font-semibold text-gray-600 italic">{motivationalLine}</p>
    </div>
  );
};

export default HabitTrackerWelcomeLine;