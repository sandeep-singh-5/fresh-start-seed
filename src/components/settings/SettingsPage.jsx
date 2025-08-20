import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { 
  UserCircle, BellRing, Percent, Tag as TagIcon, 
  Palette, Wrench, FileText, ListChecks, SlidersHorizontal
} from 'lucide-react';
import AccountSettings from '@/components/settings/AccountSettings.jsx';
import LeadShareSettings from '@/components/settings/LeadShareSettings.jsx';
import TagSettings from '@/components/settings/TagSettings.jsx';
import PipelineSettings from '@/components/settings/PipelineSettings.jsx';
import SkillSettings from '@/components/settings/SkillSettings.jsx';
import JobTemplateSettings from '@/components/settings/JobTemplateSettings.jsx';
import ReminderSettings from '@/components/settings/ReminderSettings.jsx';
import ChecklistSettings from '@/components/settings/ChecklistSettings.jsx'; 
import { useAuth } from '@/hooks/useAuth.jsx';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user } = useAuth();

  const commonTabs = [
    { value: "account", label: "Account Details", icon: UserCircle, component: <AccountSettings />, group: "General Settings" },
    { value: "reminders", label: "Notification Preferences", icon: BellRing, component: <ReminderSettings />, group: "General Settings" },
  ];

  const advertiserTabs = [
    { value: "leadShare", label: "Default Lead Share", icon: Percent, component: <LeadShareSettings />, group: "Advertiser Tools" },
    { value: "jobTemplates", label: "Job Templates", icon: FileText, component: <JobTemplateSettings />, group: "Advertiser Tools" },
    { value: "checklists", label: "Job Checklists", icon: ListChecks, component: <ChecklistSettings />, group: "Advertiser Tools" },
  ];

  const technicianTabs = [
    { value: "skills", label: "Skills Management", icon: Wrench, component: <SkillSettings />, group: "Technician Tools" },
  ];

  const platformTabs = [
    { value: "tags", label: "Job Requirement Tags", icon: TagIcon, component: <TagSettings />, group: "Platform Customization" },
    { value: "pipeline", label: "Sales Pipeline Stages", icon: Palette, component: <PipelineSettings />, group: "Platform Customization" },
  ];
  
  let tabsConfig = [...commonTabs];
  if (user?.userType === 'advertiser') {
    tabsConfig = [...tabsConfig, ...advertiserTabs];
  }
  if (user?.userType === 'technician') {
    tabsConfig = [...tabsConfig, ...technicianTabs];
  }
  tabsConfig = [...tabsConfig, ...platformTabs];
  
  const defaultTab = "account";

  const groupedTabs = tabsConfig.reduce((acc, tab) => {
    acc[tab.group] = acc[tab.group] || [];
    acc[tab.group].push(tab);
    return acc;
  }, {});

  const groupOrder = ["General Settings", "Advertiser Tools", "Technician Tools", "Platform Customization"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="space-y-8"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl shadow-lg shrink-0">
          <SlidersHorizontal className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Application Settings
          </h1>
          <p className="text-md sm:text-lg text-slate-600 mt-1">
            Fine-tune your experience and manage platform configurations.
          </p>
        </div>
      </header>

      <Tabs defaultValue={defaultTab} className="flex flex-col md:flex-row gap-8" orientation="vertical">
        <TabsList className="w-full md:w-64 lg:w-72 border-r-0 md:border-r border-slate-200 md:pr-6 space-y-1 self-start shrink-0 h-auto bg-transparent p-0 flex flex-col items-stretch">
          {groupOrder.map(groupName => {
            if (!groupedTabs[groupName] || groupedTabs[groupName].length === 0) return null;
            return (
              <div key={groupName} className="mb-3 last:mb-0">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 pt-2 pb-1.5">
                  {groupName}
                </h2>
                {groupedTabs[groupName].map(tab => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className="w-full justify-start text-sm md:text-md px-3 py-2.5 md:px-4 md:py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:font-semibold hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg transition-all duration-150 ease-in-out group"
                  >
                    <tab.icon className="h-4 w-4 md:h-5 md:w-5 mr-2.5 md:mr-3 flex-shrink-0 transition-colors" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </div>
            );
          })}
        </TabsList>
        
        <div className="flex-1 min-w-0">
          {tabsConfig.map(tab => (
            <TabsContent 
              key={tab.value} 
              value={tab.value} 
              className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              asChild 
              forceMount={true} 
            >
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="data-[state=inactive]:hidden"
              >
                {tab.component}
              </motion.div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;