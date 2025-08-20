import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobs } from '@/hooks/useJobs';
import { useSettings } from '@/hooks/useSettings';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from '@/components/ui/use-toast';
import JobTemplateSelector from '@/components/advertiser/form-parts/JobTemplateSelector.jsx';
import JobDetailsForm from '@/components/advertiser/form-parts/JobDetailsForm.jsx';
import JobPricingForm from '@/components/advertiser/form-parts/ProfitSharingForm.jsx';
import JobRequirementsForm from '@/components/advertiser/form-parts/JobRequirementsForm.jsx';
import JobMediaForm from '@/components/advertiser/form-parts/JobMediaForm.jsx';
import BonusIncentivesForm from '@/components/advertiser/form-parts/BonusIncentivesForm.jsx';
import { Search, UserPlus, ListChecks, Store } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInput from '@/components/ui/PhoneInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const PostJobForm = ({ onJobPosted }) => {
  const { settings } = useSettings();
  const { addJob } = useJobs();
  const { customers, addCustomer } = useCustomers();

  const initialFormData = {
    title: '',
    description: '',
    category: '',
    paymentType: 'profitShare',
    estimatedProfit: '',
    profitSharePercentage: settings.defaultLeadShare.toString(),
    flatRate: '',
    urgency: 'medium',
    specificDate: '',
    startTime: '',
    endTime: '',
    requirementsText: '',
    customerId: '',
    customerName: '',
    checklistId: '',
    imageUrls: [],
    videoUrls: [],
    bonuses: [],
    isPublished: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [paymentType, setPaymentType] = useState('profitShare');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '', streetAddress: '', aptSuite: '', city: '', state: '', zipCode: '', company: ''
  });

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
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({ title: "Error", description: "Please fill in all required fields (Title, Description, Category).", variant: "destructive" });
      return;
    }
    if (!formData.customerId) {
      toast({ title: "Error", description: "Please select or add a customer for this job.", variant: "destructive" });
      return;
    }
    if (paymentType === 'profitShare' && (!formData.estimatedProfit || !formData.profitSharePercentage)) {
      toast({ title: "Error", description: "Please fill Estimated Profit and Technician's Share.", variant: "destructive" });
      return;
    }
    if (paymentType === 'flatRate' && !formData.flatRate) {
      toast({ title: "Error", description: "Please fill Flat Rate Payout.", variant: "destructive" });
      return;
    }

    try {
      const jobDataToSubmit = {
        ...formData,
        paymentType,
        requirements: selectedTags, 
        additionalRequirements: formData.requirementsText,
      };
      
      addJob(jobDataToSubmit);
      
      setFormData(initialFormData);
      setPaymentType('profitShare');
      setSelectedTags([]);
      
      if (onJobPosted) onJobPosted();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to post lead: ${error.message || "Please try again."}`,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'urgency' && value !== 'specific_schedule') {
        newState.specificDate = '';
        newState.startTime = '';
        newState.endTime = '';
      }
      return newState;
    });
  };

  const applyTemplate = (template) => {
    const templatePaymentType = template.paymentType || 'profitShare';
    setPaymentType(templatePaymentType);
    setFormData({
      ...initialFormData, 
      title: template.title || '',
      description: template.description || '',
      category: template.category || '',
      paymentType: templatePaymentType,
      estimatedProfit: template.estimatedProfit || '',
      profitSharePercentage: template.profitShare || settings.defaultLeadShare.toString(),
      flatRate: template.flatRate || '',
      urgency: template.urgency || 'medium',
      specificDate: template.specificDate || '',
      startTime: template.startTime || '',
      endTime: template.endTime || '',
      checklistId: template.checklistId || '',
      imageUrls: template.imageUrls || [],
      videoUrls: template.videoUrls || [],
      bonuses: template.bonuses || [],
      isPublished: template.isPublished || false,
    });
    setSelectedTags(template.requirements || []); 
    toast({
      title: "Template Applied!",
      description: `${template.name} template has been applied to the form. Remember to select a customer.`
    });
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setPaymentType('profitShare');
    setSelectedTags([]);
    toast({ title: "Form Cleared", description: "All fields have been reset."});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-gradient">Post a New Lead</CardTitle>
          <CardDescription>
            Create a lead for technicians to purchase and complete.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <JobTemplateSelector onApplyTemplate={applyTemplate} />

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <JobDetailsForm 
              formData={formData} 
              onInputChange={handleInputChange} 
              onOpenCustomerDialog={() => setIsCustomerDialogOpen(true)}
            />
            <JobPricingForm 
              formData={formData} 
              onInputChange={handleInputChange}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
            />
            <BonusIncentivesForm
              bonuses={formData.bonuses}
              onBonusesChange={(newBonuses) => handleInputChange('bonuses', newBonuses)}
            />
            <JobRequirementsForm 
              formData={formData} 
              onInputChange={handleInputChange} 
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              settingsTags={settings.tags}
            />
            <JobMediaForm formData={formData} onInputChange={handleInputChange} />

            <div className="space-y-1.5 p-6 border rounded-lg shadow-sm bg-white">
              <Label htmlFor="checklistId" className="font-medium flex items-center">
                <ListChecks size={16} className="mr-2 text-indigo-600" />
                Attach Checklist (Optional)
              </Label>
              <Select value={formData.checklistId} onValueChange={(value) => handleInputChange('checklistId', value)}>
                <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500">
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
                  Selected checklist: {(settings.checklists.find(cl => cl.id === formData.checklistId))?.name}
                </p>
              )}
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm bg-gradient-to-tr from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Store size={20} className="mr-3 text-green-600"/>
                        <div>
                            <Label htmlFor="publish-switch" className="font-semibold text-gray-800">Publish to Marketplace</Label>
                            <p className="text-xs text-gray-500">Make this job visible to technicians on the marketplace.</p>
                        </div>
                    </div>
                    <Switch
                        id="publish-switch"
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                Create Job
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} className="flex-1">
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
              <div className="space-y-1"><Label htmlFor="new-firstName">First Name *</Label><Input id="new-firstName" value={newCustomer.firstName} onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })} placeholder="John" /></div>
              <div className="space-y-1"><Label htmlFor="new-lastName">Last Name *</Label><Input id="new-lastName" value={newCustomer.lastName} onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })} placeholder="Doe" /></div>
            </div>
            <div className="space-y-1"><Label htmlFor="new-email">Email *</Label><Input id="new-email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="john.doe@example.com" /></div>
            <div className="space-y-1"><Label htmlFor="new-phone">Phone</Label><PhoneInput id="new-phone" value={newCustomer.phone} onChange={(value) => setNewCustomer({ ...newCustomer, phone: value })} /></div>
            <div className="space-y-1"><Label htmlFor="new-company">Company</Label><Input id="new-company" value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} placeholder="Acme Corp" /></div>
            <div className="space-y-1"><Label htmlFor="new-streetAddress">Street Address</Label><Input id="new-streetAddress" value={newCustomer.streetAddress} onChange={(e) => setNewCustomer({ ...newCustomer, streetAddress: e.target.value })} placeholder="123 Main St" /></div>
            <div className="space-y-1"><Label htmlFor="new-aptSuite">Apt/Suite</Label><Input id="new-aptSuite" value={newCustomer.aptSuite} onChange={(e) => setNewCustomer({ ...newCustomer, aptSuite: e.target.value })} placeholder="Apt 101" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1"><Label htmlFor="new-city">City</Label><Input id="new-city" value={newCustomer.city} onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })} placeholder="Anytown" /></div>
              <div className="space-y-1"><Label htmlFor="new-state">State</Label><Input id="new-state" value={newCustomer.state} onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })} placeholder="CA" /></div>
              <div className="space-y-1"><Label htmlFor="new-zipCode">Zip Code</Label><Input id="new-zipCode" value={newCustomer.zipCode} onChange={(e) => setNewCustomer({ ...newCustomer, zipCode: e.target.value })} placeholder="90210" /></div>
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

export default PostJobForm;