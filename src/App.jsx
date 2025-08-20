// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  const isAdvertiser = user?.userType === 'advertiser';

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          isAdvertiser ? <AdvertiserDashboard /> : <TechnicianDashboard />
        } />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/servicePros" element={<ServiceProsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum_category/:id" element={<CategoryView />} />
        <Route path="/forum_thread/:id" element={<ThreadView />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CustomersProvider>
          <JobsProvider>
            <NotificationsProvider>
              <MessagesProvider>
                <FavoritesProvider>
                  <ForumProvider>
                    <Router>
                      <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/*" element={
                          <ProtectedRoute>
                            <AppRoutes />
                          </ProtectedRoute>
                        } />
                      </Routes>
                      <Toaster />
                    </Router>
                  </ForumProvider>
                </FavoritesProvider>
              </MessagesProvider>
            </NotificationsProvider>
          </JobsProvider>
        </CustomersProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
