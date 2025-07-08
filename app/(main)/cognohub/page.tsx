"use client";
import CognoHubWelcomeLine from "@/components/CognoHubWelcomeLine";
import { Header } from "./cognoHeader";
import CognoHubPdf from "@/components/CognoHubPdf";
import FlashCardGroups from "@/components/GroupFlashCards";
import QuizGroups from "@/components/QuizGroup"
import QuizSummary from "@/components/QuizSummary" // <- Your updated component

const CognoHub = () => {
  return (
    <div>
      <Header />
      <CognoHubPdf/>
      <FlashCardGroups/>
      <QuizGroups/>
      <QuizSummary/> {/* <- This will now show enhanced data */}
    </div>
  );
};

export default CognoHub;