import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout.jsx';
import LoginForm from '@/components/auth/LoginForm.jsx';
import AdvertiserDashboard from '@/components/advertiser/AdvertiserDashboard.jsx';
import TechnicianDashboard from '@/components/technician/TechnicianDashboard.jsx';
import Marketplace from '@/components/marketplace/Marketplace.jsx';
import JobsPage from '@/components/jobs/JobsPage.jsx';
import CustomersPage from '@/components/customers/CustomersPage.jsx';
import PipelinePage from '@/components/pipeline/PipelinePage.jsx';
import SettingsPage from '@/components/settings/SettingsPage.jsx';
import ProfilePage from '@/components/profile/ProfilePage.jsx';
import EditProfilePage from '@/components/profile/EditProfilePage.jsx';
import ServiceProsPage from '@/components/servicepros/ServiceProsPage.jsx'; 
import MessagesPage from '@/components/messages/MessagesPage.jsx';
import NotificationsPage from '@/components/notifications/NotificationsPage.jsx';
import FavoritesPage from '@/components/favorites/FavoritesPage.jsx'; 
import ForumPage from '@/components/forum/ForumPage.jsx';
import CategoryView from '@/components/forum/CategoryView.jsx';
import ThreadView from '@/components/forum/ThreadView.jsx';
import { JobsProvider } from '@/hooks/useJobs.jsx';
import { SettingsProvider } from '@/hooks/useSettings.jsx';
import { CustomersProvider } from '@/hooks/useCustomers.jsx';
import { MessagesProvider } from '@/hooks/useMessages.jsx';
import { NotificationsProvider } from '@/hooks/useNotifications.jsx';
import { FavoritesProvider } from '@/hooks/useFavorites.jsx';
import { ForumProvider } from '@/hooks/useForum.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedForumCategory, setSelectedForumCategory] = useState(null);
  const [selectedForumThread, setSelectedForumThread] = useState(null);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return user.userType === 'advertiser' ? 
          <AdvertiserDashboard setCurrentView={setCurrentView} /> : 
          <TechnicianDashboard setCurrentView={setCurrentView} />;
      case 'marketplace':
        return <Marketplace />;
      case 'jobs':
        return <JobsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'pipeline':
        return <PipelinePage />;
      case 'servicePros': 
        return <ServiceProsPage setCurrentView={setCurrentView} />;
      case 'favorites':
        return <FavoritesPage setCurrentView={setCurrentView} />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage setCurrentView={setCurrentView} />;
      case 'edit-profile':
        return <EditProfilePage setCurrentView={setCurrentView} />;
      case 'messages':
        return <MessagesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'forum':
        return <ForumPage setCurrentView={setCurrentView} setSelectedCategory={setSelectedForumCategory} />;
      case 'forum_category':
        return <CategoryView categoryId={selectedForumCategory} setCurrentView={setCurrentView} setSelectedThread={setSelectedForumThread} />;
      case 'forum_thread':
        return <ThreadView threadId={selectedForumThread} setCurrentView={setCurrentView} setSelectedCategory={setSelectedForumCategory} />;
      default:
        return user.userType === 'advertiser' ? 
          <AdvertiserDashboard setCurrentView={setCurrentView} /> : 
          <TechnicianDashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <SettingsProvider>
      <CustomersProvider>
        <JobsProvider>
          <NotificationsProvider>
            <MessagesProvider>
              <FavoritesProvider>
                <ForumProvider>
                  <Layout currentView={currentView} setCurrentView={setCurrentView}>
                    <div className="p-4 md:p-6 lg:p-8">
                      {renderContent()}
                    </div>
                  </Layout>
                  <Toaster />
                </ForumProvider>
              </FavoritesProvider>
            </MessagesProvider>
          </NotificationsProvider>
        </JobsProvider>
      </CustomersProvider>
    </SettingsProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;