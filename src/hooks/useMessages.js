import { useState, useEffect } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    setLoading(false);
  }, []);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages));
  };

  const sendMessage = (message) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const updatedMessages = [...messages, newMessage];
    saveMessages(updatedMessages);
  };

  const getConversation = (userId1, userId2) => {
    return messages.filter(msg => 
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  return {
    messages,
    loading,
    sendMessage,
    getConversation
  };
};