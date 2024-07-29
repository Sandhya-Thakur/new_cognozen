"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface Goal {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
}

const EmotionalWellbeingGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchGoals();
    }
  }, [isLoaded, userId]);

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/get-wellbeing-data");
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to load goals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

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
      setGoals([...goals, data.goal]);
      setNewGoal("");
    } catch (error) {
      console.error("Error adding goal:", error);
      setError("Failed to add goal. Please try again.");
    }
  };

  const toggleGoalCompletion = async (goalId: number) => {
    try {
      const response = await fetch(`/api/update.wellbeing-data/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !goals.find((g) => g.id === goalId)?.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      setGoals(
        goals.map((goal) =>
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        )
      );
    } catch (error) {
      console.error("Error updating goal:", error);
      setError("Failed to update goal. Please try again.");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Emotional Well-being Goals
      </h2>

      <form onSubmit={addGoal} className="mb-8">
        <div className="flex items-center">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Goal
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <p>Loading goals...</p>
      ) : (
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center bg-white shadow rounded-lg p-4"
            >
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoalCompletion(goal.id)}
                className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span
                className={`flex-grow ${goal.completed ? "line-through text-gray-500" : ""}`}
              >
                {goal.content}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(goal.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmotionalWellbeingGoals;
