import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Clock, Briefcase, FileText, DollarSign, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useSettings } from '@/hooks/useSettings.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';

const ReminderSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();

  const initialReminderState = {
    upcomingJobs: { enabled: true, timing: '1_day_before' },
    quoteFollowUp: { enabled: true, timing: '3_days_after' },
    newLeads: { enabled: true, timing: 'immediately' },
    pipelineTaskDue: { enabled: true, timing: 'on_due_date' },
    invoicePaymentDue: { enabled: true, timing: '1_day_before' },
    newMessage: { enabled: true, timing: 'immediately' },
  };

  const [reminders, setReminders] = useState(settings.reminders || initialReminderState);

  useEffect(() => {
    setReminders(settings.reminders || initialReminderState);
  }, [settings.reminders]);

  const handleReminderChange = (key, field, value) => {
    const updatedReminders = {
      ...reminders,
      [key]: {
        ...(reminders[key] || { enabled: false, timing: '' }),
        [field]: value,
      },
    };
    setReminders(updatedReminders);
    updateSettings({ reminders: updatedReminders });
    toast({
      title: "Reminder Settings Updated",
      description: `Reminder for "${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}" has been updated.`,
    });
  };

  const reminderOptions = [
    { key: 'upcomingJobs', label: 'Upcoming Jobs', icon: Briefcase, relevantTo: ['advertiser', 'technician'] },
    { key: 'quoteFollowUp', label: 'Quote Follow-ups', icon: FileText, relevantTo: ['advertiser'] },
    { key: 'newLeads', label: 'New Leads/Opportunities', icon: Briefcase, relevantTo: ['technician'] },
    { key: 'pipelineTaskDue', label: 'Pipeline Tasks Due', icon: Clock, relevantTo: ['advertiser', 'technician'] },
    { key: 'invoicePaymentDue', label: 'Invoice Payments Due', icon: DollarSign, relevantTo: ['advertiser'] },
    { key: 'newMessage', label: 'New Messages', icon: MessageSquare, relevantTo: ['advertiser', 'technician'] },
  ];

  const timingOptions = {
    upcomingJobs: [
      { value: '1_hour_before', label: '1 Hour Before' }, { value: '3_hours_before', label: '3 Hours Before' },
      { value: '12_hours_before', label: '12 Hours Before' }, { value: '1_day_before', label: '1 Day Before' },
      { value: '2_days_before', label: '2 Days Before' },
    ],
    quoteFollowUp: [
      { value: '1_day_after', label: '1 Day After Quote Sent' }, { value: '3_days_after', label: '3 Days After Quote Sent' },
      { value: '1_week_after', label: '1 Week After Quote Sent' },
    ],
    newLeads: [ { value: 'immediately', label: 'Immediately' }, { value: 'hourly_digest', label: 'Hourly Digest' } ],
    pipelineTaskDue: [ { value: 'on_due_date', label: 'On Due Date' }, { value: '1_day_before', label: '1 Day Before Due' } ],
    invoicePaymentDue: [
      { value: 'on_due_date', label: 'On Due Date' }, { value: '1_day_before', label: '1 Day Before Due' },
      { value: '3_days_before', label: '3 Days Before Due' },
    ],
     newMessage: [
      { value: 'immediately', label: 'Immediately' }, { value: 'every_15_mins', label: 'Every 15 Mins (If unread)' },
      { value: 'every_hour', label: 'Hourly (If unread)' },
    ]
  };

  const filteredReminderOptions = reminderOptions.filter(opt => user && opt.relevantTo.includes(user.userType));

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <BellRing className="h-7 w-7 text-blue-600" />
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          Configure notifications to stay on top of your tasks and communications.
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-slate-200">
        {filteredReminderOptions.map((option, index) => {
          const reminderConfig = reminders[option.key] || { enabled: false, timing: '' };
          const currentTimings = timingOptions[option.key] || [];
          return (
            <div key={option.key} className={`py-5 ${index === 0 ? 'pt-0' : ''}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center gap-2.5 mb-2.5 sm:mb-0">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <option.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <Label htmlFor={`switch-${option.key}`} className="text-md font-medium text-slate-700">
                    {option.label}
                  </Label>
                </div>
                <Switch
                  id={`switch-${option.key}`}
                  checked={reminderConfig.enabled}
                  onCheckedChange={(checked) => handleReminderChange(option.key, 'enabled', checked)}
                  className="self-start sm:self-center"
                />
              </div>
              {reminderConfig.enabled && currentTimings.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pl-0 sm:pl-10">
                    <Label htmlFor={`select-${option.key}`} className="text-sm font-medium text-slate-600">Remind me:</Label>
                    <Select
                      value={reminderConfig.timing}
                      onValueChange={(value) => handleReminderChange(option.key, 'timing', value)}
                    >
                      <SelectTrigger id={`select-${option.key}`} className="w-full sm:w-[280px] mt-1">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentTimings.map(timeOpt => (
                          <SelectItem key={timeOpt.value} value={timeOpt.value}>
                            {timeOpt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
        {filteredReminderOptions.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No specific reminders configured for your account type yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;