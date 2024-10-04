import React, { createContext, useState, useContext } from 'react';

const PollContext = createContext();

export const usePoll = () => useContext(PollContext);

export const PollProvider = ({ children }) => {
  const [pollData, setPollData] = useState({
    question: "What's your favorite color?",
    options: [
      { id: 1, text: "Red", votes: 0 },
      { id: 2, text: "Blue", votes: 0 },
      { id: 3, text: "Green", votes: 0 },
    ],
  });

  const vote = (optionId) => {
    setPollData(prevData => ({
      ...prevData,
      options: prevData.options.map(option =>
        option.id === optionId ? { ...option, votes: option.votes + 1 } : option
      ),
    }));
  };

  return (
    <PollContext.Provider value={{ pollData, vote }}>
      {children}
    </PollContext.Provider>
  );
};