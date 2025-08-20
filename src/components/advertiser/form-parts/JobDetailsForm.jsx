import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button.jsx';
import { UserCheck as UserSearch } from 'lucide-react';

const categories = [
  'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Cleaning', 
  'Landscaping', 'Appliance Repair', 'Garage Doors', 'Handyman', 'Roofing', 'Pest Control', 'Moving', 'Other'
];

const JobDetailsForm = ({ formData, onInputChange, onOpenCustomerDialog }) => {
  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Lead Details</h3>
      
      <div className="space-y-1.5">
        <Label htmlFor="customer" className="font-medium">Customer *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="customer"
            value={formData.customerName || 'No customer selected'}
            readOnly
            className="flex-1 bg-gray-100 cursor-default"
            onClick={onOpenCustomerDialog} 
          />
          <Button type="button" variant="outline" onClick={onOpenCustomerDialog}>
            <UserSearch className="h-4 w-4 mr-2" /> Select Customer
          </Button>
        </div>
        {formData.customerId && (
          <p className="text-xs text-gray-500">Selected Customer ID: {formData.customerId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="font-medium">Lead Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., Emergency Leaky Pipe Repair"
            required
            className="focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="category" className="font-medium">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)} required>
            <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select job category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="description" className="font-medium">Lead Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Provide a detailed description of the job, including specific tasks, materials (if known), and any relevant context..."
          rows={5}
          required
          className="focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
    </div>
  );
};

export default JobDetailsForm;