import React from 'react';
import { usePoll } from '../contexts/PollContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Poll = () => {
  const { pollData, vote } = usePoll();

  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pollData.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {pollData.options.map(option => (
          <div key={option.id} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span>{option.text}</span>
              <Button onClick={() => vote(option.id)}>Vote</Button>
            </div>
            <Progress value={(option.votes / totalVotes) * 100 || 0} className="w-full" />
            <span className="text-sm">{option.votes} votes</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Poll;