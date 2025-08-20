import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { cn } from '@/lib/utils';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, addNotification } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColorForType = (type) => {
    switch (type) {
      case 'success': return 'border-green-500';
      case 'warning': return 'border-yellow-500';
      case 'error': return 'border-red-500';
      case 'info':
      default: return 'border-blue-500';
    }
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleAddSampleNotification = () => {
    const types = ['info', 'success', 'warning', 'error'];
    const titles = ['New Job Alert', 'Payment Received', 'Upcoming Maintenance', 'Action Required'];
    const messages = [
      'A new job matching your skills has been posted in Plumbing.',
      'You have received a payment of $250 for Job #123.',
      'The platform will undergo scheduled maintenance on Sunday at 2 AM.',
      'Please update your payment information in your profile.'
    ];
    const randomIndex = Math.floor(Math.random() * types.length);

    addNotification(
      'currentUser', 
      types[randomIndex],
      titles[randomIndex],
      messages[randomIndex],
      `JOB-${Math.floor(Math.random() * 1000)}`
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <Card className="shadow-xl border-t-4 border-blue-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
              <Bell className="h-8 w-8 mr-3 text-blue-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
            </CardDescription>
          </div>
          <Button onClick={handleAddSampleNotification} variant="outline">Add Sample</Button>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No notifications yet.</p>
              <p className="text-sm text-gray-400">Stay tuned for updates!</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <ul className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.li
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out",
                      notification.read ? 'bg-gray-50 border border-gray-200' : 'bg-white border-l-4',
                      !notification.read && getBorderColorForType(notification.type)
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-1">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className={cn(
                            "text-md font-semibold",
                            notification.read ? "text-gray-600" : "text-gray-800"
                          )}>{notification.title}</h3>
                          {!notification.read && (
                            <Badge variant="destructive" className="text-xs animate-pulse">New</Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-sm",
                          notification.read ? "text-gray-500" : "text-gray-700"
                        )}>{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                            {notification.jobId && <span className="ml-2 text-blue-500 hover:underline cursor-pointer">Job: {notification.jobId}</span>}
                          </p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                      {notification.read && (
                         <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 h-7 w-7" disabled>
                           <X className="h-4 w-4"/>
                         </Button>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;