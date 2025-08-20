import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronRight, Users, ThumbsUp, Star, Pin, Tag } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const iconMap = {
  MessageSquare,
  Star,
  ThumbsUp,
  Users,
};

const ForumListItem = ({ item, onClick, type }) => {
  const IconComponent = type === 'category' ? (iconMap[item.iconName] || MessageSquare) : MessageSquare;

  if (type === 'category') {
    return (
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full cursor-pointer"
        onClick={onClick} 
      >
        <Card 
          className="h-full flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-l-4 border-blue-500"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">{item.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription className="text-gray-600 text-sm leading-relaxed">{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="pt-3 pb-4 px-6 bg-gray-50">
            <div className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View Threads <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // type === 'thread'
  return (
    <motion.li
      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }} 
      transition={{ duration: 0.2 }}
      className="block cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {item.isPinned && <Pin size={16} className="text-yellow-500 flex-shrink-0" />}
              <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-800 truncate" title={item.title}>
                {item.title}
              </h3>
            </div>
            <div className="flex items-center text-xs text-gray-500 space-x-2 mb-2 flex-wrap">
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={item.authorAvatar} alt={item.authorName} />
                  <AvatarFallback className="text-xs">{item.authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{item.authorName}</span>
              </div>
              <span>•</span>
              <span>Last reply {formatDistanceToNow(parseISO(item.lastReplyAt), { addSuffix: true })}</span>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5 border-blue-300 text-blue-600 bg-blue-50">
                    <Tag size={10} className="mr-1"/>{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 mt-2 sm:mt-0 sm:ml-4 flex flex-col items-end text-sm text-gray-600">
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{item.postCount || 0} replies</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 mt-1 hidden sm:block" />
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default ForumListItem;