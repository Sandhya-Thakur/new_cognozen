"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';
import { Mic, MicOff, ChevronDown } from 'lucide-react';

const PREDEFINED_GOALS = [
  "Practice mindfulness for 10 minutes daily",
  "Express gratitude for three things each day",
  "Engage in a relaxing activity before bed",
  "Connect with a friend or family member",
  "Exercise for 30 minutes",
  "Learn a new stress-management technique",
  "Limit social media use to 1 hour per day",
  "Write in a journal for 15 minutes",
  "Try a new hobby or activity",
  "Set and enforce personal boundaries"
];

const GoalEntryForm: React.FC = () => {
  const [newGoal, setNewGoal] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { isLoaded, userId } = useAuth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/upload-wellbeing-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newGoal }),
      });

      if (!response.ok) {
        throw new Error("Failed to add goal");
      }

      const data = await response.json();
      console.log("Goal added:", data.goal);
      setNewGoal("");
      setIsCustomGoal(true);
      toast.success('Goal added successfully!');
    } catch (error) {
      console.error("Error adding goal:", error);
      toast.error('Failed to add goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecording = async () => {
    // ... (previous recording logic remains the same)
  };

  const stopRecording = () => {
    // ... (previous recording logic remains the same)
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
    // ... (previous audio processing logic remains the same)
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setNewGoal(value);
    setIsCustomGoal(value === "custom");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Add Emotional Well-being Goal
      </h2>

      <form onSubmit={addGoal} className="mb-8">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <select
              value={isCustomGoal ? "custom" : newGoal}
              onChange={handleGoalChange}
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="custom">Custom Goal</option>
              {PREDEFINED_GOALS.map((goal, index) => (
                <option key={index} value={goal}>{goal}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={20} />
            </div>
          </div>
          {isCustomGoal && (
            <div className="flex items-center">
              <input
                type="text"
                value={newGoal}
                onChange={handleGoalChange}
                placeholder="Enter a custom goal..."
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={`p-2 ${
                  isRecording ? 'bg-red-500' : 'bg-indigo-600'
                } text-white`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold
              ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalEntryForm;