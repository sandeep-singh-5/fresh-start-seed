import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else if (user) {
      const sampleNotifications = [
        {
          id: Date.now().toString() + 'n1',
          userId: user.id,
          type: 'info',
          title: 'New Applicant for "Kitchen Reno"',
          message: 'Mike T. (Plumber) applied for your "Kitchen Reno" job post.',
          jobId: 'job789',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: Date.now().toString() + 'n2',
          userId: user.id,
          type: 'success',
          title: 'Payment Received for "Garden Cleanup"',
          message: 'You have received a payment of $150 for the "Garden Cleanup" job.',
          jobId: 'job101',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        },
        {
          id: Date.now().toString() + 'n3',
          userId: user.id,
          type: 'info',
          title: 'Job "Window Cleaning" Marked Complete',
          message: 'The technician has marked the "Window Cleaning" job as completed. Please review and confirm.',
          jobId: 'job112',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
        },
         {
          id: Date.now().toString() + 'n4',
          userId: user.id,
          type: 'info',
          title: 'New Message from Sarah P.',
          message: 'You have a new message regarding "Emergency HVAC Repair".',
          jobId: 'job Urgent HVAC',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        }
      ];
      saveNotifications(sampleNotifications);
    }
    setLoading(false);
  }, [user]);

  const saveNotifications = useCallback((updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  }, []);

  const addNotification = useCallback((userId, type, title, message, jobId = null) => {
    const newNotification = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      message,
      jobId,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    const allNotifs = JSON.parse(localStorage.getItem('notifications')) || [];
    const updatedAllNotifs = [newNotification, ...allNotifs];
    localStorage.setItem('notifications', JSON.stringify(updatedAllNotifs));
  }, []);

  const markAsRead = useCallback((notificationId) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId) {
        return { ...notif, read: true };
      }
      return notif;
    });
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);
  
  const markAllAsRead = useCallback(() => {
    if (!user) return;
    const updatedNotifications = notifications.map(notif => {
      if (notif.userId === user.id) {
        return { ...notif, read: true };
      }
      return notif;
    });
    saveNotifications(updatedNotifications);
  }, [user, notifications, saveNotifications]);

  const getUserNotifications = useCallback(() => {
    if (!user) return [];
    return notifications
      .filter(notif => notif.userId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [user, notifications]);

  const getUnreadCount = useCallback(() => {
    return getUserNotifications().filter(notif => !notif.read).length;
  }, [getUserNotifications]);

  const value = {
    notifications: getUserNotifications(),
    unreadCount: getUnreadCount(),
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
  
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};