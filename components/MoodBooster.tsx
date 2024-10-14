import React from 'react';
import { Card} from "@/components/ui/card";
import SuggestedActivities from "@/components/SuggestedActivities"

const MoodBooster = () => {
  return (
    <Card className='rounded-xl'>
        <SuggestedActivities/>
    </Card>
  );
};

export default MoodBooster;