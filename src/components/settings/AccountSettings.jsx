import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { toast } from '@/components/ui/use-toast';
import { Save, UserCircle2, Home, Phone as PhoneIcon, Mail } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput.jsx';

const AccountSettings = () => {
  const { user, updateUser, checkUsernameUnique } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    aptSuite: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        streetAddress: user.streetAddress || '',
        aptSuite: user.aptSuite || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username') {
      setUsernameError('');
    }
  };
  
  const handlePhoneChange = (e) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
  };


  const handleUsernameBlur = () => {
    if (formData.username && user && formData.username !== user.username && !checkUsernameUnique(formData.username)) {
      setUsernameError('Username already taken. Please choose another one.');
    } else {
      setUsernameError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usernameError) {
      toast({
        title: "Error",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }
    try {
      updateUser(formData);
    } catch (error) {
       toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <UserCircle2 className="h-7 w-7 text-blue-600" />
          Account Information
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">Manage your personal details and contact information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2.5">Profile Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  onBlur={handleUsernameBlur}
                  placeholder="Choose a unique username" 
                  required 
                  className="mt-1"
                />
                {usernameError && <p className="text-sm text-red-500 mt-1.5">{usernameError}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-1.5 text-slate-500"/>Email Address *
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone" className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1.5 text-slate-500"/>Phone Number
                </Label>
                <PhoneInput id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange} className="mt-1" />
              </div>
            </div>
          </section>
          
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2.5 flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600"/>Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
               <div>
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="123 Main St" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="aptSuite">Apt/Suite/Unit</Label>
                <Input id="aptSuite" name="aptSuite" value={formData.aptSuite} onChange={handleChange} placeholder="Apt #101, Suite B" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Anytown" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="CA" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="90210" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="USA" className="mt-1" />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Account Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;