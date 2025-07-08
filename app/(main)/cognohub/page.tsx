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
      <div className="pt-4 pl-2">
        <span className="bg-yellow-400">Please Refresh page to get Recent Upload</span>
        </div>
      <CognoHubPdf/>
      <FlashCardGroups/>
      <QuizGroups/>
      <QuizSummary/> {/* <- This will now show enhanced data */}
    </div>
  );
};

export default CognoHub;