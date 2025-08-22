import React, { createContext } from 'react';
import { useMessages as useMessagesHook } from '../hooks/useMessages.jsx';

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const messagesData = useMessagesHook();
  return (
    <MessagesContext.Provider value={messagesData}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = React.useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};