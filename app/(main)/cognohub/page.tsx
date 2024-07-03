"use client";

import { Header } from "./cognoHeader";
import { CognoHubLibrary } from "@/components/cognohub-library";
import CognoHubPdf from "@/components/CognoHubPdf"





const CognoHub = () => {
  return (
    <div>
      <Header />
      <CognoHubLibrary />
      <CognoHubPdf />
    </div>
  );
  
};

export default CognoHub;

