import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import UserProfileCard from '../shared/UserProfileCard.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Edit, Mail, Phone, Home, Info, Briefcase } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found. Please log in.</p>
      </div>
    );
  }

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };
  
  const InfoItem = ({ icon, label, value }) => {
    if (!value) return null;
    const IconComponent = icon;
    return (
      <div className="flex items-start space-x-3">
        <IconComponent className="h-5 w-5 text-blue-600 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-gray-800">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Button variant="outline" onClick={handleEditProfile}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <UserProfileCard user={user} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5"/> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={Mail} label="Email" value={user.email} />
          <InfoItem icon={Phone} label="Phone Number" value={user.phone} />
          <InfoItem icon={Home} label="Address" value={user.address} />
          <InfoItem icon={Briefcase} label="Company Name (if applicable)" value={user.companyName} />
          <div className="md:col-span-2">
            <InfoItem icon={Info} label="Bio" value={user.bio} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Recent activity feed coming soon...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Your reviews will be displayed here...</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;