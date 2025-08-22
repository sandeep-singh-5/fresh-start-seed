import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Save, Trash2, Palette, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSettings } from '../../hooks/useSettings.jsx';
import { toast } from '../ui/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const PipelineSettings = () => {
  const { settings, addPipelineStage, removePipelineStage, updatePipelineStage, setPipelineStages } = useSettings();
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3b82f6');
  const [editingStage, setEditingStage] = useState(null); // { id, name, color }

  const colorOptions = [
    { name: 'Rose', value: '#f43f5e' }, { name: 'Pink', value: '#ec4899' }, { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Purple', value: '#a855f7' }, { name: 'Violet', value: '#8b5cf6' }, { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' }, { name: 'Sky', value: '#0ea5e9' }, { name: 'Cyan', value: '#06b6d4' },
    { name: 'Teal', value: '#14b8a6' }, { name: 'Emerald', value: '#10b981' }, { name: 'Green', value: '#22c55e' },
    { name: 'Lime', value: '#84cc16' }, { name: 'Yellow', value: '#eab308' }, { name: 'Amber', value: '#f59e0b' },
    { name: 'Orange', value: '#f97316' }, { name: 'Red', value: '#ef4444' },
    { name: 'Slate', value: '#64748b' }
  ];

  const handleAddStage = () => {
    if (newStageName.trim()) {
      const stageExists = settings.pipelineStages.some(
        stage => stage.name.toLowerCase() === newStageName.trim().toLowerCase()
      );
      if (stageExists) {
        toast({ title: "Stage Exists", description: "A stage with this name already exists.", variant: "destructive" });
        return;
      }
      addPipelineStage({ name: newStageName.trim(), color: newStageColor });
      setNewStageName('');
      setNewStageColor('#3b82f6');
      toast({ title: "Pipeline Stage Added", description: `"${newStageName}" has been added.` });
    }
  };

  const handleEditClick = (stage) => {
    setEditingStage(stage);
  };

  const handleCancelEdit = () => {
    setEditingStage(null);
  };

  const handleSaveStageUpdate = () => {
    if (!editingStage || !editingStage.name.trim()) return;
    
    const stageExists = settings.pipelineStages.some(
      stage => stage.id !== editingStage.id && stage.name.toLowerCase() === editingStage.name.trim().toLowerCase()
    );
    if (stageExists) {
      toast({ title: "Stage Exists", description: "Another stage with this name already exists.", variant: "destructive" });
      return;
    }
    updatePipelineStage(editingStage.id, { name: editingStage.name.trim(), color: editingStage.color });
    setEditingStage(null);
    toast({ title: "Pipeline Stage Updated", description: "Stage has been updated." });
  };

  const handleRemoveStage = (stageId) => {
    if (settings.pipelineStages.length <= 2) { 
      toast({ title: "Cannot Remove Stage", description: "A minimum of 2 pipeline stages is required.", variant: "destructive" });
      return;
    }
    removePipelineStage(stageId);
    toast({ title: "Pipeline Stage Removed", description: "Stage has been removed.", variant: "destructive" });
    if(editingStage && editingStage.id === stageId) setEditingStage(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const items = Array.from(settings.pipelineStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPipelineStages(items);
    toast({ title: "Pipeline Stages Reordered" });
  };

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <Palette className="h-7 w-7 text-blue-600" />
          Sales Pipeline Stages
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          Customize and reorder the stages in your job pipeline workflow. Minimum 2 stages required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-5 border border-slate-200 rounded-lg bg-slate-50/60 space-y-3">
            <h4 className="text-md font-medium text-slate-700">Add New Stage</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="space-y-1 flex-grow">
                <Label htmlFor="stageName">Stage Name</Label>
                <Input
                  id="stageName"
                  placeholder="E.g., 'Initial Contact'"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <Select value={newStageColor} onValueChange={setNewStageColor}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Select color"/>
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: opt.value }} />
                          {opt.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStage} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-5 w-5 mr-2" /> Add Stage
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-5 border-t border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700">Current Stages (Drag to Reorder)</h4>
            {settings.pipelineStages.length === 0 && <p className="text-md text-slate-500 text-center py-4">No stages defined yet.</p>}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pipelineStagesDroppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2.5">
                    {settings.pipelineStages.map((stage, index) => (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(providedDraggable, snapshot) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 border border-slate-200 rounded-lg gap-3 transition-shadow ${snapshot.isDragging ? 'shadow-xl bg-blue-50 ring-2 ring-blue-500' : 'bg-white'}`}
                          >
                            <div {...providedDraggable.dragHandleProps} className="flex items-center gap-2.5 flex-1 cursor-grab sm:cursor-auto">
                              <GripVertical className="h-5 w-5 text-slate-400 sm:cursor-grab hover:text-blue-600 shrink-0" />
                               {editingStage?.id === stage.id ? (
                                <div className="flex items-center gap-2 flex-grow">
                                  <Input
                                    value={editingStage.name}
                                    onChange={(e) => setEditingStage({...editingStage, name: e.target.value})}
                                    className="h-9 flex-grow"
                                    autoFocus
                                  />
                                  <Select value={editingStage.color} onValueChange={(color) => setEditingStage({...editingStage, color})}>
                                    <SelectTrigger className="w-32 h-9 text-xs focus:ring-blue-500">
                                      <SelectValue placeholder="Color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {colorOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border" style={{backgroundColor: opt.value}}></div>{opt.name}</div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ) : (
                                <>
                                  <div className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-sm" style={{ backgroundColor: stage.color }} />
                                  <span className="font-medium text-sm text-slate-800 break-all">{stage.name}</span>
                                  <Badge variant="outline" className="text-xs whitespace-nowrap hidden sm:inline-flex py-0.5 px-2 bg-slate-100 text-slate-600 border-slate-200">
                                    #{index + 1}
                                  </Badge>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 sm:mt-0 self-end sm:self-center">
                              {editingStage?.id === stage.id ? (
                                <>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100" onClick={handleSaveStageUpdate}>
                                    <Save className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100" onClick={() => handleEditClick(stage)}>
                                  <Edit className="h-4 w-4 text-slate-600" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveStage(stage.id)}
                                disabled={settings.pipelineStages.length <= 2}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelineSettings;