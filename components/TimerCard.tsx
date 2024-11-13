import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, WatchIcon, Plus, Minus } from 'lucide-react';

const TimerCard: React.FC = () => {
  const [duration, setDuration] = useState(1);

  const increaseDuration = () => setDuration(prev => Math.min(prev + 1, 60));
  const decreaseDuration = () => setDuration(prev => Math.max(prev - 1, 1));

  return (
    <Card className="bg-yellow-200 text-white w-full max-w-sm rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-4 flex flex-col items-start space-y-3">
        <div className="w-3 h-3 rounded-full bg-blue-600 self-start"></div>
        
        <Button
          variant="secondary"
          className="bg-yellow-100 hover:bg-yellow-100 text-gray-700 rounded-full py-1 px-3 text-xs font-medium flex items-center gap-1 shadow-sm border border-yellow-300 w-full justify-center"
        >
          <WatchIcon className="w-3 h-3" />
          Stopwatch
        </Button>
        
        <div className="bg-yellow-100 rounded-full py-1 px-3 flex items-center justify-between shadow-sm border border-yellow-300 w-full">
          <Button variant="ghost" onClick={decreaseDuration} className="text-gray-700 p-0 h-auto hover:bg-transparent">
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-xs font-medium text-gray-700">Duration {duration}m</span>
          <Button variant="ghost" onClick={increaseDuration} className="text-gray-700 p-0 h-auto hover:bg-transparent">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <Button
          variant="secondary"
          className="bg-yellow-100 hover:bg-yellow-100 text-gray-700 rounded-full py-1 px-3 text-xs font-medium flex items-center gap-1 shadow-sm border border-yellow-300 w-full justify-center"
        >
          <Timer className="w-3 h-3" />
          Timer
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimerCard;