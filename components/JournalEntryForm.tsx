"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { Mic, MicOff } from "lucide-react";

const JournalEntryForm: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { isLoaded, userId } = useAuth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const saveJournalEntry = async () => {
    if (!isLoaded || !userId) {
      setFeedback({
        message: "You must be logged in to save a journal entry.",
        type: "error",
      });
      return;
    }

    if (!journalEntry.trim()) {
      setFeedback({ message: "Journal entry cannot be empty.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      console.log("Saving journal entry...");
      const response = await fetch("/api/upload-journal-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: journalEntry }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const data = await response.json();
      console.log("Journal entry saved:", data.entry);
      setFeedback({
        message: "Journal entry saved successfully!",
        type: "success",
      });
      setJournalEntry(""); // Clear the textarea after successful save
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setFeedback({
        message: "Failed to save journal entry. Please try again.",
        type: "error",
      });
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        sendAudioToWhisper(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
      setFeedback({
        message: "Unable to access microphone. Please check your permissions.",
        type: "error",
      });
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
    formData.append("audio", audioBlob, "recording.wav");

    try {
      console.log("Sending request to Whisper API...");
      const response = await fetch("/api/whisper-api", {
        method: "POST",
        body: formData,
      });

      console.log("Received response from Whisper API", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to transcribe audio: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Transcription data:", data);

      if (data.text === undefined) {
        console.error("Received undefined text from API");
        setFeedback({
          message: "Received invalid response from transcription service.",
          type: "error",
        });
        return;
      }

      setJournalEntry((prev) => {
        const newEntry = prev + " " + data.text;
        console.log("Updated journal entry:", newEntry);
        return newEntry;
      });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setFeedback({
        message: "Failed to transcribe audio. Please try again.",
        type: "error",
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Daily Journal
      </h2>
      <div className="mb-4 relative">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Write about your day..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        <button
          className={`absolute bottom-4 right-4 p-2 rounded-full ${
            isRecording ? "bg-green-500" : "bg-indigo-600"
          } text-white hover:${isRecording ? "bg-green-600" : "bg-indigo-700"} transition-colors duration-200`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
      </div>
      <div className="flex justify-end mb-8">
        <button
          className={`px-6 py-2 rounded-lg text-white font-semibold
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            }`}
          onClick={saveJournalEntry}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Entry"}
        </button>
      </div>
      {feedback && (
        <div
          className={`mb-4 p-3 rounded-lg ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default JournalEntryForm;