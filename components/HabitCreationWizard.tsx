
import React, { useState } from 'react';

interface HabitCreationWizardProps {
  onClose: () => void;
}

const HabitCreationWizard: React.FC<HabitCreationWizardProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/habits/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, frequency, timeOfDay }),
      });

      if (!response.ok) {
        throw new Error('Failed to create habit');
      }

      const data = await response.json();
      console.log('Habit created:', data.habit);
      onClose(); // Close the wizard after successful creation
    } catch (error) {
      console.error('Error creating habit:', error);
      setError('Failed to create habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Habit</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Habit Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="e.g., Read a book"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
            placeholder="e.g., Read at least 20 pages of a book to improve knowledge and vocabulary"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700">Time of Day (optional)</label>
          <input
            type="text"
            id="timeOfDay"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="e.g., Before bed, After breakfast"
          />
        </div>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full mr-2 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitCreationWizard;