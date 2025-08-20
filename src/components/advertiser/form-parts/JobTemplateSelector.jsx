import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/useSettings';
import { FileText } from 'lucide-react';

const JobTemplateSelector = ({ onApplyTemplate }) => {
  const { settings } = useSettings();
  const { jobTemplates } = settings;

  if (!jobTemplates || jobTemplates.length === 0) {
    return null; 
  }

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gradient-to-r from-blue-50 via-purple-50 to-green-50">
      <Label className="text-base font-semibold mb-3 block text-gray-700 flex items-center">
        <FileText size={20} className="mr-2 text-blue-600" />
        Quick Start with a Template
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {jobTemplates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            className="h-auto p-3 text-left flex flex-col items-start hover:bg-white border-2 hover:border-blue-400 transition-all duration-200 ease-in-out transform hover:scale-105 bg-white shadow-sm"
            onClick={() => onApplyTemplate(template)}
            title={`Apply ${template.name} template`}
          >
            <span className="font-medium text-sm text-gray-800">{template.name}</span>
            <div className="flex items-center justify-between w-full mt-1">
              <Badge variant="secondary" className="text-xs">{template.category}</Badge>
              {template.estimatedProfit && <Badge variant="outline" className="text-xs text-green-600 border-green-300">Est. ${template.estimatedProfit}</Badge>}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default JobTemplateSelector;