import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import PhoneInput from '@/components/ui/PhoneInput.jsx';
import { toast } from '@/components/ui/use-toast';

const initialFormData = {
  firstName: '', lastName: '', email: '', phone: '', 
  streetAddress: '', aptSuite: '', city: '', state: '', zipCode: '', 
  company: ''
};

export const CustomerFormDialog = ({ isOpen, onOpenChange, customerData, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (customerData) {
        setFormData({ ...initialFormData, ...customerData });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [customerData, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "First Name, Last Name, and Email are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting customer form:", error);
      toast({
        title: "Submission Error",
        description: "Could not save customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{customerData ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput id="phone" value={formData.phone} onChange={handlePhoneChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input id="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="123 Main St" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="aptSuite">Apt/Suite/Unit</Label>
              <Input id="aptSuite" value={formData.aptSuite} onChange={handleChange} placeholder="Apt #101" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={handleChange} placeholder="Anytown" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={formData.state} onChange={handleChange} placeholder="CA" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="90210" />
              </div>
            </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
              {customerData ? 'Save Changes' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};