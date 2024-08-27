import React, { useState } from "react";

interface Mood {
  image: string;
  mood: string;
  color: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  onMoodSelect: (mood: string | null) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ moods, onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    setMoodIntensity(null);
    onMoodSelect(mood);
  };

  const handleIntensitySelection = async (intensity: number) => {
    setMoodIntensity(intensity);
    if (selectedMood) {
      await uploadMoodData(selectedMood, intensity);
    }
  };

  const uploadMoodData = async (mood: string, intensity: number) => {
    setIsUploading(true);
    try {
      const response = await fetch("/api/upload-mood-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload mood data");
      }

      setUploadStatus("success");
      setTimeout(() => {
        setSelectedMood(null);
        setMoodIntensity(null);
        setUploadStatus(null);
        onMoodSelect(null);
      }, 2000);
    } catch (error) {
      console.error("Error uploading mood data:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 rounded-lg shadow-md bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">
        How are you feeling today?
      </h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {moods.map((item) => (
          <button
            key={item.mood}
            className={`aspect-square p-4 ${
              selectedMood === item.mood
                ? "ring-2 ring-indigo-500 bg-indigo-50"
                : "bg-gray-50 hover:bg-gray-100"
            } rounded-lg flex flex-col items-center justify-center transition-all duration-300`}
            onClick={() => handleMoodSelection(item.mood)}
            disabled={isUploading}
          >
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.mood}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {item.mood}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center text-indigo-700 text-lg font-medium bg-indigo-50 py-3 px-6 rounded-md">
        {selectedMood ? `I am feeling: ${selectedMood}` : "Select your mood"}
      </p>

      {selectedMood && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood Intensity
          </label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((intensity) => (
              <button
                key={intensity}
                onClick={() => handleIntensitySelection(intensity)}
                className={`w-10 h-10 rounded-full ${
                  moodIntensity === intensity
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-indigo-100"
                } flex items-center justify-center font-medium text-sm transition-all duration-200`}
                disabled={isUploading}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <p className="mt-4 text-center text-indigo-600">
          Uploading mood data...
        </p>
      )}

      {uploadStatus === "success" && (
        <p className="mt-4 text-center text-green-600">
          Mood data uploaded successfully!
        </p>
      )}

      {uploadStatus === "error" && (
        <p className="mt-4 text-center text-red-600">
          Failed to upload mood data. Please try again.
        </p>
      )}
    </div>
  );
};

export default MoodSelector;
