import React from 'react';
import { usePoll } from '../contexts/PollContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Coffee, Pizza, Gamepad, Book } from 'lucide-react';

const IconPoll = () => {
  const { iconPollData, voteIcon, hasVotedIcon } = usePoll();
  const { user } = useAuth();

  const icons = {
    Coffee: Coffee,
    Pizza: Pizza,
    Gamepad: Gamepad,
    Book: Book,
  };

  const totalVotes = iconPollData.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-purple-800">{iconPollData.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {iconPollData.options.map(option => {
            const Icon = icons[option.text];
            return (
              <div key={option.id} className="bg-purple-50 rounded-lg p-4 text-center">
                <Icon className="w-12 h-12 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-medium mb-2">{option.text}</div>
                <Progress value={(option.votes / totalVotes) * 100 || 0} className="w-full h-2 bg-purple-200" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">{option.votes} votes</span>
                  <span className="text-sm text-gray-600">
                    {totalVotes > 0 ? `${((option.votes / totalVotes) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <Button 
                  onClick={() => voteIcon(option.id)} 
                  disabled={hasVotedIcon || !user}
                  className="mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Vote
                </Button>
              </div>
            );
          })}
        </div>
        {hasVotedIcon && (
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

export default IconPoll;