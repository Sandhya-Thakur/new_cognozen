import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import { Mic, MicOff, ChevronDown, Save, Edit, Trash, Check } from "lucide-react";

const PREDEFINED_GOALS = [
  "Dedicate 10 minutes each day to mindfulness meditation",
  "Commit to 30 minutes of exercise at least three times a week to boost endorphins",
  "Write down three things you are grateful for each day to cultivate positivity",
  "Aim for 7 hours of quality sleep each night to improve mood and energy levels",
  "Take up a new hobby or skill that excites you, dedicating at least an hour a week to it",
  "Implement short breaks every 90 minutes during workdays to prevent burnout",
  "Practice deep breathing exercises for 5 minutes when feeling stressed",
  "Spend 15 minutes a day reading for pleasure to unwind and stimulate your mind",
  "Call or message a friend or family member once a week to maintain social connections",
  "Try a new healthy recipe each week to improve your diet and cooking skills",
  "Spend 30 minutes in nature at least twice a week to reduce stress and improve mood",
  "Set aside 20 minutes each evening for a relaxing bedtime routine",
  "Practice positive self-talk by challenging negative thoughts daily",
  "Limit social media use to 30 minutes a day to reduce digital stress",
  "Volunteer or perform a random act of kindness once a month to boost happiness"
];

interface Goal {
  id: number;
  content: string;
  completed: boolean;
}

const GoalEntryForm: React.FC = () => {
  const [newGoal, setNewGoal] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const { isLoaded, userId } = useAuth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchGoals();
    }
  }, [isLoaded, userId]);

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/wellbeing-goals");
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to fetch goals. Please try again.");
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/wellbeing-goals", {
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
      setIsCustomGoal(true);
      toast.success("Goal added successfully!");
    } catch (error) {
      console.error("Error adding goal:", error);
      toast.error("Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGoal = async (id: number, content: string) => {
    try {
      const response = await fetch(`/api/wellbeing-goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      const updatedGoal = await response.json();
      setGoals(goals.map(goal => goal.id === id ? updatedGoal : goal));
      setEditingGoalId(null);
      toast.success("Goal updated successfully!");
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal. Please try again.");
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const response = await fetch(`/api/wellbeing-goals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      setGoals(goals.filter(goal => goal.id !== id));
      toast.success("Goal deleted successfully!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal. Please try again.");
    }
  };

  const toggleGoalCompletion = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/wellbeing-goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal completion status");
      }

      const updatedGoal = await response.json();
      setGoals(goals.map(goal => goal.id === id ? updatedGoal : goal));
      toast.success(`Goal marked as ${!completed ? 'completed' : 'incomplete'}!`);
    } catch (error) {
      console.error("Error updating goal completion status:", error);
      toast.error("Failed to update goal status. Please try again.");
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        sendAudioToWhisper(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error(
        "Unable to access microphone. Please check your permissions."
      );
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
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("/api/whisper-api", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to transcribe audio: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.text === undefined) {
        toast.error("Received invalid response from transcription service.");
        return;
      }

      setNewGoal((prev) => prev + " " + data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Failed to transcribe audio. Please try again.");
    }
  };

  const handleGoalChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
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
      <h2 className="text-xl font-bold mb-2 text-gray-800">Feel Good Goals</h2>
      <p className="text-gray-600 mb-6">
        Set goals to enhance your emotional well-being.
      </p>

      <form onSubmit={addGoal} className="mb-8">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              value={newGoal}
              onChange={handleGoalChange}
              placeholder="Add your personal goal(s)..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
                ${isRecording ? "bg-red-500" : "bg-blue-500"} text-white`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          <div className="relative">
            <select
              value={isCustomGoal ? "custom" : newGoal}
              onChange={handleGoalChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              disabled={isSubmitting}
            >
              <option value="custom">Select goals from list</option>
              {PREDEFINED_GOALS.map((goal, index) => (
                <option key={index} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={20} />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center w-40 justify-center bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition duration-300"
            disabled={isSubmitting}
          >
            <Save size={20} className="mr-2" />
            Save Goal
          </button>
        </div>
      </form>

      <div className="mb-4">
        <span className="text-blue-600 font-semibold">
          Goals ({goals.length})
        </span>
      </div>

      <ul className="space-y-2">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoalCompletion(goal.id, goal.completed)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            {editingGoalId === goal.id ? (
              <input
                type="text"
                value={goal.content}
                onChange={(e) => setGoals(goals.map(g => g.id === goal.id ? {...g, content: e.target.value} : g))}
                className="flex-grow p-1 border rounded"
              />
            ) : (
              <span className={`flex-grow ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {goal.content}
              </span>
            )}
            {editingGoalId === goal.id ? (
              <button
                onClick={() => updateGoal(goal.id, goal.content)}
                className="text-green-500 hover:text-green-600"
              >
                <Save size={20} />
              </button>
            ) : (
              <button
                onClick={() => setEditingGoalId(goal.id)}
                className="text-blue-500 hover:text-blue-600"
              >
                <Edit size={20} />
              </button>
            )}
            <button
              onClick={() => deleteGoal(goal.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalEntryForm;