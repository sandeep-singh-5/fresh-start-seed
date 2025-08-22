import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForum } from '../../hooks/useForum.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { ArrowLeft, PlusCircle, MessageSquare, Loader2, ThumbsUp, Star } from 'lucide-react';
import ForumListItem from './ForumListItem.jsx';
import CreateThreadForm from './CreateThreadForm.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";

const iconMap = {
  MessageSquare,
  Star,
  ThumbsUp,
};

const CategoryView = ({ categoryId, setCurrentView, setSelectedThread }) => {
  const { getCategories, getThreadsByCategory, loading: forumLoading } = useForum();
  const { user } = useAuth();
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);

  const category = getCategories().find(cat => cat.id === categoryId);
  const threads = getThreadsByCategory(categoryId);

  if (forumLoading && !category) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!category) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-xl font-semibold text-red-500">Category not found.</p>
          <Button onClick={() => setCurrentView('forum')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Button>
        </CardContent>
      </Card>
    );
  }

  const CategoryIcon = iconMap[category.icon] || MessageSquare;

  const handleThreadSelect = (threadId) => {
    setSelectedThread(threadId);
    setCurrentView('forum_thread');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button onClick={() => setCurrentView('forum')} variant="outline" className="self-start sm:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Button>
        {user && (
          <Dialog open={isCreateThreadOpen} onOpenChange={setIsCreateThreadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create New Thread in {category.name}</DialogTitle>
                <DialogDescription>
                  Start a new discussion. Make sure your title is clear and your content is helpful.
                </DialogDescription>
              </DialogHeader>
              <CreateThreadForm categoryId={categoryId} onThreadCreated={() => setIsCreateThreadOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b p-6">
          <div className="flex items-center space-x-3">
            <CategoryIcon className="h-10 w-10 text-blue-600" />
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">{category.name}</CardTitle>
              <CardDescription className="text-gray-600">{category.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {threads.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {threads.map((thread, index) => (
                <ForumListItem
                  key={thread.id}
                  item={{
                    id: thread.id,
                    title: thread.title,
                    authorName: thread.createdByName,
                    authorAvatar: thread.createdByAvatar,
                    postCount: thread.postCount,
                    lastReplyAt: thread.lastReplyAt,
                    isPinned: thread.isPinned,
                    tags: thread.tags,
                  }}
                  onClick={() => handleThreadSelect(thread.id)}
                  type="thread"
                />
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold">No threads here yet.</p>
              <p>Be the first to start a discussion in this category!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryView;