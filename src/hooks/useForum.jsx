import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';

const ForumContext = createContext(null);

const initialCategories = [
  { id: 'cat_general', name: 'General Discussion', description: 'Talk about anything related to the platform or home services.', order: 1, icon: 'MessageSquare' },
  { id: 'cat_tips', name: 'Tips & Tricks', description: 'Share your best practices, advice for jobs, or using the platform.', order: 2, icon: 'Star' },
  { id: 'cat_feedback', name: 'Feedback & Suggestions', description: 'Have ideas to improve ServiceHub? Share them here!', order: 3, icon: 'ThumbsUp' },
];

const initialThreads = [
  { 
    id: 'thread_welcome', 
    categoryId: 'cat_general', 
    title: 'Welcome to the ServiceHub Forum!', 
    createdBy: 'system_admin', 
    createdByName: 'ServiceHub Admin',
    createdByAvatar: 'https://avatar.vercel.sh/ServiceHub.png?size=150',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    lastReplyAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    postCount: 2,
    isPinned: true,
    tags: ['announcement', 'welcome']
  },
  { 
    id: 'thread_best_tools', 
    categoryId: 'cat_tips', 
    title: 'What are your go-to tools for plumbing jobs?', 
    createdBy: 'tech1', 
    createdByName: 'JohnThePro',
    createdByAvatar: 'https://i.pravatar.cc/150?u=technician1@example.com',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1.5 days ago
    lastReplyAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    postCount: 3,
    isPinned: false,
    tags: ['plumbing', 'tools']
  },
];

const initialPosts = [
  { 
    id: 'post_welcome_1', 
    threadId: 'thread_welcome', 
    content: 'Hello everyone, and welcome to the official ServiceHub community forum! We\'re excited to have you here. Feel free to introduce yourselves, ask questions, and share your experiences.', 
    createdBy: 'system_admin', 
    createdByName: 'ServiceHub Admin',
    createdByAvatar: 'https://avatar.vercel.sh/ServiceHub.png?size=150',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() 
  },
  { 
    id: 'post_welcome_2', 
    threadId: 'thread_welcome', 
    content: 'Great to be here! Looking forward to connecting with other pros.', 
    createdBy: 'adv1', 
    createdByName: 'AdVertCorp',
    createdByAvatar: 'https://i.pravatar.cc/150?u=advertiser@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  },
  { 
    id: 'post_tools_1', 
    threadId: 'thread_best_tools', 
    content: 'For drain cleaning, I swear by my Ridgid K-45. What about you all?', 
    createdBy: 'tech1', 
    createdByName: 'JohnThePro',
    createdByAvatar: 'https://i.pravatar.cc/150?u=technician1@example.com',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString() 
  },
  { 
    id: 'post_tools_2', 
    threadId: 'thread_best_tools', 
    content: 'A good set of PEX crimpers is essential these days. Saves so much time.', 
    createdBy: 'tech2', 
    createdByName: 'AliceFixIt',
    createdByAvatar: 'https://i.pravatar.cc/150?u=technician2@example.com',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString() // 10 hours ago
  },
  { 
    id: 'post_tools_3', 
    threadId: 'thread_best_tools', 
    content: 'Totally agree on PEX tools. Also, a quality multimeter is a must for any electrical work.', 
    createdBy: 'tech_avizadok55', 
    createdByName: 'AviTheTechnician',
    createdByAvatar: 'https://i.pravatar.cc/150?u=avizadok55@gmail.com',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
];


export const ForumProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedCategories = localStorage.getItem('forum_categories');
        const storedThreads = localStorage.getItem('forum_threads');
        const storedPosts = localStorage.getItem('forum_posts');
  
        setCategories(storedCategories ? JSON.parse(storedCategories) : initialCategories);
        setThreads(storedThreads ? JSON.parse(storedThreads) : initialThreads);
        setPosts(storedPosts ? JSON.parse(storedPosts) : initialPosts);
        
        if (!storedCategories) localStorage.setItem('forum_categories', JSON.stringify(initialCategories));
        if (!storedThreads) localStorage.setItem('forum_threads', JSON.stringify(initialThreads));
        if (!storedPosts) localStorage.setItem('forum_posts', JSON.stringify(initialPosts));
      } catch (error) {
        console.error("Failed to load forum data from localStorage", error);
        setCategories(initialCategories);
        setThreads(initialThreads);
        setPosts(initialPosts);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveData = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
      toast({ title: "Save Error", description: "Could not save your changes. Please try again.", variant: "destructive" });
    }
  }, []);

  const getCategories = useCallback(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  const getThreadsByCategory = useCallback((categoryId) => {
    if (!categoryId) return [];
    return threads
      .filter(thread => thread.categoryId === categoryId)
      .sort((a, b) => new Date(b.lastReplyAt) - new Date(a.lastReplyAt))
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [threads]);

  const getThreadById = useCallback((threadId) => {
    if (!threadId) return null;
    return threads.find(thread => thread.id === threadId);
  }, [threads]);

  const getPostsByThread = useCallback((threadId) => {
    if (!threadId) return [];
    return posts
      .filter(post => post.threadId === threadId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [posts]);
  
  const getPostById = useCallback((postId) => {
    if (!postId) return null;
    return posts.find(post => post.id === postId);
  }, [posts]);

  const createThread = useCallback((threadData) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a thread.", variant: "destructive" });
      return null;
    }
    
    const now = new Date().toISOString();
    const newThread = {
      id: `thread_${Date.now()}`,
      categoryId: threadData.categoryId,
      title: threadData.title,
      createdBy: user.id,
      createdByName: user.username || user.name,
      createdByAvatar: user.avatar,
      createdAt: now,
      lastReplyAt: now,
      postCount: 1,
      isPinned: false,
      tags: threadData.tags || [],
    };

    const firstPost = {
      id: `post_${Date.now() + 1}`,
      threadId: newThread.id,
      content: threadData.content,
      createdBy: user.id,
      createdByName: user.username || user.name,
      createdByAvatar: user.avatar,
      createdAt: now,
    };

    const updatedThreads = [...threads, newThread];
    const updatedPosts = [...posts, firstPost];
    
    setThreads(updatedThreads);
    setPosts(updatedPosts);
    saveData('forum_threads', updatedThreads);
    saveData('forum_posts', updatedPosts);

    toast({ title: "Thread Created!", description: `"${newThread.title}" has been posted.` });
    return newThread;
  }, [threads, posts, user, saveData]);

  const createPost = useCallback((postData) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to reply.", variant: "destructive" });
      return null;
    }
    const newPost = {
      id: `post_${Date.now()}`,
      ...postData,
      createdBy: user.id,
      createdByName: user.username || user.name,
      createdByAvatar: user.avatar,
      createdAt: new Date().toISOString(),
    };
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    saveData('forum_posts', updatedPosts);

    setThreads(prevThreads => {
      const updatedThreadsList = prevThreads.map(thread => {
        if (thread.id === newPost.threadId) {
          return {
            ...thread,
            lastReplyAt: newPost.createdAt,
            postCount: (thread.postCount || 0) + 1,
          };
        }
        return thread;
      });
      saveData('forum_threads', updatedThreadsList);
      return updatedThreadsList;
    });
    toast({ title: "Reply Posted!", description: "Your reply has been added to the thread." });
    return newPost;
  }, [posts, threads, user, saveData]);
  
  const updatePost = useCallback((postId, newContent) => {
    if (!user) {
      toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
      return null;
    }
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate || postToUpdate.createdBy !== user.id) {
      toast({ title: "Error", description: "You can only edit your own posts.", variant: "destructive" });
      return null;
    }

    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, content: newContent, editedAt: new Date().toISOString() } : p
    );
    setPosts(updatedPosts);
    saveData('forum_posts', updatedPosts);
    toast({ title: "Post Updated", description: "Your post has been updated." });
    return updatedPosts.find(p => p.id === postId);
  }, [posts, user, saveData]);

  const deletePost = useCallback((postId) => {
    if (!user) {
      toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
      return false;
    }
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return false;
    
    if (postToDelete.createdBy !== user.id) {
      // Add admin check later if needed: && !user.isAdmin
      toast({ title: "Error", description: "You can only delete your own posts.", variant: "destructive" });
      return false;
    }

    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    saveData('forum_posts', updatedPosts);

    setThreads(prevThreads => {
      const threadToUpdate = prevThreads.find(t => t.id === postToDelete.threadId);
      if (threadToUpdate && threadToUpdate.postCount <= 1) {
        // If it's the last post, delete the whole thread
        const remainingThreads = prevThreads.filter(t => t.id !== postToDelete.threadId);
        saveData('forum_threads', remainingThreads);
        toast({ title: "Thread Deleted", description: "The last post was removed, so the thread was deleted." });
        return remainingThreads;
      } else {
        const updatedThreadsList = prevThreads.map(thread => {
          if (thread.id === postToDelete.threadId) {
            return {
              ...thread,
              postCount: Math.max(0, (thread.postCount || 1) - 1),
            };
          }
          return thread;
        });
        saveData('forum_threads', updatedThreadsList);
        toast({ title: "Post Deleted", description: "Your post has been removed." });
        return updatedThreadsList;
      }
    });

    return true;
  }, [posts, threads, user, saveData]);


  const value = {
    categories,
    threads,
    posts,
    loading,
    getCategories,
    getThreadsByCategory,
    getThreadById,
    getPostsByThread,
    getPostById,
    createThread,
    createPost,
    updatePost,
    deletePost,
  };

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
};

export const useForum = () => {
  const context = useContext(ForumContext);
  if (context === undefined || context === null) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
};