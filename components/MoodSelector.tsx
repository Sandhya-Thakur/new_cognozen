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
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);

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
      const response = await fetch('/api/upload-mood-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload mood data');
      }

      setUploadStatus("success");
      // Clear the state after successful upload
      setTimeout(() => {
        setSelectedMood(null);
        setMoodIntensity(null);
        setUploadStatus(null);
        onMoodSelect(null);
      }, 2000);
    } catch (error) {
      console.error('Error uploading mood data:', error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 rounded-2xl shadow-lg transform transition-all hover:scale-105 duration-300 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 animate-pulse">
        How are you feeling today?
      </h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        {moods.map((item) => (
          <button
            key={item.mood}
            className={`aspect-square p-4 ${item.color} ${
              selectedMood === item.mood
                ? "ring-4 ring-indigo-500 scale-105"
                : ""
            } rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl`}
            onClick={() => handleMoodSelection(item.mood)}
            disabled={isUploading}
          >
            <div className="w-24 h-24 mb-2 flex items-center justify-center rounded-full ">
              <img
                src={item.image}
                alt={item.mood}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-sm font-bold text-indigo-900">
              {item.mood}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center text-indigo-700 text-xl font-semibold bg-indigo-100 py-3 px-6 rounded-full shadow-inner">
        {selectedMood
          ? `I am feeling: ${selectedMood}`
          : "Click an emoji to select your mood"}
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
                className={`w-12 h-12 rounded-full ${
                  moodIntensity === intensity
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                } flex items-center justify-center font-bold text-lg transition-all duration-200 hover:bg-indigo-400`}
                disabled={isUploading}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <p className="mt-4 text-center text-indigo-600">Uploading mood data...</p>
      )}

      {uploadStatus === "success" && (
        <p className="mt-4 text-center text-green-600">Mood data uploaded successfully!</p>
      )}

      {uploadStatus === "error" && (
        <p className="mt-4 text-center text-red-600">Failed to upload mood data. Please try again.</p>
      )}
    </div>
  );
};

export default MoodSelector;