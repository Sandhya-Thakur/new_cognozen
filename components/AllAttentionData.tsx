
import React from "react";
import AllPDFAttentionData from "./AllPDFAttentionData";
import AllQuizAttentionData from "./AllQuizAttentionData"

const AllAttentionData: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 bg-[#F8F9FA]">
       <h1 className="text-xl font-bold mb-8 text-amber-800">All Attention Data</h1>
      <AllPDFAttentionData />
      <AllQuizAttentionData/>
    </div>
  );
};

export default AllAttentionData;