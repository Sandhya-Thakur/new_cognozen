import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import JournalEntryForm from "@/components/JournalEntryForm";
import GratitudeEntryForm from "@/components/GratitudeEntryForm";
import GoalEntryForm from "@/components/GoalEntryForm";

const JournalsAndGoals = () => {
  return (
    <Card className="rounded-xl">
      <CardContent>
        <div>
          <JournalEntryForm />
          <div>
            <GratitudeEntryForm />
          </div>
          <div>
            <GoalEntryForm />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalsAndGoals;
