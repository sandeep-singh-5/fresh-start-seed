import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText, CheckSquare, Square, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/dialog';
import { useSettings } from '../../hooks/useSettings.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { toast } from '../ui/use-toast';

const JobTemplateSettings = () => {
  const { settings, addJobTemplate, updateJobTemplate, removeJobTemplate } = useSettings();
  const { user } = useAuth();

  const [initialTemplateState, setInitialTemplateState] = useState({
    id: null, name: '', title: '', description: '', category: '',
    estimatedProfit: '', profitShare: '', requirements: [], checklistId: null,
  });

  useEffect(() => {
    setInitialTemplateState(prevState => ({
      ...prevState,
      profitShare: settings.defaultLeadShare !== undefined ? String(settings.defaultLeadShare) : ''
    }));
  }, [settings.defaultLeadShare]);

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
  
  const toggleRequirement = (tagId) => {
    setCurrentTemplate(prev => {
      const requirements = prev.requirements.includes(tagId)
        ? prev.requirements.filter(r => r !== tagId)
        : [...prev.requirements, tagId];
      return { ...prev, requirements };
    });
  };

  const handleSubmitTemplate = () => {
    if (!currentTemplate.name.trim() || !currentTemplate.title.trim()) {
      toast({ title: "Error", description: "Template Name and Job Title are required.", variant: "destructive" });
      return;
    }
    const profitShareValue = currentTemplate.profitShare === '' ? settings.defaultLeadShare : parseInt(currentTemplate.profitShare);
    const templateToSave = { ...currentTemplate, profitShare: profitShareValue };

    if (isEditing && currentTemplate.id) {
      updateJobTemplate(currentTemplate.id, templateToSave);
      toast({ title: "Template Updated", description: `"${templateToSave.name}" has been updated.` });
    } else {
      addJobTemplate(templateToSave);
      toast({ title: "Template Added", description: `"${templateToSave.name}" has been added.` });
    }
    setIsDialogOpen(false);
  };
  
  useEffect(() => {
    if (!isDialogOpen) {
        setCurrentTemplate(initialTemplateState);
        setIsEditing(false);
    }
  }, [isDialogOpen, initialTemplateState]);


  const handleEditTemplate = (template) => {
    setCurrentTemplate({ 
      ...template, 
      requirements: template.requirements || [], 
      checklistId: template.checklistId || null,
      profitShare: template.profitShare !== undefined ? String(template.profitShare) : String(settings.defaultLeadShare)
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
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <FileText className="h-7 w-7 text-blue-600" /> Job Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">This section is for advertisers to manage their job templates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <FileText className="h-7 w-7 text-blue-600" />
            Job Templates
          </CardTitle>
          <CardDescription className="text-slate-600 mt-1">
            Create and manage templates for frequently posted jobs to save time.
          </CardDescription>
        </div>
        <Button onClick={openNewTemplateDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-5 w-5 mr-2" /> Create New Template
        </Button>
      </CardHeader>
      <CardContent>
        {settings.jobTemplates.length === 0 ? (
          <p className="text-md text-slate-500 text-center py-8">No job templates created yet. Click "Create New Template" to get started.</p>
        ) : (
          <div className="space-y-4">
            {settings.jobTemplates.map(template => (
              <Card key={template.id} className="bg-slate-50/60 border border-slate-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800">{template.name}</CardTitle>
                      <CardDescription className="text-sm text-slate-500 mt-0.5">{template.title} - <Badge variant="outline" className="ml-1 bg-white">{template.category || 'Uncategorized'}</Badge></CardDescription>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4 mr-1.5" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveTemplate(template.id, template.name)}>
                        <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5">
                  <p className="text-slate-600"><strong className="font-medium text-slate-700">Description:</strong> {template.description.substring(0,120)}{template.description.length > 120 && '...'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                      <p><strong className="font-medium text-slate-700">Est. Profit:</strong> ${template.estimatedProfit || 'N/A'}</p>
                      <p><strong className="font-medium text-slate-700">Tech Share:</strong> {template.profitShare !== undefined ? template.profitShare : settings.defaultLeadShare}%</p>
                  </div>
                  {template.checklistId && settings.checklists.find(cl => cl.id === template.checklistId) && (
                      <p className="text-slate-600"><strong className="font-medium text-slate-700">Checklist:</strong> {settings.checklists.find(cl => cl.id === template.checklistId)?.name}</p>
                  )}
                  {template.requirements && template.requirements.length > 0 && (
                    <div className="mt-2">
                      <strong className="font-medium text-slate-700">Requirements:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {template.requirements.map(reqId => {
                           const tagObject = settings.tags.find(t => t.id === reqId);
                           return tagObject ? <Badge key={reqId} variant="secondary">{tagObject.name}</Badge> : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-slate-800">{isEditing ? 'Edit' : 'Create New'} Job Template</DialogTitle>
            <DialogDescription className="text-slate-500">
              {isEditing ? 'Update the details for this job template.' : 'Fill in the details for your new job template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-5">
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="template-name">Template Name *</Label>
                <Input id="template-name" name="name" value={currentTemplate.name} onChange={handleInputChange} className="mt-1" placeholder="e.g., Standard Plumbing Callout" />
              </div>
              <div>
                <Label htmlFor="template-title">Job Title *</Label>
                <Input id="template-title" name="title" value={currentTemplate.title} onChange={handleInputChange} className="mt-1" placeholder="e.g., Leaky Faucet Repair" />
              </div>
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea id="template-description" name="description" value={currentTemplate.description} onChange={handleInputChange} className="mt-1" placeholder="Detailed job description" rows={3}/>
            </div>
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="template-category">Category</Label>
                <Select value={currentTemplate.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select job category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="template-profit">Est. Profit ($)</Label>
                <Input id="template-profit" name="estimatedProfit" type="number" value={currentTemplate.estimatedProfit} onChange={handleInputChange} className="mt-1" placeholder="e.g., 150" />
              </div>
              <div>
                <Label htmlFor="template-profitShare">Tech Share (%)</Label>
                <Input id="template-profitShare" name="profitShare" type="number" min="0" max="100" value={currentTemplate.profitShare} onChange={handleInputChange} className="mt-1" placeholder={`Default: ${settings.defaultLeadShare}%`} />
              </div>
              <div>
                <Label htmlFor="template-checklist">Attach Checklist</Label>
                <Select value={currentTemplate.checklistId || ''} onValueChange={(value) => handleSelectChange('checklistId', value || null)}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a checklist (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {settings.checklists && settings.checklists.map(cl => (
                            <SelectItem key={cl.id} value={cl.id}>{cl.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Requirements</Label>
              <div className="mt-1.5 space-y-1.5 border p-3 rounded-md max-h-40 overflow-y-auto bg-slate-50">
                {settings.tags && settings.tags.length > 0 ? (
                  settings.tags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRequirement(tag.id)}
                        className="flex items-center justify-start w-full text-left p-1 hover:bg-slate-200 rounded-md"
                      >
                        {currentTemplate.requirements.includes(tag.id) ? (
                          <CheckSquare className="h-4 w-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 mr-2 text-slate-400" />
                        )}
                        {tag.name}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No requirement tags defined. Add some in Platform Customization.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitTemplate} className="bg-blue-600 hover:bg-blue-700 text-white">{isEditing ? 'Save Changes' : 'Create Template'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JobTemplateSettings;