import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useJobs } from '../../hooks/useJobs';
import { useSettings } from '../../hooks/useSettings';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth.jsx';
import { toast } from '../ui/use-toast';
import JobDetailsForm from '../advertiser/form-parts/JobDetailsForm.jsx';
import ProfitSharingForm from '../advertiser/form-parts/ProfitSharingForm.jsx';
import JobRequirementsForm from '../advertiser/form-parts/JobRequirementsForm.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Search, UserPlus, ListChecks } from 'lucide-react';
import { Label } from '../ui/label';
import PhoneInput from '../ui/PhoneInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


const EditJobForm = ({ jobData, onJobUpdated }) => {
  const { settings } = useSettings();
  const { updateJob, updateJobStatus } = useJobs();
  const { customers, addCustomer } = useCustomers();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    estimatedProfit: '',
    profitSharePercentage: settings.defaultLeadShare.toString(),
    urgency: 'medium',
    requirementsText: '',
    customerId: '',
    customerName: '',
    status: '',
    checklistId: '', 
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '', streetAddress: '', aptSuite: '', city: '', state: '', zipCode: '', company: ''
  });

  const jobStatuses = user.userType === 'advertiser' 
    ? ['open', 'assigned', 'in progress', 'completed', 'paid', 'disputed']
    : ['open', 'applied', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];


  useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData.title || '',
        description: jobData.description || '',
        category: jobData.category || '',
        location: jobData.location || '',
        budget: jobData.budget?.toString() || '',
        estimatedProfit: jobData.estimatedProfit?.toString() || '',
        profitSharePercentage: jobData.profitSharePercentage?.toString() || settings.defaultLeadShare.toString(),
        urgency: jobData.urgency || 'medium',
        requirementsText: jobData.additionalRequirements || jobData.requirementsText || '',
        customerId: jobData.customerId || '',
        customerName: jobData.customerName || '',
        status: jobData.status || 'open',
        checklistId: jobData.checklistId || '',
      });
      setSelectedTags(jobData.requirements || []);
    }
  }, [jobData, settings.defaultLeadShare]);

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const email = customer.email?.toLowerCase() || '';
    const search = customerSearchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({ ...prev, customerId: customer.id, customerName: `${customer.firstName} ${customer.lastName}` }));
    setIsCustomerDialogOpen(false);
    setCustomerSearchTerm('');
    toast({ title: "Customer Selected", description: `${customer.firstName} ${customer.lastName} assigned to this job.`});
  };

  const handleAddNewCustomer = () => {
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email) {
      toast({ title: "Error", description: "First Name, Last Name and Email are required for new customer.", variant: "destructive" });
      return;
    }
    const addedCustomer = addCustomer(newCustomer);
    if (addedCustomer) {
      setFormData(prev => ({ ...prev, customerId: addedCustomer.id, customerName: `${addedCustomer.firstName} ${addedCustomer.lastName}` }));
      toast({ title: "New Customer Added", description: `${addedCustomer.firstName} ${addedCustomer.lastName} has been added and assigned.` });
      setNewCustomer({ firstName: '', lastName: '', email: '', phone: '', streetAddress: '', aptSuite: '', city: '', state: '', zipCode: '', company: '' });
      setIsNewCustomerDialogOpen(false);
      setIsCustomerDialogOpen(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Description, Category, Budget).",
        variant: "destructive"
      });
      return;
    }
    if (!formData.customerId) {
      toast({
        title: "Error",
        description: "Please select or add a customer for this job.",
        variant: "destructive"
      });
      return;
    }

    try {
      const jobDataToSubmit = {
        ...formData,
        requirements: selectedTags,
        additionalRequirements: formData.requirementsText,
      };
      
      updateJob(jobData.id, jobDataToSubmit);
      toast({
        title: "Job Updated!",
        description: "The job details have been updated successfully."
      });
      
      if (onJobUpdated) onJobUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update job: ${error.message || "Please try again."}`,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-0"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <JobDetailsForm 
          formData={formData} 
          onInputChange={handleInputChange}
          onOpenCustomerDialog={() => setIsCustomerDialogOpen(true)}
        />
        <div className="space-y-2">
          <Label htmlFor="status">Job Status</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {jobStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ProfitSharingForm formData={formData} onInputChange={handleInputChange} />
        <JobRequirementsForm 
          formData={formData} 
          onInputChange={handleInputChange} 
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          settingsTags={settings.tags}
        />

        <div className="space-y-1.5 p-6 border rounded-lg shadow-sm bg-white">
          <Label htmlFor="checklistId-edit" className="font-medium flex items-center">
            <ListChecks size={16} className="mr-2 text-indigo-600" />
            Attached Checklist (Optional)
          </Label>
          <Select value={formData.checklistId || ''} onValueChange={(value) => handleInputChange('checklistId', value)}>
            <SelectTrigger id="checklistId-edit" className="focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Select a checklist template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Checklist</SelectItem>
              {(settings.checklists || []).map((checklist) => (
                <SelectItem key={checklist.id} value={checklist.id}>
                  {checklist.name} ({checklist.items?.length || 0} items)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.checklistId && (
            <p className="text-xs text-gray-500 mt-1">
              Current checklist: {(settings.checklists?.find(cl => cl.id === formData.checklistId))?.name || 'None'}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={onJobUpdated} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>

      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers..." 
                value={customerSearchTerm} 
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <Button 
                    key={customer.id} 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    {customer.firstName} {customer.lastName} - {customer.email}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">No customers found. Try adding one.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>Cancel</Button>
             <DialogTrigger asChild>
                <Button onClick={() => { setIsCustomerDialogOpen(false); setIsNewCustomerDialogOpen(true); }}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add New Customer
                </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label htmlFor="new-firstName-editjob">First Name *</Label><Input id="new-firstName-editjob" value={newCustomer.firstName} onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })} placeholder="John" /></div>
              <div className="space-y-1"><Label htmlFor="new-lastName-editjob">Last Name *</Label><Input id="new-lastName-editjob" value={newCustomer.lastName} onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })} placeholder="Doe" /></div>
            </div>
            <div className="space-y-1"><Label htmlFor="new-email-editjob">Email *</Label><Input id="new-email-editjob" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="john.doe@example.com" /></div>
            <div className="space-y-1"><Label htmlFor="new-phone-editjob">Phone</Label><PhoneInput id="new-phone-editjob" value={newCustomer.phone} onChange={(val) => setNewCustomer({ ...newCustomer, phone: val })} /></div>
            <div className="space-y-1"><Label htmlFor="new-company-editjob">Company</Label><Input id="new-company-editjob" value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} placeholder="Acme Corp" /></div>
            <div className="space-y-1"><Label htmlFor="new-streetAddress-editjob">Street Address</Label><Input id="new-streetAddress-editjob" value={newCustomer.streetAddress} onChange={(e) => setNewCustomer({ ...newCustomer, streetAddress: e.target.value })} placeholder="123 Main St" /></div>
            <div className="space-y-1"><Label htmlFor="new-aptSuite-editjob">Apt/Suite</Label><Input id="new-aptSuite-editjob" value={newCustomer.aptSuite} onChange={(e) => setNewCustomer({ ...newCustomer, aptSuite: e.target.value })} placeholder="Apt 101" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1"><Label htmlFor="new-city-editjob">City</Label><Input id="new-city-editjob" value={newCustomer.city} onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })} placeholder="Anytown" /></div>
              <div className="space-y-1"><Label htmlFor="new-state-editjob">State</Label><Input id="new-state-editjob" value={newCustomer.state} onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })} placeholder="CA" /></div>
              <div className="space-y-1"><Label htmlFor="new-zipCode-editjob">Zip Code</Label><Input id="new-zipCode-editjob" value={newCustomer.zipCode} onChange={(e) => setNewCustomer({ ...newCustomer, zipCode: e.target.value })} placeholder="90210" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewCustomer} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EditJobForm;