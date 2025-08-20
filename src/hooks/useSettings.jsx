import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const initialPipelineStages = [
  { id: 'stage_open', name: 'Open Leads', color: '#3b82f6' }, 
  { id: 'stage_contacted', name: 'Contacted', color: '#10b981' }, 
  { id: 'stage_assessment', name: 'Assessment', color: '#f59e0b' }, 
  { id: 'stage_quote_sent', name: 'Quote Sent', color: '#8b5cf6' }, 
  { id: 'stage_won', name: 'Won / In Progress', color: '#22c55e' }, 
  { id: 'stage_completed', name: 'Completed', color: '#06b6d4' }, 
  { id: 'stage_paid', name: 'Paid & Closed', color: '#059669' }, 
  { id: 'stage_lost', name: 'Lost / Cancelled', color: '#ef4444' } 
];

const initialTags = [
  { id: 'tag_licensed', name: 'Licensed Required', color: '#6366f1' },
  { id: 'tag_insured', name: 'Insurance Required', color: '#3b82f6' },
  { id: 'tag_tools', name: 'Tools Provided', color: '#10b981' },
  { id: 'tag_emergency', name: 'Emergency Service', color: '#ef4444' },
  { id: 'tag_weekend', name: 'Weekend Available', color: '#f59e0b' },
  { id: 'tag_bgcheck', name: 'Background Check', color: '#8b5cf6' },
];


const initialReminders = {
  upcomingJobs: { enabled: true, timing: '1_day_before' },
  quoteFollowUp: { enabled: true, timing: '3_days_after' },
  newLeads: { enabled: true, timing: 'immediately' },
  pipelineTaskDue: { enabled: true, timing: 'on_due_date' },
  invoicePaymentDue: { enabled: true, timing: '1_day_before' },
  newMessage: { enabled: true, timing: 'immediately' },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    defaultLeadShare: 50,
    tags: initialTags,
    pipelineStages: initialPipelineStages,
    jobTemplates: [],
    reminders: initialReminders,
    checklists: [], 
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        
        const checklistsWithRequired = (parsedSettings.checklists || []).map(cl => ({
          ...cl,
          items: (cl.items || []).map(item => ({
            ...item,
            isRequired: item.isRequired || false 
          }))
        }));

        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
          pipelineStages: parsedSettings.pipelineStages && parsedSettings.pipelineStages.length > 0 ? parsedSettings.pipelineStages : initialPipelineStages,
          jobTemplates: parsedSettings.jobTemplates || [],
          tags: parsedSettings.tags && parsedSettings.tags.length > 0 ? parsedSettings.tags : initialTags,
          reminders: { ...initialReminders, ...(parsedSettings.reminders || {}) },
          checklists: checklistsWithRequired, 
        }));
      } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        setSettings(prev => ({ ...prev, pipelineStages: initialPipelineStages, jobTemplates: [], tags: initialTags, reminders: initialReminders, checklists: [] }));
      }
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      if (newSettings.checklists) {
        updatedSettings.checklists = newSettings.checklists.map(cl => ({
          ...cl,
          items: (cl.items || []).map(item => ({
            ...item,
            isRequired: item.isRequired || false
          }))
        }));
      }
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);

  const addTag = (tag) => {
    updateSettings({ 
      tags: [...settings.tags, { ...tag, id: `tag_${Date.now()}` }] 
    });
  };

  const removeTag = (tagId) => {
    updateSettings({ tags: settings.tags.filter(t => t.id !== tagId) });
  };
  
  const updateTag = (tagId, updates) => {
    updateSettings({
      tags: settings.tags.map(tag =>
        tag.id === tagId ? { ...tag, ...updates } : tag
      )
    });
  };

  const addPipelineStage = (stage) => {
    updateSettings({
      pipelineStages: [...settings.pipelineStages, { ...stage, id: `stage_${Date.now()}` }]
    });
  };

  const removePipelineStage = (stageId) => {
    updateSettings({
      pipelineStages: settings.pipelineStages.filter(stage => stage.id !== stageId)
    });
  };

  const updatePipelineStage = (stageId, updates) => {
    updateSettings({
      pipelineStages: settings.pipelineStages.map(stage =>
        stage.id === stageId ? { ...stage, ...updates } : stage
      )
    });
  };
  
  const setPipelineStages = (newStages) => {
    updateSettings({ pipelineStages: newStages });
  };

  const addJobTemplate = (template) => {
    updateSettings({
      jobTemplates: [...settings.jobTemplates, { ...template, id: `tpl_${Date.now()}` }]
    });
  };

  const updateJobTemplate = (templateId, updates) => {
    updateSettings({
      jobTemplates: settings.jobTemplates.map(template =>
        template.id === templateId ? { ...template, ...updates } : template
      )
    });
  };

  const removeJobTemplate = (templateId) => {
    updateSettings({
      jobTemplates: settings.jobTemplates.filter(template => template.id !== templateId)
    });
  };
  
  const value = {
    settings,
    updateSettings,
    addTag,
    removeTag,
    updateTag,
    addPipelineStage,
    removePipelineStage,
    updatePipelineStage,
    setPipelineStages,
    addJobTemplate,
    updateJobTemplate,
    removeJobTemplate,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};