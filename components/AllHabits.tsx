import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";

interface Habit {
  id: number;
  name: string;
  isActive: boolean;
}

interface HabitCompletion {
  habitId: number;
  completedAt: string;
  value: number;
}

const ManualHabitCompletionForm: React.FC<{ habits: Habit[], onComplete: () => void }> = ({ habits, onComplete }) => {
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionValue, setCompletionValue] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) {
      toast.error('Please select a habit');
      return;
    }

    try {
      const response = await fetch('/api/habits/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitId: selectedHabit,
          completedAt: completionDate,
          value: completionValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add completion');
      }

      toast.success('Habit completion added successfully');
      setSelectedHabit(null);
      setCompletionDate(new Date().toISOString().split('T')[0]);
      setCompletionValue(1);
      onComplete();
    } catch (error) {
      console.error('Error adding completion:', error);
      toast.error('Failed to add completion. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={selectedHabit || ''}
        onChange={(e) => setSelectedHabit(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Select a habit</option>
        {habits.map((habit) => (
          <option key={habit.id} value={habit.id}>{habit.name}</option>
        ))}
      </select>
      <input
        type="date"
        value={completionDate}
        onChange={(e) => setCompletionDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="number"
        value={completionValue}
        onChange={(e) => setCompletionValue(Number(e.target.value))}
        min="1"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
        Add Completion
      </button>
    </form>
  );
};

const AllsHabits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchTodaysHabits = useCallback(async () => {
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch("/api/habits/all", {
          headers: {
            "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
        fetch("/api/habits/today-completion"),
      ]);

      if (habitsResponse.ok && completionsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const completionsData = await completionsResponse.json();
        setHabits(habitsData.habits);
        setCompletions(completionsData.completions);
        setError(null);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching habits and completions:", error);
      setError("Failed to load habits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodaysHabits();
  }, [fetchTodaysHabits]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isHabitCompleted = (habitId: number) => {
    return completions.some((completion) => completion.habitId === habitId);
  };

  const toggleCompletion = (habitId: number) => {
    const completed = isHabitCompleted(habitId);
    toast.success(completed ? "Habit marked as incomplete" : "Habit completed!");
    // API call to update the completion status can be added here
  };

  const handleCompletionAdded = () => {
    setIsModalOpen(false);
    fetchTodaysHabits();
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading habits...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 h-[325px] flex flex-col relative">
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
        >
          ⋮
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button
                onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Add Completion
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Edit Habits
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                View Statistics
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Manual Habit Completion</h2>
            <ManualHabitCompletionForm habits={habits} onComplete={handleCompletionAdded} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Habits</h3>
      {habits.length === 0 ? (
        <p className="text-gray-500">
          No habits scheduled for today. Why not add one?
        </p>
      ) : (
        <div className="overflow-y-auto flex-grow">
          <ul className="space-y-3">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <h4 className="font-medium text-gray-700">{habit.name}</h4>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      habit.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {habit.isActive ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={isHabitCompleted(habit.id)}
                    onChange={() => toggleCompletion(habit.id)}
                    className="w-4 h-4"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllsHabits;