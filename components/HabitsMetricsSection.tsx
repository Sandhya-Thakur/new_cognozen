import React from 'react';
import { Card } from '@/components/ui/card';
import AllsHabits from "@/components/AllHabits"

const HabitsMetricsSection: React.FC = () => {
  return (
    <Card className="w-80 max-w-md mx-auto shadow-[2px_2px_10px_rgba(0,0,0,0.1)] rounded-xl">
      <AllsHabits />
    </Card>
  );
};

export default HabitsMetricsSection;