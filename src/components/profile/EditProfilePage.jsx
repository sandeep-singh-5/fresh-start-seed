import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { toast } from '../../hooks/use-toast';
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    companyName: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
      className: "bg-green-500 text-white",
    });
    navigate('/profile');
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-blue-200 shadow-lg">
                <AvatarImage src={formData.avatar || `https://avatar.vercel.sh/${formData.name}.png`} alt={`${formData.name}'s avatar`} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-4xl">
                  {formData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="relative">
                <Button type="button" variant="outline" size="sm" className="relative">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change Avatar
                  <Input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your email address" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Your primary address" />
              </div>
              {user.userType === 'technician' && (
                 <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company name" />
                </div>
              )}
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio / About Me</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us a little about yourself or your services" rows={4} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
};

export default EditProfilePage;