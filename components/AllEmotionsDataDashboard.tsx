import React from "react";
import AllPDFEmotionsData from "./AllPDFEmotionsData";
import AllQuizEmotionsData from "./AllQuizEmotionsData"
const AllEmotionsDataDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4  bg-[#F8F9FA]">
      <h1 className="text-xl font-bold mb-8 text-blue-800">
        All Emotions Data
      </h1>
      <AllPDFEmotionsData />
      <AllQuizEmotionsData/>
    </div>
  );
};

export default AllEmotionsDataDashboard;
