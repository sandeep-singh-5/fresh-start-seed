import React from 'react';
import { motion } from 'framer-motion';
import { useForum } from '../../hooks/useForum.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MessageSquare, Star, ThumbsUp, ChevronRight, Loader2 } from 'lucide-react';
import ForumListItem from './ForumListItem.jsx';

const iconMap = {
  MessageSquare,
  Star,
  ThumbsUp,
};

const ForumPage = ({ setCurrentView, setSelectedCategory }) => {
  const { getCategories, loading: forumLoading } = useForum();
  const categories = getCategories();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView('forum_category');
  };

  if (forumLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="relative shadow-xl bg-gradient-to-br from-blue-600 to-green-500 text-white overflow-hidden">
        <CardHeader className="relative z-10">
          <CardTitle className="text-4xl font-bold">ServiceHub Community Forum</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Connect, share, and learn with fellow advertisers and service professionals.
          </CardDescription>
        </CardHeader>
        <div className="absolute inset-0 bg-black/20 opacity-50 z-0"></div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <ForumListItem
            key={category.id}
            item={{
              id: category.id,
              title: category.name,
              description: category.description,
              iconName: category.icon,
            }}
            onClick={() => handleCategorySelect(category.id)}
            type="category"
          />
        ))}
      </div>
      
      {categories.length === 0 && !forumLoading && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-semibold">No categories yet!</p>
            <p>Looks like the forum is just getting started. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ForumPage;