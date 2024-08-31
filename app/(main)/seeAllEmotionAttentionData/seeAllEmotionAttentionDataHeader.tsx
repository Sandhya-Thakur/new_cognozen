import React from 'react';
import { BarChart2, Brain, Heart, Calendar } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-[#0F52BA] text-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart size={32} className="mr-3 text-[#87CEEB]" />
            <div>
              <h1 className="text-2xl font-bold">Emotional Wellbeing Dashboard</h1>
              <p className="text-[#87CEEB]">Your comprehensive emotional and attention insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-[#87CEEB] text-[#2C3E50] px-3 py-1 rounded">
              <Brain size={20} className="mr-2" />
              <span>Mood: Happy</span>
            </div>
            <div className="flex items-center">
              <Calendar size={20} className="mr-2" />
              <select className="bg-[#0F52BA] text-white p-2 rounded border border-[#87CEEB]">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-[#87CEEB]">
          <div>
            <span>Current Streak:</span>
            <span className="font-bold ml-2 text-white">5 days</span>
          </div>
          <div>
            <span>Weekly Challenge:</span>
            <span className="font-bold ml-2 text-white">Mindfulness Meditation</span>
          </div>
          <div>
            <span>Goals Completed:</span>
            <span className="font-bold ml-2 text-white">3/5</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;