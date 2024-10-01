import React from "react";

const CognoHubWelcomeLine: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
    </div>
  );
};

export default CognoHubWelcomeLine;
