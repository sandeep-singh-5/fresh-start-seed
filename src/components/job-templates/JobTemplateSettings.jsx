import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { CheckSquare, Square } from 'lucide-react';


const JobTemplateSettings = () => {
  const { settings, addJobTemplate, updateJobTemplate, removeJobTemplate } = useSettings();
  const { user } = useAuth();

  const initialTemplateState = {
    id: null,
    name: '',
    title: '',
    description: '',
    category: '',
    estimatedProfit: '',
    profitShare: settings.defaultLeadShare.toString(),
    requirements: [],
    checklistId: '', 
  };

  const [currentTemplate, setCurrentTemplate] = useState(initialTemplateState);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Cleaning', 'Landscaping', 'Appliance Repair', 'Garage Doors', 'Handyman', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setCurrentTemplate(prev => ({ ...prev, [name]: value }));
  };


  const toggleRequirement = (tag) => {
    setCurrentTemplate(prev => {
      const requirements = prev.requirements.includes(tag)
        ? prev.requirements.filter(r => r !== tag)
        : [...prev.requirements, tag];
      return { ...prev, requirements };
    });
  };

  const handleSubmitTemplate = () => {
    if (!currentTemplate.name.trim() || !currentTemplate.title.trim()) {
      toast({ title: "Error", description: "Template Name and Job Title are required.", variant: "destructive" });
      return;
    }
    if (isEditing && currentTemplate.id) {
      updateJobTemplate(currentTemplate.id, currentTemplate);
      toast({ title: "Template Updated", description: `"${currentTemplate.name}" has been updated.` });
    } else {
      addJobTemplate(currentTemplate);
      toast({ title: "Template Added", description: `"${currentTemplate.name}" has been added.` });
    }
    setIsDialogOpen(false);
    setCurrentTemplate(initialTemplateState);
    setIsEditing(false);
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate({ 
      ...initialTemplateState, 
      ...template, 
      requirements: template.requirements || [],
      checklistId: template.checklistId || ''
    }); 
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleRemoveTemplate = (templateId, templateName) => {
    removeJobTemplate(templateId);
    toast({ title: "Template Removed", description: `"${templateName}" has been removed.`, variant: "destructive" });
  };

  const openNewTemplateDialog = () => {
    setCurrentTemplate(initialTemplateState);
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  if (user?.userType !== 'advertiser') {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Job Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section is for advertisers to manage their job templates.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Job Templates
            </CardTitle>
            <CardDescription>
              Create and manage templates for frequently posted jobs to save time.
            </CardDescription>
          </div>
          <Button onClick={openNewTemplateDialog}>
            <Plus className="h-4 w-4 mr-2" /> Create New Template
          </Button>
        </CardHeader>
        <CardContent>
          {settings.jobTemplates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No job templates created yet. Click "Create New Template" to get started.</p>
          ) : (
            <div className="space-y-4">
              {settings.jobTemplates.map(template => (
                <Card key={template.id} className="bg-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.title} - {template.category}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveTemplate(template.id, template.name)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-1"><strong className="text-gray-600">Description:</strong> {template.description.substring(0,100)}{template.description.length > 100 && '...'}</p>
                    <p className="mb-1"><strong className="text-gray-600">Est. Profit:</strong> ${template.estimatedProfit || 'N/A'}</p>
                    <p className="mb-1"><strong className="text-gray-600">Tech Share:</strong> {template.profitShare || settings.defaultLeadShare}%</p>
                    {template.requirements && template.requirements.length > 0 && (
                      <div className="mt-2">
                        <strong className="text-gray-600">Requirements:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.requirements.map(req => <Badge key={req} variant="secondary">{req}</Badge>)}
                        </div>
                      </div>
                    )}
                    {template.checklistId && settings.checklists?.find(cl => cl.id === template.checklistId) && (
                       <p className="mt-1"><strong className="text-gray-600">Checklist:</strong> {settings.checklists.find(cl => cl.id === template.checklistId).name}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit' : 'Create New'} Job Template</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details for this job template.' : 'Fill in the details for your new job template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-name" className="text-right col-span-1">Template Name</Label>
              <Input id="template-name" name="name" value={currentTemplate.name} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Standard Plumbing Callout" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-title" className="text-right col-span-1">Job Title</Label>
              <Input id="template-title" name="title" value={currentTemplate.title} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Leaky Faucet Repair" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="template-description" className="text-right col-span-1 pt-2">Description</Label>
              <Textarea id="template-description" name="description" value={currentTemplate.description} onChange={handleInputChange} className="col-span-3" placeholder="Detailed job description" rows={3}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-category" className="text-right col-span-1">Category</Label>
              <Select value={currentTemplate.category} onValueChange={(val) => handleSelectChange('category', val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-profit" className="text-right col-span-1">Est. Profit ($)</Label>
              <Input id="template-profit" name="estimatedProfit" type="number" value={currentTemplate.estimatedProfit} onChange={handleInputChange} className="col-span-3" placeholder="e.g., 150" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-profitShare" className="text-right col-span-1">Tech Share (%)</Label>
              <Input id="template-profitShare" name="profitShare" type="number" min="0" max="100" value={currentTemplate.profitShare} onChange={handleInputChange} className="col-span-3" placeholder={`Default: ${settings.defaultLeadShare}%`} />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right col-span-1 pt-2">Requirements</Label>
              <div className="col-span-3 space-y-2 border p-3 rounded-md max-h-48 overflow-y-auto">
                {settings.tags && settings.tags.length > 0 ? (
                  settings.tags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRequirement(tag)}
                        className="flex items-center justify-start w-full text-left p-1 hover:bg-gray-100"
                      >
                        {currentTemplate.requirements.includes(tag) ? (
                          <CheckSquare className="h-4 w-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 mr-2 text-gray-400" />
                        )}
                        {tag}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No requirement tags defined in settings.</p>
                )}
              </div>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-checklistId" className="text-right col-span-1">Checklist</Label>
              <Select value={currentTemplate.checklistId || ''} onValueChange={(val) => handleSelectChange('checklistId', val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a checklist (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Checklist</SelectItem>
                  {(settings.checklists || []).map(cl => (
                    <SelectItem key={cl.id} value={cl.id}>{cl.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitTemplate}>{isEditing ? 'Save Changes' : 'Create Template'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default JobTemplateSettings;