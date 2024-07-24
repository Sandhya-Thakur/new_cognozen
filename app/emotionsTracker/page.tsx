"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Mood {
  image: string;
  mood: string;
  color: string;
}

interface Goal {
  text: string;
  completed: boolean;
}

const moods: Mood[] = [
  { image: "/happy.png", mood: "Happy", color: "bg-yellow-100" },
  { image: "/sad.png", mood: "Sad", color: "bg-blue-100" },
  { image: "/angry.png", mood: "Angry", color: "bg-red-100" },
  { image: "/sleepy.png", mood: "Tired", color: "bg-purple-100" },
  { image: "/cool.png", mood: "Cool", color: "bg-green-100" },
  { image: "/confused.png", mood: "Confused", color: "bg-orange-100" },
];

export default function EmotionsTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [gratitudeEntry, setGratitudeEntry] = useState<string>("");
  const [goals, setGoals] = useState<Goal[]>([
    { text: "Practice mindfulness for 10 minutes", completed: false },
    { text: "Exercise for 30 minutes", completed: false },
  ]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<
    "Inhale" | "Hold" | "Exhale"
  >("Inhale");
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    setMoodIntensity(null);
  };

  const handleIntensitySelection = (intensity: number) => {
    setMoodIntensity(intensity);
    if (selectedMood) {
      console.log(`Logged mood: ${selectedMood}, Intensity: ${intensity}`);
      // Additional logic like sending the mood to a server

      // Clear the state after logging
      setTimeout(() => {
        setSelectedMood(null);
        setMoodIntensity(null);
      }, 1000); // Delay of 1 second to allow user to see the selection
    }
  };

  const toggleGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals[index].completed = !newGoals[index].completed;
    setGoals(newGoals);
  };

  const handleAddGoal = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.trim() !== "") {
      setGoals([
        ...goals,
        { text: event.currentTarget.value.trim(), completed: false },
      ]);
      event.currentTarget.value = "";
    }
  };

  const handleSaveJournal = () => {
    console.log("Saved journal entry:", journalEntry);
    // Here you would typically also save the entry to a database or send it to a server
    setJournalEntry("");
  };

  const handleSaveGratitude = () => {
    console.log("Saved gratitude entry:", gratitudeEntry);
    // Here you would typically also save the entry to a database or send it to a server
    setGratitudeEntry("");
  };

  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    if (isBreathing) {
      breathingInterval = setInterval(() => {
        setBreathingPhase((prev) => (prev === "Inhale" ? "Exhale" : "Inhale"));
      }, 4000); // Switch every 4 seconds
    }
    return () => clearInterval(breathingInterval);
  }, [isBreathing]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            setBreathingPhase((prevPhase) => {
              if (prevPhase === "Inhale") return "Hold";
              if (prevPhase === "Hold") return "Exhale";
              setCycles((prevCycles) => prevCycles + 1);
              return "Inhale";
            });
            return breathingPhase === "Hold" ? 2 : 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathingPhase]);

  const toggleBreathingExercise = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathingPhase("Inhale");
      setTimer(4);
      setCycles(0);
    }
  };

  const getCircleStyle = () => {
    const baseStyle =
      "w-40 h-40 rounded-full border-4 transition-all duration-1000 flex items-center justify-center";
    switch (breathingPhase) {
      case "Inhale":
        return `${baseStyle} border-blue-500 scale-100`;
      case "Hold":
        return `${baseStyle} border-green-500 scale-110`;
      case "Exhale":
        return `${baseStyle} border-red-500 scale-90`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 text-white p-4 rounded-b-lg shadow-md">
        <h1 className="text-xl font-bold">How are you feeling Today?</h1>
      </header>
      <main className="flex flex-col items-center p-4 mt-8">
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
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <section className="mt-8 w-full max-w-4xl p-4 rounded-xl bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Daily Journal</h2>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Write about your day..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          ></textarea>
          <button
            onClick={handleSaveJournal}
            className="mt-2 px-4 py-2 bg-indigo-300 text-white rounded-2xl hover:bg-indigo-500 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            Save Journal
          </button>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Mood History</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 border-b border-gray-200">
              <span>😊 Happy</span>
              <span className="text-gray-500">July 22, 2024</span>
            </li>
            <li className="flex items-center justify-between p-2 border-b border-gray-200">
              <span>😢 Sad</span>
              <span className="text-gray-500">July 21, 2024</span>
            </li>
            {/* More history items */}
          </ul>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Insights & Tips</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h3 className="font-bold text-yellow-900">Tip of the Day</h3>
              <p>
                Take a few minutes to practice deep breathing exercises to help
                manage stress.
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <h3 className="font-bold text-green-900">Insight</h3>
              <p>
                You've been feeling happy most often in the mornings. Consider
                starting your day with activities that boost your mood.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Mood Trends</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <p>Implement your mood trends chart here</p>
          </div>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            Emotional Well-being Goals
          </h2>
          <ul>
            {goals.map((goal, index) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(index)}
                  className="mr-2"
                />
                <span
                  className={goal.completed ? "line-through text-gray-500" : ""}
                >
                  {goal.text}
                </span>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add a new goal"
            onKeyPress={handleAddGoal}
            className="w-full mt-4 p-2 border rounded"
          />
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Suggested Activities</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">Take a short walk outside</li>
            <li className="mb-2">Listen to your favorite uplifting music</li>
            <li className="mb-2">
              Practice mindfulness meditation for 10 minutes
            </li>
            <li className="mb-2">Call a friend or family member for a chat</li>
          </ul>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 rounded-xl bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Gratitude Journal</h2>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="What are you grateful for today?"
            value={gratitudeEntry}
            onChange={(e) => setGratitudeEntry(e.target.value)}
          ></textarea>
          <button
            onClick={handleSaveGratitude}
            className="mt-2 px-4 py-2 bg-indigo-300 text-white rounded-2xl hover:bg-indigo-500 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            Save Gratitude Entry
          </button>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Mood Comparison</h2>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="font-bold mb-2">This Week</h3>
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                <p>Implement week mood summary</p>
              </div>
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="font-bold mb-2">Last Week</h3>
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                <p>Implement last week mood summary</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Breathing Exercise</h2>
          <div className="text-center">
            <div className={getCircleStyle()}>
              <p className="text-4xl mb-4">{breathingPhase}</p>
            </div>
            <p className="text-2xl mt-4">Timer: {timer}s</p>
            <p className="text-xl mt-2">Cycles completed: {cycles}</p>
            <button
              onClick={toggleBreathingExercise}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
              {isBreathing ? "Stop" : "Start"} Breathing Exercise
            </button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center p-4 mt-8">
        <button className="bg-indigo-500 text-white py-4 px-8 rounded-2xl hover:bg-indigo-300 transition-all duration-300">
          <Link href="/dashboard">Continue Learning</Link>
        </button>
      </footer>
    </div>
  );
}
