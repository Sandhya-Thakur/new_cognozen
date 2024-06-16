"use client";
import { useStore } from "@/lib/store";
import FaceEmotionAnalysis from "@/components/FaceEmotionAnalysis";
import FaceAttentionAnalysis from "@/components/FaceAttentionAnalysis";

export default function EmotionDashboard() {
  const emotionData = useStore((state) => state.emotionData);
  const attentionData = useStore((state) => state.attentionData);
  const isCameraOn = useStore((state) => state.isCameraOn);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {isCameraOn && attentionData && (
        <FaceAttentionAnalysis attentionData={attentionData} />
      )}
      {isCameraOn && emotionData && (
        <FaceEmotionAnalysis emotionData={emotionData} />
      )}
      {!isCameraOn && (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">No Data Available</h2>
        </div>
      )}
    </main>
  );
}
