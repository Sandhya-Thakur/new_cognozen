"use client";

import { Header } from "./cognoHeader";
import CognoHubPdf from "@/components/CognoHubPdf";
import FlashCardGroups from "@/components/GroupFlashCards";
import QuizSummary from "@/components/QuizSummary"

const CognoHub = () => {
  return (
    <div>
      <Header />
      <CognoHubPdf />
      <FlashCardGroups />
     <QuizSummary/>

    </div>
  );
};

export default CognoHub;
