import React, { createContext } from 'react';
import { useNotifications as useNotificationsHook } from '../hooks/useNotifications.jsx';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const notificationsData = useNotificationsHook();
  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};