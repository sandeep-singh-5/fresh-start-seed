import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useToast } from '../../hooks/use-toast';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    userType: '',
    phone: '',
    location: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const { login, register, checkUsernameUnique } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'username') {
      setUsernameError('');
    }
  };

  const handleUsernameBlur = () => {
    if (!isLogin && formData.username && !checkUsernameUnique(formData.username)) {
      setUsernameError('Username is already taken. Please choose another.');
    } else {
      setUsernameError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in email and password.",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && (!formData.name || !formData.userType || !formData.username)) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields for registration (Name, Username, User Type).",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && usernameError) {
      toast({
        title: "Error",
        description: usernameError,
        variant: "destructive"
      });
      return;
    }


    try {
      if (isLogin) {
        const loggedInUser = login(formData.email, formData.password);
        if (!loggedInUser) {
          // Toast for login failure is handled in useAuth
        }
      } else {
        const newUserPayload = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
          phone: formData.phone,
          location: formData.location,
        };
        const newUser = register(newUserPayload);
        if (!newUser) {
          // Toast for registration failure is handled in useAuth
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join ServiceHub'}
            </CardTitle>
            <CardDescription className="text-white/80">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onBlur={handleUsernameBlur}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Choose a unique username"
                      required={!isLogin}
                    />
                    {usernameError && <p className="text-xs text-red-300 mt-1">{usernameError}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-white">I am a... *</Label>
                    <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)} required={!isLogin}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advertiser">Advertiser (Post Jobs)</SelectItem>
                        <SelectItem value="technician">Technician (Find Jobs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your city, state"
                    />
                  </div>
                </>
              )}
              
              <Button type="submit" className="w-full bg-white text-blue-600 hover:bg-white/90">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setUsernameError(''); // Clear username error when switching forms
                }}
                className="text-white/80 hover:text-white underline text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;