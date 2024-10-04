import React from 'react';
import { usePoll } from '../contexts/PollContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from 'lucide-react';

const Poll = () => {
  const { pollData, vote, hasVoted } = usePoll();
  const { user } = useAuth();

  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{pollData.question}</CardTitle>
      </CardHeader>
      <CardContent>
        {pollData.options.map(option => (
          <div key={option.id} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">{option.text}</span>
              <Button 
                onClick={() => vote(option.id)} 
                disabled={hasVoted || !user}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Vote
              </Button>
            </div>
            <Progress value={(option.votes / totalVotes) * 100 || 0} className="w-full h-2 bg-gray-200" />
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">{option.votes} votes</span>
              <span className="text-sm text-gray-600">
                {totalVotes > 0 ? `${((option.votes / totalVotes) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        ))}
        {hasVoted && (
          <div className="mt-4 p-2 bg-yellow-100 border border-yellow-400 rounded flex items-center">
            <AlertCircle className="text-yellow-700 mr-2" />
            <span className="text-yellow-700">You have already voted in this poll.</span>
          </div>
        )}
        {!user && (
          <div className="mt-4 p-2 bg-blue-100 border border-blue-400 rounded flex items-center">
            <AlertCircle className="text-blue-700 mr-2" />
            <span className="text-blue-700">Please log in to vote in this poll.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Poll;