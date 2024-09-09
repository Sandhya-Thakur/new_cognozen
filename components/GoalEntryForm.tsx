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
  "Set and enforce personal boundaries",
  "Meditate for 15 minutes each morning",
  "Practice deep breathing exercises twice daily",
  "Read a chapter of a self-help book weekly",
  "Take a 20-minute nature walk",
  "Perform one random act of kindness daily",
  "Maintain a consistent sleep schedule",
  "Practice positive self-talk throughout the day",
  "Engage in a creative activity for 30 minutes",
  "Try a new healthy recipe each week",
  "Declutter a small space in your home",
  "Practice active listening in conversations",
  "Start a gratitude journal",
  "Learn and practice a new coping skill",
  "Engage in 10 minutes of stretching or yoga",
  "Set aside time for a hobby you enjoy",
  "Create and follow a weekly meal plan",
  "Practice forgiveness towards yourself and others",
  "Take regular breaks during work hours",
  "Limit caffeine intake after 2 PM",
  "Spend 15 minutes reflecting on personal growth"
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
    console.log("Starting recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("Recording stopped, sending to Whisper...");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioToWhisper(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      console.log("No active recording to stop");
    }
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
    console.log("Preparing to send audio to Whisper API...");
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      console.log("Sending request to Whisper API...");
      const response = await fetch('/api/whisper-api', {
        method: 'POST',
        body: formData,
      });

      console.log("Received response from Whisper API", response.status);

      if (!response.ok) {
        throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Transcription data:", data);

      if (data.text === undefined) {
        console.error("Received undefined text from API");
        toast.error("Received invalid response from transcription service.");
        return;
      }

      setNewGoal(prev => {
        const newGoal = prev + ' ' + data.text;
        console.log("Updated goal:", newGoal);
        return newGoal;
      });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error("Failed to transcribe audio. Please try again.");
    }
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
          <div className="relative">
            <select
              value={isCustomGoal ? "custom" : newGoal}
              onChange={handleGoalChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
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
                className={`p-2 rounded-r-lg ${
                  isRecording ? "bg-green-500" : "bg-indigo-600"
                } text-white hover:${isRecording ? "bg-green-600" : "bg-indigo-700"} transition-colors duration-200`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
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