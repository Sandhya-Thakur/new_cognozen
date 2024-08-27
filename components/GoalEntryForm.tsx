"use client";
import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';

const GoalEntryForm: React.FC = () => {
  const [newGoal, setNewGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoaded, userId } = useAuth();

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
      toast.success('Goal added successfully!');
    } catch (error) {
      console.error("Error adding goal:", error);
      toast.error('Failed to add goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-r-lg text-white font-semibold
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