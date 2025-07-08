import React from 'react';
import { Card } from '@/components/ui/card';
import DashboardAllHabit from '@/components/DashboardAllHabit';

const HabitsMetricsSection: React.FC = () => {
  return (
    <Card className="w-80 max-w-md mx-auto shadow-[2px_2px_10px_rgba(0,0,0,0.1)] rounded-xl">
      <DashboardAllHabit />
    </Card>
  );
};

export default HabitsMetricsSection;