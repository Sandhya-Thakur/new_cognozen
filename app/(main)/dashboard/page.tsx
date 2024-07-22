"use client";
import GetPdfAttentionData from "@/components/GetPdfAttentionData";
import GetPdfEmotionData from "@/components/GetPdfEmotionData";

export default function DashBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-64 p-8">
      <div>
        <GetPdfAttentionData />
      </div>
      <div>
        <GetPdfEmotionData />
      </div>
    </div>
  );
}
