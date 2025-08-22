import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ListChecks, CheckSquare, Type, UploadCloud, MessageSquare, ChevronDown, ChevronUp, GripVertical, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { useSettings } from '../../hooks/useSettings.jsx';
import { toast } from '../ui/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ChecklistItemEditor = ({ item, index, updateItem, removeItemFromChecklist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [optionInput, setOptionInput] = useState('');

  const handleItemChange = (field, value) => {
    updateItem(index, { ...item, [field]: value });
  };

  const handleAddOption = () => {
    if (optionInput.trim() === '') return;
    const newOptions = [...(item.options || []), optionInput.trim()];
    updateItem(index, { ...item, options: newOptions });
    setOptionInput('');
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = item.options.filter((_, i) => i !== optionIndex);
    updateItem(index, { ...item, options: newOptions });
  };
  
  useEffect(() => {
    if (!item.label) { 
        setIsExpanded(true);
    }
  }, [item.label]);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`p-3.5 border rounded-lg bg-white shadow-sm mb-2.5 transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div {...provided.dragHandleProps} className="cursor-grab text-slate-400 hover:text-blue-600 p-1">
                <GripVertical size={18} />
              </div>
              <span className="font-medium text-slate-700 text-md truncate">{item.label || `New Item ${index + 1}`}</span>
              {item.isRequired && <AlertTriangle size={15} className="text-red-500 shrink-0" title="Required" />}
              <Badge variant="outline" className="text-xs capitalize bg-slate-100 text-slate-600 border-slate-200 shrink-0">{item.type}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-slate-100">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeItemFromChecklist(index)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop:0 }} 
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} 
              transition={{ duration: 0.2, ease: "circOut" }}
              className="mt-3.5 space-y-3.5 pt-3.5 border-t border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor={`item-label-${index}`}>Label/Question</Label>
                  <Input
                    id={`item-label-${index}`}
                    value={item.label || ''}
                    onChange={(e) => handleItemChange('label', e.target.value)}
                    placeholder="e.g., Confirm safety gear"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`item-type-${index}`}>Type</Label>
                  <Select value={item.type} onValueChange={(value) => handleItemChange('type', value)}>
                    <SelectTrigger id={`item-type-${index}`} className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Instructional Text</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="file">File Upload Placeholder</SelectItem>
                      <SelectItem value="notes">Notes Field</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Switch
                    id={`item-required-${index}`}
                    checked={item.isRequired || false}
                    onCheckedChange={(checked) => handleItemChange('isRequired', checked)}
                />
                <Label htmlFor={`item-required-${index}`}>Mark as Required</Label>
              </div>

              {item.type === 'dropdown' && (
                <div className="pt-1">
                  <Label>Dropdown Options</Label>
                  <div className="space-y-1.5 mt-1">
                    {(item.options || []).map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-1.5">
                        <Input value={opt} readOnly className="bg-slate-100 flex-grow" />
                        <Button variant="outline" size="icon" onClick={() => handleRemoveOption(optIndex)} className="h-9 w-9 text-red-500 border-slate-300 hover:bg-red-50 bg-white">
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      placeholder="Add new option"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      className="flex-grow"
                    />
                    <Button onClick={handleAddOption} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">Add</Button>
                  </div>
                </div>
              )}
              {item.type === 'text' && (
                <div className="pt-1">
                    <Label htmlFor={`item-instruction-${index}`}>Instruction Text Detail</Label>
                    <Textarea
                        id={`item-instruction-${index}`}
                        value={item.instruction || ''}
                        onChange={(e) => handleItemChange('instruction', e.target.value)}
                        placeholder="Detailed instructions for this item..."
                        rows={2}
                        className="mt-1"
                    />
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const ChecklistSettings = () => {
  const { settings, updateSettings } = useSettings();
  const checklists = settings.checklists || [];

  const initialChecklistState = { id: null, name: '', items: [] };
  const [currentChecklist, setCurrentChecklist] = useState(initialChecklistState);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentChecklist(prev => ({ ...prev, [name]: value }));
  };

  const addNewItemToCurrentChecklist = () => {
    setCurrentChecklist(prev => ({
      ...prev,
      items: [...prev.items, { id: `item_${Date.now()}_${prev.items.length}`, type: 'checkbox', label: '', options: [], isRequired: false, instruction:'' }]
    }));
  };

  const updateItemInCurrentChecklist = (index, updatedItem) => {
    setCurrentChecklist(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? updatedItem : item))
    }));
  };

  const removeItemFromCurrentChecklist = (index) => {
    setCurrentChecklist(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  const onDragEndCurrentChecklistItems = (result) => {
    if (!result.destination) return;
    const items = Array.from(currentChecklist.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCurrentChecklist(prev => ({ ...prev, items }));
  };

  const handleSubmitChecklist = () => {
    if (!currentChecklist.name.trim()) {
      toast({ title: "Error", description: "Checklist Name is required.", variant: "destructive" });
      return;
    }

    let updatedChecklists;
    if (isEditing && currentChecklist.id) {
      updatedChecklists = checklists.map(cl => cl.id === currentChecklist.id ? currentChecklist : cl);
      toast({ title: "Checklist Updated", description: `"${currentChecklist.name}" has been updated.` });
    } else {
      const newChecklist = { ...currentChecklist, id: `cl_${Date.now()}` };
      updatedChecklists = [...checklists, newChecklist];
      toast({ title: "Checklist Added", description: `"${currentChecklist.name}" has been added.` });
    }
    updateSettings({ checklists: updatedChecklists });
    setIsDialogOpen(false);
  };
  
  useEffect(() => {
    if (!isDialogOpen) {
        setCurrentChecklist(initialChecklistState);
        setIsEditing(false);
    }
  }, [isDialogOpen, initialChecklistState]);

  const handleEditChecklist = (checklist) => {
    setCurrentChecklist({
        ...checklist,
        items: checklist.items.map(item => ({ ...item, isRequired: item.isRequired || false, id: item.id || `item_${Date.now()}` })) 
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleRemoveChecklist = (checklistId, checklistName) => {
    const updatedChecklists = checklists.filter(cl => cl.id !== checklistId);
    updateSettings({ checklists: updatedChecklists });
    toast({ title: "Checklist Removed", description: `"${checklistName}" has been removed.`, variant: "destructive" });
  };

  const openNewChecklistDialog = () => {
    setCurrentChecklist(initialChecklistState);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const getItemIcon = (type) => {
    switch(type) {
      case 'text': return <Type size={15} className="text-blue-600"/>;
      case 'checkbox': return <CheckSquare size={15} className="text-green-600"/>;
      case 'dropdown': return <ChevronDown size={15} className="text-purple-600"/>;
      case 'file': return <UploadCloud size={15} className="text-orange-600"/>;
      case 'notes': return <MessageSquare size={15} className="text-yellow-600"/>;
      default: return <ListChecks size={15} className="text-slate-500"/>;
    }
  };

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <ListChecks className="h-7 w-7 text-blue-600" />
            Job Checklists
          </CardTitle>
          <CardDescription className="text-slate-600 mt-1">
            Create and manage checklist templates to ensure job consistency and quality.
          </CardDescription>
        </div>
        <Button onClick={openNewChecklistDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-5 w-5 mr-2" /> Create New Checklist
        </Button>
      </CardHeader>
      <CardContent>
        {checklists.length === 0 ? (
          <p className="text-md text-slate-500 text-center py-8">No checklists created yet. Click "Create New Checklist" to get started.</p>
        ) : (
          <div className="space-y-4">
            {checklists.map(checklist => (
              <Card key={checklist.id} className="bg-slate-50/60 border border-slate-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800">{checklist.name}</CardTitle>
                      <CardDescription className="text-sm text-slate-500 mt-0.5">{checklist.items.length} item(s)</CardDescription>
                    </div>
                    <div className="flex gap-2 self-start sm:self-center shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditChecklist(checklist)}>
                        <Edit className="h-4 w-4 mr-1.5" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveChecklist(checklist.id, checklist.name)}>
                        <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  {checklist.items.length > 0 && (
                      <div className="mt-1 space-y-1">
                          {checklist.items.slice(0, 3).map(item => (
                              <div key={item.id} className="flex items-center gap-2 text-sm text-slate-600">
                                  {item.isRequired && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" titleAccess='Required'/>}
                                  {getItemIcon(item.type)}
                                  <span className="truncate max-w-full">{item.label}</span>
                              </div>
                          ))}
                          {checklist.items.length > 3 && <p className="text-xs text-slate-500 mt-1.5">...and {checklist.items.length - 3} more items.</p>}
                      </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-slate-800">{isEditing ? 'Edit' : 'Create New'} Checklist Template</DialogTitle>
            <DialogDescription className="text-slate-500">
              {isEditing ? 'Update the details for this checklist.' : 'Define items for your new checklist template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-5 px-1 space-y-5 flex-grow overflow-y-auto">
            <div>
              <Label htmlFor="checklist-name">Checklist Name *</Label>
              <Input id="checklist-name" name="name" value={currentChecklist.name} onChange={handleInputChange} placeholder="e.g., Pre-Job Safety Inspection" className="mt-1.5" />
            </div>
            
            <Label className="font-semibold text-slate-800 block pt-2 mb-2 text-lg">Checklist Items</Label>
            <DragDropContext onDragEnd={onDragEndCurrentChecklistItems}>
              <Droppable droppableId="checklistItemsDialog">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2.5 min-h-[100px]">
                    {currentChecklist.items.map((item, index) => (
                        <ChecklistItemEditor
                          key={item.id}
                          item={item}
                          index={index}
                          updateItem={updateItemInCurrentChecklist}
                          removeItemFromChecklist={removeItemFromCurrentChecklist}
                        />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button type="button" variant="outline" onClick={addNewItemToCurrentChecklist} className="mt-3 w-full py-2.5 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500">
              <Plus size={17} className="mr-2" /> Add Item to Checklist
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitChecklist} className="bg-blue-600 hover:bg-blue-700 text-white">{isEditing ? 'Save Changes' : 'Create Checklist'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChecklistSettings;