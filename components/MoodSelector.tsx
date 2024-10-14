import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

interface Mood {
  mood: string;
  image: string;
  color: string;
}

interface MoodSelectorProps {
  onMoodSelect: (mood: string | null) => void;
}

const MoodIntensitySlider: React.FC<{ intensity: number; onChange: (intensity: number) => void }> = ({ intensity, onChange }) => {
  const getColor = (value: number) => {
    const hue = ((10 - value) * 24) % 360;
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 text-center">
        <span className="text-3xl font-bold" style={{ color: getColor(intensity) }}>
          {intensity}
        </span>
      </div>
      <Slider
        value={[intensity]}
        onValueChange={(value: number[]) => onChange(value[0])}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number>(0);
  const [moodReasons, setMoodReasons] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const moods: Mood[] = [
    { mood: "Happy", image: "😊", color: "bg-yellow-300" },
    { mood: "Content", image: "🙂", color: "bg-green-200" },
    { mood: "Calm", image: "😌", color: "bg-blue-200" },
    { mood: "Neutral", image: "😐", color: "bg-gray-300" },
    { mood: "Bored", image: "😒", color: "bg-gray-200" },
    { mood: "Frustrated", image: "😠", color: "bg-red-400" },
    { mood: "Sad", image: "😢", color: "bg-blue-300" },
    { mood: "Depressed", image: "😞", color: "bg-blue-900" },
  ];

  const commonReasons = [
    'Social', 'Sleep', 'Family', 'Eating Habits', 'Self Esteem', 'Weather',
    'School', 'Partner', 'Exams', 'Sports', 'Work', 'Health', 'Finances',
    'Hobbies', 'Personal Growth', 'Relationships', 'Stress', 'Achievements',
    'Travel', 'Exercise', 'Meditation', 'Creativity', 'Nature', 'Pets',
    'Technology', 'News', 'Music', 'Reading', 'Cooking', 'Cleaning',
    'Volunteering', 'Learning', 'Socializing', 'Relaxation', 'Entertainment'
  ];

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  const handleReasonToggle = (reason: string) => {
    setMoodReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (selectedMood) {
      setIsUploading(true);
      try {
        const response = await fetch("/api/upload-mood-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mood: selectedMood,
            intensity: moodIntensity,
            reasons: moodReasons,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload mood data");
        }

        toast({
          title: "Success",
          description: "Mood data uploaded successfully!",
          duration: 3000,
        });

        setTimeout(() => {
          setStep(1);
          setSelectedMood(null);
          setMoodIntensity(0);
          setMoodReasons([]);
          onMoodSelect(null);
        }, 2000);
      } catch (error) {
        console.error("Error uploading mood data:", error);
        toast({
          title: "Error",
          description: "Failed to upload mood data. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Card className="w-[550px] h-[550px] bg-[#FFFDF7] shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="h-1/6">
        <CardTitle className="text-3xl font-bold">
          {step === 1 && <span>Feel Flow Check-In</span>}
          {step === 2 && <span>Mood Intensity Dial</span>}
          {step === 3 && <span>Mood Origin Explorer</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-5/6 overflow-y-auto p-6">
        {step === 1 && (
          <>
            <p className="text-gray-600 mb-6">
              Take a moment to reflect. How are you fee<span className="bg-yellow-200">ling</span> right now?
              This simple awareness can be powerful.
            </p>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {moods.map((item) => (
                <button
                  key={item.mood}
                  className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                    selectedMood === item.mood ? "ring-2 ring-blue-500 scale-105" : ""
                  }`}
                  onClick={() => handleMoodSelection(item.mood)}
                >
                  <div className={`text-4xl mb-1 ${item.color} rounded-full p-2`}>{item.image}</div>
                  <span className="text-xs font-medium mt-1">{item.mood}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600 mb-6">
              How strong is your fee<span className="bg-blue-200">ling</span>?
              Slide the bar to match the intensity of your mood.
            </p>
            <MoodIntensitySlider intensity={moodIntensity} onChange={setMoodIntensity} />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-600 mb-6">
              What is influencing your mood?
              Choose from recently selected or search for the best fit.
            </p>
            <div className="flex mb-4">
              <Input 
                type="text" 
                placeholder="Search reason(s)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button>Search</Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {commonReasons.map(reason => (
                <Button
                  key={reason}
                  variant={moodReasons.includes(reason) ? "default" : "outline"}
                  onClick={() => handleReasonToggle(reason)}
                  className="text-sm rounded-full"
                >
                  {reason}
                </Button>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button onClick={handlePrevStep} className="rounded-full bg-lime-500">
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNextStep} className="rounded-full bg-lime-500">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isUploading} className="rounded-full bg-lime-500">
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSelector;