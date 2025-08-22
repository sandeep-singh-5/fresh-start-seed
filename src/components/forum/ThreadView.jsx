import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForum } from '../../hooks/useForum.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, MessageCircle, Send, Loader2, Edit2, Trash2, Pin, PinOff } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from '../../hooks/use-toast';

const PostItem = ({ post, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleEditSubmit = () => {
    if (editedContent.trim() === '') {
      toast({ title: "Error", description: "Post content cannot be empty.", variant: "destructive" });
      return;
    }
    onEdit(post.id, editedContent);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-4 py-6 px-4 border-b border-gray-200 last:border-b-0 bg-white rounded-lg shadow-sm mb-4"
    >
      <Avatar className="h-10 w-10 border-2 border-blue-200">
        <AvatarImage src={post.createdByAvatar} alt={post.createdByName} />
        <AvatarFallback>{post.createdByName?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-blue-700">{post.createdByName}</span>
            <span className="text-xs text-gray-500 ml-2">
              {formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}
              {post.editedAt && ` (edited ${formatDistanceToNow(parseISO(post.editedAt), { addSuffix: true })})`}
            </span>
          </div>
          {user && user.id === post.createdBy && (
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-7 w-7 text-gray-500 hover:text-blue-600">
                  <Edit2 size={16} />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <Textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>
        )}
      </div>
    </motion.div>
  );
};


const ThreadView = ({ threadId, setCurrentView, setSelectedCategory }) => {
  const { getThreadById, getPostsByThread, createPost, updatePost, deletePost, loading: forumLoading } = useForum();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postsEndRef = useRef(null);

  const thread = getThreadById(threadId);
  const posts = getPostsByThread(threadId);

  useEffect(() => {
    postsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  if (forumLoading && !thread) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!thread) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-xl font-semibold text-red-500">Thread not found.</p>
          <Button onClick={() => setCurrentView('forum')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleBackToCategory = () => {
    setSelectedCategory(thread.categoryId);
    setCurrentView('forum_category');
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast({ title: "Error", description: "Reply cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const success = await createPost({ threadId, content: replyContent });
    if (success) {
      setReplyContent('');
    }
    setIsSubmitting(false);
  };

  const handleEditPost = async (postId, newContent) => {
    await updatePost(postId, newContent);
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Button onClick={handleBackToCategory} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to {thread.categoryId.replace('cat_', '').replace('_', ' ')}
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6">
          <div className="flex items-center space-x-2 mb-2">
            {thread.isPinned && <Pin size={18} className="text-yellow-400" />}
            <CardTitle className="text-3xl font-bold">{thread.title}</CardTitle>
          </div>
          <div className="flex items-center text-sm text-gray-300 space-x-4">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-1.5 border-gray-400 border">
                <AvatarImage src={thread.createdByAvatar} alt={thread.createdByName} />
                <AvatarFallback>{thread.createdByName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>Started by {thread.createdByName}</span>
            </div>
            <span>{formatDistanceToNow(parseISO(thread.createdAt), { addSuffix: true })}</span>
            <span><MessageCircle size={14} className="inline mr-1" /> {thread.postCount || 0} replies</span>
          </div>
          {thread.tags && thread.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {thread.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gray-600 text-gray-200">{tag}</Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 bg-gray-50">
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-1">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
            ))}
            <div ref={postsEndRef} />
            {posts.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-semibold">No replies yet.</p>
                <p>Be the first to contribute to this discussion!</p>
              </div>
            )}
          </div>
        </CardContent>
        {user && (
          <CardFooter className="p-4 border-t bg-white">
            <div className="flex w-full space-x-3 items-start">
              <Avatar className="h-10 w-10 mt-1">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px] focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  disabled={isSubmitting}
                />
                <Button 
                  onClick={handleReplySubmit} 
                  disabled={isSubmitting || !replyContent.trim()}
                  className="mt-3 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Post Reply
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default ThreadView;