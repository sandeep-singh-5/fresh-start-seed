import React from 'react';
import { motion } from 'framer-motion';
import { Percent, Users, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/hooks/useSettings.jsx';
import { toast } from '@/components/ui/use-toast';

const LeadShareSettings = () => {
  const { settings, updateSettings } = useSettings();

  const handleDefaultShareChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 100) ) {
        updateSettings({ defaultLeadShare: value === "" ? "" : parseInt(value) });
    }
  };

  const handleBlur = (e) => {
    let numericValue = parseInt(e.target.value);
    if (isNaN(numericValue) || numericValue < 0) {
        numericValue = 0;
    } else if (numericValue > 100) {
        numericValue = 100;
    }
    updateSettings({ defaultLeadShare: numericValue });
    if (e.target.value !== String(numericValue)) {
        toast({
            title: "Value Corrected",
            description: `Share percentage has been set to ${numericValue}%.`,
            variant: "default"
        });
    } else if (e.target.value !== "" && !isNaN(numericValue)) {
        toast({
            title: "Settings Updated",
            description: `Default lead share set to ${numericValue}% for technicians.`
        });
    }
  }

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <Percent className="h-7 w-7 text-blue-600" />
          Default Lead Share
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          Set the default profit share percentage for new leads. This is the share the technician receives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="defaultShare" className="text-md font-medium text-slate-700">Default Technician Share (%)</Label>
            <Input
              id="defaultShare"
              type="number"
              min="0"
              max="100"
              value={settings.defaultLeadShare === "" ? "" : String(settings.defaultLeadShare)}
              onChange={handleDefaultShareChange}
              onBlur={handleBlur}
              className="w-full md:w-1/2"
            />
          </div>
          <div className="p-5 bg-gradient-to-tr from-blue-50 via-sky-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <Users className="h-8 w-8 text-green-500 mb-1.5" />
                <p className="text-md font-medium text-slate-600">Technician's Share</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{settings.defaultLeadShare || 0}%</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                <User className="h-8 w-8 text-blue-500 mb-1.5" />
                <p className="text-md font-medium text-slate-600">Advertiser's Share</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{100 - (settings.defaultLeadShare || 0)}%</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            This percentage determines how much of the job's profit is allocated to the technician by default. You can override this for individual jobs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadShareSettings;