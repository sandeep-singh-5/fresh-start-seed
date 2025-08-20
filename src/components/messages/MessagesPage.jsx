import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Send, Paperclip, Search, MessageSquare, Briefcase } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Badge } from '@/components/ui/badge';

const MessagesPage = () => {
  const { user } = useAuth();
  const { conversations, sendMessage, loading, markConversationAsRead } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  useEffect(() => {
    if (selectedConversation && !selectedConversation.read) {
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation, markConversationAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === '' || !selectedConversation) return;
    const recipient = selectedConversation.participants.find(p => p.id !== user.id);
    if (recipient) {
      sendMessage(recipient.id, recipient.name, messageInput.trim(), selectedConversation.jobId);
      setMessageInput('');
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.id !== user.id);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    const jobInfo = conv.jobId ? `job: ${conv.jobId}` : '';
    return (
      otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobInfo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
     return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] bg-white rounded-lg shadow-xl border"
    >
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="h-7 w-7 mr-3 text-blue-600" />
          Messages
        </CardTitle>
      </CardHeader>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r p-0 flex flex-col bg-gray-50">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No conversations found.</div>
            ) : (
              filteredConversations.map(conv => {
                const otherP = getOtherParticipant(conv);
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''} ${!conv.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherP?.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${otherP?.name || 'User'}`} alt={otherP?.name} />
                        <AvatarFallback>{(otherP?.name || 'U').substring(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                           <p className="font-semibold text-sm truncate">{otherP?.name || 'Unknown User'}</p>
                           <p className="text-xs text-gray-500">{new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                        {conv.jobId && <Badge variant="outline" className="text-xs mt-1"><Briefcase className="h-3 w-3 mr-1"/>Job: {conv.jobId}</Badge>}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              <header className="p-3 border-b flex items-center space-x-3 bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getOtherParticipant(selectedConversation)?.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${getOtherParticipant(selectedConversation)?.name || 'User'}`} alt={getOtherParticipant(selectedConversation)?.name} />
                  <AvatarFallback>{(getOtherParticipant(selectedConversation)?.name || 'U').substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{getOtherParticipant(selectedConversation)?.name || 'Unknown User'}</p>
                  {selectedConversation.jobId && <p className="text-xs text-blue-600">Regarding job: {selectedConversation.jobId}</p>}
                </div>
              </header>
              <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-100">
                {selectedConversation.messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl ${msg.senderId === user.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50 flex items-center space-x-2">
                <Button variant="ghost" size="icon" type="button" className="text-gray-500 hover:text-blue-500">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1" 
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-100">
              <Users className="h-24 w-24 text-gray-300 mb-4" />
              <p className="text-xl">Select a conversation to start messaging</p>
              <p className="text-sm">or search for someone to chat with.</p>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default MessagesPage;