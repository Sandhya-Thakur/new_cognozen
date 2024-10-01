import React, { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';
import { Mic, MicOff, ChevronDown } from 'lucide-react';

const PREDEFINED_GOALS = [
  "Dedicate 10 minutes each day to mindfulness meditation",
  "Commit to 30 minutes of exercise at least three times a week to boost endorphins",
  "Write down three things you are grateful for each day to cultivate positivity",
  "Aim for 7 hours of quality sleep each night to improve mood and energy levels",
  "Take up a new hobby or skill that excites you, dedicating at least an hour a week to it",
  "Implement short breaks every 90 minutes during workdays to prevent burnout",
];

const GoalEntryForm: React.FC = () => {
  const [newGoal, setNewGoal] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [addedGoals, setAddedGoals] = useState<string[]>([]);
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
      setAddedGoals([...addedGoals, newGoal]);
      setNewGoal("");
      setIsCustomGoal(true);
      toast.success("Goal added successfully!");
    } catch (error) {
      console.error("Error adding goal:", error);
      toast.error("Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendAudioToWhisper(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToWhisper = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/whisper-api', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.text === undefined) {
        toast.error("Received invalid response from transcription service.");
        return;
      }

      setNewGoal(prev => prev + ' ' + data.text);
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

  const deleteSelectedGoals = () => {
    toast.success("Selected goals deleted successfully!");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">

    </div>
  );
};

export default GoalEntryForm;
