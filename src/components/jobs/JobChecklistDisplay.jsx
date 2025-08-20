import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Type, UploadCloud, MessageSquare, ChevronDown, ListChecks, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { useSettings } from '@/hooks/useSettings.jsx';
import { useJobs } from '@/hooks/useJobs.jsx';
import { toast } from '@/components/ui/use-toast';

const JobChecklistItem = ({ item, progress, onProgressChange, isReadOnly }) => {
  const [fileValue, setFileValue] = useState(progress?.fileName || '');

  const handleCheckboxChange = (checked) => {
    onProgressChange(item.id, { completed: checked });
  };

  const handleDropdownChange = (value) => {
    onProgressChange(item.id, { value });
  };

  const handleNotesChange = (e) => {
    onProgressChange(item.id, { text: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileValue(file.name);
      onProgressChange(item.id, { fileName: file.name, fileData: "SIMULATED_FILE_DATA" });
      toast({ title: "File Selected", description: `${file.name} ready for simulated upload.` });
    }
  };

  const itemLabel = (
    <>
      {item.label}
      {item.isRequired && <span className="text-red-500 ml-1">*</span>}
    </>
  );

  const renderItemContent = () => {
    switch (item.type) {
      case 'text':
        return <p className="text-sm text-gray-700 py-2 px-3 bg-blue-50 rounded-md border border-blue-200">{item.instruction || itemLabel}</p>;
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id={`checklist-item-${item.id}`}
              checked={progress?.completed || false}
              onCheckedChange={isReadOnly ? undefined : handleCheckboxChange}
              disabled={isReadOnly}
            />
            <Label htmlFor={`checklist-item-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {itemLabel}
            </Label>
          </div>
        );
      case 'dropdown':
        return (
          <div className="space-y-1 py-2">
            <Label htmlFor={`checklist-item-${item.id}`} className="text-sm">{itemLabel}</Label>
            <Select
              value={progress?.value || ''}
              onValueChange={isReadOnly ? undefined : handleDropdownChange}
              disabled={isReadOnly}
            >
              <SelectTrigger id={`checklist-item-${item.id}`}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {(item.options || []).map((opt, idx) => (
                  <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'file':
        return (
          <div className="space-y-1 py-2">
            <Label htmlFor={`checklist-item-${item.id}`} className="text-sm">{itemLabel}</Label>
            {isReadOnly ? (
                <p className="text-sm text-gray-600 p-2 border rounded-md bg-gray-50">
                    {progress?.fileName ? `File: ${progress.fileName}` : "No file uploaded."}
                </p>
            ) : (
                <Input
                    id={`checklist-item-${item.id}`}
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm"
                />
            )}
            {fileValue && !isReadOnly && <p className="text-xs text-gray-500 mt-1">Selected: {fileValue}</p>}
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-1 py-2">
            <Label htmlFor={`checklist-item-${item.id}`} className="text-sm">{itemLabel}</Label>
            <Textarea
              id={`checklist-item-${item.id}`}
              value={progress?.text || ''}
              onChange={isReadOnly ? undefined : handleNotesChange}
              placeholder="Enter notes here..."
              rows={3}
              disabled={isReadOnly}
              className="text-sm"
            />
          </div>
        );
      default:
        return <p className="text-sm text-red-500">Unknown item type</p>;
    }
  };

  const getItemIcon = () => {
    switch(item.type) {
      case 'text': return <Type size={18} className="text-blue-500"/>;
      case 'checkbox': return progress?.completed ? <CheckSquare size={18} className="text-green-500"/> : <Square size={18} className="text-gray-400"/>;
      case 'dropdown': return <ChevronDown size={18} className="text-purple-500"/>;
      case 'file': return <UploadCloud size={18} className="text-orange-500"/>;
      case 'notes': return <MessageSquare size={18} className="text-yellow-500"/>;
      default: return <ListChecks size={18} />;
    }
  };

  return (
    <motion.div 
      className={`p-3 border rounded-md bg-white shadow-sm mb-2 ${item.isRequired && !isReadOnly && !(progress?.completed || progress?.value || progress?.fileName || progress?.text?.trim()) ? 'border-red-300 bg-red-50' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          {item.isRequired && <AlertTriangle size={16} className="text-red-500 inline-block mr-1" title="Required Item"/>}
          {getItemIcon()}
        </div>
        <div className="flex-1">
          {renderItemContent()}
        </div>
      </div>
    </motion.div>
  );
};


const JobChecklistDisplay = ({ jobId, checklistId, initialProgress, userType }) => {
  const { settings } = useSettings();
  const { updateJobChecklistProgress } = useJobs();
  const [checklist, setChecklist] = useState(null);
  const [progress, setProgress] = useState(initialProgress || {});

  useEffect(() => {
    const foundChecklist = settings.checklists?.find(cl => cl.id === checklistId);
    if (foundChecklist) {
        setChecklist({
            ...foundChecklist,
            items: foundChecklist.items.map(item => ({...item, isRequired: item.isRequired || false }))
        });
    } else {
        setChecklist(null);
    }
  }, [checklistId, settings.checklists]);

  useEffect(() => {
    setProgress(initialProgress || {});
  }, [initialProgress]);

  const handleProgressChange = (itemId, itemProgress) => {
    const newProgress = {
      ...progress,
      [itemId]: itemProgress,
    };
    setProgress(newProgress);
    updateJobChecklistProgress(jobId, newProgress); 
  };

  if (!checklist) {
    return (
      <Card className="mt-4 border-dashed border-yellow-400 bg-yellow-50">
        <CardContent className="p-4 text-center text-yellow-700">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p className="font-medium">Checklist not found or not loaded.</p>
          <p className="text-sm">The assigned checklist might have been removed or there was an issue loading it.</p>
        </CardContent>
      </Card>
    );
  }
  
  const allItems = checklist.items || [];
  const requiredItems = allItems.filter(item => item.isRequired);
  const nonRequiredItems = allItems.filter(item => !item.isRequired);

  const isItemCompleted = (item, itemProg) => {
    if (!itemProg) return false;
    if (item.type === 'checkbox') return itemProg.completed;
    if (item.type === 'dropdown') return !!itemProg.value;
    if (item.type === 'file') return !!itemProg.fileName;
    if (item.type === 'notes') return !!itemProg.text?.trim();
    if (item.type === 'text') return true; // Instructional text is always "complete"
    return false;
  };

  const completedRequiredItemsCount = requiredItems.filter(item => isItemCompleted(item, progress[item.id])).length;
  const completedNonRequiredItemsCount = nonRequiredItems.filter(item => isItemCompleted(item, progress[item.id])).length;
  
  const totalItemsForProgress = allItems.length;
  const completedItemsForProgress = completedRequiredItemsCount + completedNonRequiredItemsCount;

  const completionPercentage = totalItemsForProgress > 0 
    ? Math.round((completedItemsForProgress / totalItemsForProgress) * 100) 
    : 0;
  
  const allRequiredSatisfied = requiredItems.length === 0 || completedRequiredItemsCount === requiredItems.length;

  const isReadOnly = userType === 'advertiser';

  return (
    <Card className="mt-4 shadow-lg border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
                <CardTitle className="flex items-center gap-2 text-xl text-indigo-700">
                    <ListChecks className="h-6 w-6" />
                    {checklist.name}
                </CardTitle>
                <CardDescription className="text-indigo-500">
                    {isReadOnly ? "View checklist progress." : "Complete the items below. Items marked with * are required."}
                </CardDescription>
            </div>
            <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-indigo-600">{completionPercentage}% Complete</p>
                <p className="text-xs text-indigo-500">{completedItemsForProgress} of {totalItemsForProgress} items</p>
                {requiredItems.length > 0 && (
                    <p className={`text-xs ${allRequiredSatisfied ? 'text-green-600' : 'text-red-600'}`}>
                        {completedRequiredItemsCount} of {requiredItems.length} required items completed.
                    </p>
                )}
            </div>
        </div>
        {totalItemsForProgress > 0 && (
            <div className="w-full bg-indigo-200 rounded-full h-2.5 mt-2">
                <motion.div 
                    className={`h-2.5 rounded-full ${allRequiredSatisfied || requiredItems.length === 0 ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
                    style={{ width: `${completionPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {allItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-3">This checklist has no items.</p>
        ) : (
          allItems.map(item => (
            <JobChecklistItem
              key={item.id}
              item={item}
              progress={progress[item.id]}
              onProgressChange={handleProgressChange}
              isReadOnly={isReadOnly}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default JobChecklistDisplay;