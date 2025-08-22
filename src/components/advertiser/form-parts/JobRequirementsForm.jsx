
import React from 'react';
import { Label } from '../../ui/label.jsx';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input.jsx';
import { Badge } from '../../ui/badge';
import { ListChecks, AlertTriangle, CalendarDays, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const JobRequirementsForm = ({ formData, onInputChange, selectedTags, setSelectedTags, settingsTags }) => {

  const toggleTag = (tagToToggle) => {
    setSelectedTags(prev => 
      prev.some(tag => tag.id === tagToToggle.id)
        ? prev.filter(t => t.id !== tagToToggle.id)
        : [...prev, tagToToggle]
    );
  };

  const isTagSelected = (tagToCheck) => {
    return selectedTags.some(tag => tag.id === tagToCheck.id);
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
        <ListChecks size={20} className="mr-2 text-purple-600"/>
        Job Requirements & Urgency
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="urgency" className="font-medium flex items-center">
          <AlertTriangle size={16} className="mr-1 text-purple-600"/>
          Urgency Level
        </Label>
        <Select value={formData.urgency} onValueChange={(value) => onInputChange('urgency', value)}>
          <SelectTrigger className="focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Flexible, within a week</SelectItem>
            <SelectItem value="medium">Medium - Within 2-3 days</SelectItem>
            <SelectItem value="high">High - Within 24 hours</SelectItem>
            <SelectItem value="urgent">Urgent - ASAP / Emergency</SelectItem>
            <SelectItem value="specific_schedule">Specific Day & Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.urgency === 'specific_schedule' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 p-4 border rounded-md bg-purple-50 border-purple-200"
        >
          <h4 className="text-md font-medium text-purple-700 flex items-center"><CalendarDays size={18} className="mr-2"/>Scheduled Appointment Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="specificDate" className="text-sm text-purple-700">Date *</Label>
              <Input 
                type="date" 
                id="specificDate" 
                value={formData.specificDate} 
                onChange={(e) => onInputChange('specificDate', e.target.value)}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-sm text-purple-700">Start Time *</Label>
              <Input 
                type="time" 
                id="startTime" 
                value={formData.startTime} 
                onChange={(e) => onInputChange('startTime', e.target.value)}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-sm text-purple-700">End Time *</Label>
              <Input 
                type="time" 
                id="endTime" 
                value={formData.endTime} 
                onChange={(e) => onInputChange('endTime', e.target.value)}
                className="focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
           <p className="text-xs text-purple-600">Please ensure the selected technician can meet this specific schedule.</p>
        </motion.div>
      )}

      <div className="space-y-1.5">
        <Label className="font-medium">Predefined Requirement Tags</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 min-h-[60px]">
          {settingsTags && settingsTags.length > 0 ? settingsTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={isTagSelected(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-150 ease-in-out text-xs py-1 px-2.5 rounded-full ${
                isTagSelected(tag)
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent shadow-md' 
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
              }`}
              onClick={() => toggleTag(tag)}
              style={isTagSelected(tag) ? {} : { backgroundColor: 'white', color: tag.color, borderColor: tag.color }}
            >
              {tag.name}
            </Badge>
          )) : (
            <p className="text-xs text-gray-500">No tags configured in settings.</p>
          )}
        </div>
        {selectedTags.length > 0 && (
          <p className="text-xs text-gray-500 italic mt-1">
            Selected: {selectedTags.map(t => t.name).join(', ')}
          </p>
        )}
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="requirementsText" className="font-medium">Additional Requirements / Notes</Label>
        <Textarea
          id="requirementsText"
          value={formData.requirementsText}
          onChange={(e) => onInputChange('requirementsText', e.target.value)}
          placeholder="E.g., Must have specific tools, liability insurance, specific certifications, specific times available..."
          rows={3}
          className="focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    </div>
  );
};

export default JobRequirementsForm;
