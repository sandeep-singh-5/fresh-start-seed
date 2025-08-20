import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';

const MessagesContext = createContext(null);

export const MessagesProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadMessages = useCallback(() => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      setUnreadCount(0);
      return;
    }

    try {
      const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
      const userConversations = storedConversations.filter(conv => 
        conv.participants.some(p => p.id === user.id)
      );
      
      const sortedConversations = userConversations.map(conv => ({
        ...conv,
        messages: conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      }));

      setConversations(sortedConversations);
      const unread = sortedConversations.filter(conv => !conv.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load messages from localStorage", error);
      setConversations([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const saveMessages = useCallback((updatedConversations) => {
    const allStoredConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    const otherUsersConversations = allStoredConversations.filter(conv => !conv.participants.some(p => p.id === user.id));
    const newGlobalState = [...otherUsersConversations, ...updatedConversations];
    localStorage.setItem('conversations', JSON.stringify(newGlobalState));
    
    const userConversations = newGlobalState.filter(conv => conv.participants.some(p => p.id === user.id));
    setConversations(userConversations);
    const unread = userConversations.filter(conv => !conv.read).length;
    setUnreadCount(unread);
  }, [user]);

  const sendMessage = useCallback((recipientId, recipientName, messageContent, jobId = null) => {
    if (!user) return;

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.id,
      message: messageContent,
      timestamp: new Date().toISOString(),
    };

    const allStoredConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    let conversationFound = false;
    
    const updatedGlobalConversations = allStoredConversations.map(conv => {
        const hasRecipient = conv.participants.some(p => p.id === recipientId);
        const hasSender = conv.participants.some(p => p.id === user.id);
        const hasJobId = (jobId && conv.jobId === jobId) || (!jobId && !conv.jobId);

        if (hasRecipient && hasSender && hasJobId) {
            conversationFound = true;
            return {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: newMessage.message,
                lastMessageAt: newMessage.timestamp,
                read: false, // Mark as unread for recipient
            };
        }
        return conv;
    });

    if (!conversationFound) {
        const newConversation = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            participants: [
                { id: user.id, name: user.name, profilePicture: user.profilePicture },
                { id: recipientId, name: recipientName, profilePicture: `https://api.dicebear.com/6.x/initials/svg?seed=${recipientName}` },
            ],
            jobId: jobId,
            messages: [newMessage],
            lastMessage: newMessage.message,
            lastMessageAt: newMessage.timestamp,
            read: false, // New conversation is unread for the recipient
        };
        updatedGlobalConversations.push(newConversation);
    }

    localStorage.setItem('conversations', JSON.stringify(updatedGlobalConversations));
    loadMessages();
  }, [user, loadMessages]);

  const markConversationAsRead = useCallback((conversationId) => {
    const allStoredConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    const updatedConversations = allStoredConversations.map(conv =>
      conv.id === conversationId && conv.participants.some(p => p.id === user.id)
        ? { ...conv, read: true }
        : conv
    );
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    loadMessages();
  }, [user, loadMessages]);
  
  const startOrGoToConversation = useCallback((recipientId, recipientName, jobId = null) => {
    if (!user) return;
    
    const allStoredConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    let existingConversation = null;

    for (const conv of allStoredConversations) {
        const hasRecipient = conv.participants.some(p => p.id === recipientId);
        const hasSender = conv.participants.some(p => p.id === user.id);
        const hasJobId = (jobId && conv.jobId === jobId) || (!jobId && !conv.jobId);
        if (hasRecipient && hasSender && hasJobId) {
            existingConversation = conv;
            break;
        }
    }

    if (!existingConversation) {
        const newConversation = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            participants: [
                { id: user.id, name: user.name, profilePicture: user.profilePicture },
                { id: recipientId, name: recipientName, profilePicture: `https://api.dicebear.com/6.x/initials/svg?seed=${recipientName}` },
            ],
            jobId: jobId,
            messages: [],
            lastMessage: "Conversation started.",
            lastMessageAt: new Date().toISOString(),
            read: true,
        };
        const updatedGlobalConversations = [...allStoredConversations, newConversation];
        localStorage.setItem('conversations', JSON.stringify(updatedGlobalConversations));
    }
    
    loadMessages();
  }, [user, loadMessages]);

  const value = {
    conversations,
    sendMessage,
    loading,
    unreadCount,
    markConversationAsRead,
    startOrGoToConversation,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};