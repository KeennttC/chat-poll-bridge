import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

const PollContext = createContext();

export const usePoll = () => useContext(PollContext);

export const PollProvider = ({ children }) => {
  const { user } = useAuth();
  const [iconPollData, setIconPollData] = useState({
    question: "What's your favorite activity?",
    options: [
      { id: 1, text: "Coffee", votes: 0 },
      { id: 2, text: "Pizza", votes: 0 },
      { id: 3, text: "Gamepad", votes: 0 },
      { id: 4, text: "Book", votes: 0 },
    ],
    votedUsers: [],
  });

  const voteIcon = (optionId) => {
    if (user && !iconPollData.votedUsers.includes(user.username)) {
      setIconPollData(prevData => ({
        ...prevData,
        options: prevData.options.map(option =>
          option.id === optionId ? { ...option, votes: option.votes + 1 } : option
        ),
        votedUsers: [...prevData.votedUsers, user.username],
      }));
    }
  };

  const hasVotedIcon = user ? iconPollData.votedUsers.includes(user.username) : false;

  return (
    <PollContext.Provider value={{ iconPollData, voteIcon, hasVotedIcon }}>
      {children}
    </PollContext.Provider>
  );
};