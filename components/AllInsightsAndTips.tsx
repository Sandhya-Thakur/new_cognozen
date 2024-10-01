import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InsightsAndTips from "@/components/InsightsAndTips"

interface AllInsightsAndTipsProps {
  mood: string;
}

const AllInsightsAndTips: React.FC<AllInsightsAndTipsProps> = ({ mood }) => {
  return (
    <Card className='rounded-xl'>
        <InsightsAndTips/>
    </Card>
  );
};

export default AllInsightsAndTips;