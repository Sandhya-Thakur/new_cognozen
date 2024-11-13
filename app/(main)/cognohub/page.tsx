"use client";
import CognoHubWelcomeLine from "@/components/CognoHubWelcomeLine";
import { Header } from "./cognoHeader";
import CognoHubPdf from "@/components/CognoHubPdf";
import FlashCardGroups from "@/components/GroupFlashCards";
import QuizGroups from "@/components/QuizGroup"
import QuizSummary from "@/components/QuizSummary"

const CognoHub = () => {
  return (
    <div>
      <Header />
      <CognoHubPdf/>
      <FlashCardGroups/>
      <QuizGroups/>
      <QuizSummary/>



    </div>
  );
};

export default CognoHub;
