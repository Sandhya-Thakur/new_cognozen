"use client"
import React from 'react';
import FAQTopComponent from "@/components/FAQTopComponent"
import FAQOverallPerformance from "@/components/FAQOverallPerformance"
import QandA from "@/components/QandA"

export default function FAQs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FAQTopComponent />
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-2/3">
          <FAQOverallPerformance />
        </div>
        <div className="md:w-1/3">
          <QandA />
        </div>
      </div>
    </div>
  );
}