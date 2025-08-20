import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, User, Calendar, GripVertical, ExternalLink, Users, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useJobs } from '@/hooks/useJobs.jsx';
import { useSettings } from '@/hooks/useSettings.jsx';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';

const PipelinePage = () => {
  const { allJobs, updateJobStatus, updateJobOrderInStage } = useJobs(); 
  const { settings } = useSettings();
  const [pipelineJobs, setPipelineJobs] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const jobsByStage = {};
    settings.pipelineStages.forEach(stage => {
      jobsByStage[stage.id] = [];
    });

    allJobs.forEach(job => {
      const stage = settings.pipelineStages.find(s => s.name.toLowerCase() === job.status?.toLowerCase());
      const stageId = stage ? stage.id : (settings.pipelineStages[0]?.id || 'open');
      if (jobsByStage[stageId]) {
        jobsByStage[stageId].push(job);
      } else if (jobsByStage[settings.pipelineStages[0]?.id]) { 
        jobsByStage[settings.pipelineStages[0]?.id].push(job);
      }
    });
    
    settings.pipelineStages.forEach(stage => {
      if (jobsByStage[stage.id]) {
        jobsByStage[stage.id].sort((a, b) => (a.orderInStage || 0) - (b.orderInStage || 0));
      }
    });
    setPipelineJobs(jobsByStage);
  }, [allJobs, settings.pipelineStages]);

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const startStageId = source.droppableId;
    const finishStageId = destination.droppableId;
    const jobId = draggableId;

    const newPipelineJobs = { ...pipelineJobs };
    const startJobs = Array.isArray(newPipelineJobs[startStageId]) ? [...newPipelineJobs[startStageId]] : [];
    const finishJobs = startStageId === finishStageId ? startJobs : (Array.isArray(newPipelineJobs[finishStageId]) ? [...newPipelineJobs[finishStageId]] : []);
    
    const jobIndexInStart = startJobs.findIndex(job => job.id === jobId);
    if (jobIndexInStart === -1) return; 

    const [movedJob] = startJobs.splice(jobIndexInStart, 1);

    if (startStageId === finishStageId) {
      startJobs.splice(destination.index, 0, movedJob);
      newPipelineJobs[startStageId] = startJobs;
      updateJobOrderInStage(jobId, startStageId, startJobs.map((job, index) => ({ id: job.id, order: index })));
      toast({
        title: "Job Reordered",
        description: `Job "${movedJob.title}" reordered within ${settings.pipelineStages.find(s => s.id === startStageId)?.name}.`
      });
    } else {
      finishJobs.splice(destination.index, 0, movedJob);
      newPipelineJobs[startStageId] = startJobs;
      newPipelineJobs[finishStageId] = finishJobs;
      
      const finishStage = settings.pipelineStages.find(s => s.id === finishStageId);
      if (finishStage) {
        updateJobStatus(jobId, finishStage.name);
        updateJobOrderInStage(jobId, finishStageId, finishJobs.map((job, index) => ({ id: job.id, order: index })));
        toast({
          title: "Job Status Updated",
          description: `Job "${movedJob.title}" moved to ${finishStage.name}.`
        });
      }
    }
    setPipelineJobs(newPipelineJobs);
  };

  const calculatePotentialEarnings = (job) => {
    if (!job.estimatedProfit || !job.profitSharePercentage) return 0;
    return (parseFloat(job.estimatedProfit) * parseFloat(job.profitSharePercentage)) / 100;
  };

  const getStageStats = (stageId) => {
    const stageJobs = pipelineJobs[stageId] || [];
    return {
      count: stageJobs.length,
      totalValue: stageJobs.reduce((sum, job) => sum + parseFloat(job.budget || 0), 0)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
             <Workflow className="h-8 w-8 mr-3 text-blue-600"/> Job Pipeline
          </h1>
          <p className="text-gray-600 ml-11">Visualize and manage your job progress by dragging cards between stages.</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-fluid-pipeline gap-5">
          {settings.pipelineStages.map((stage) => {
            const stats = getStageStats(stage.id);
            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col rounded-lg shadow-md bg-gray-50 overflow-hidden ${snapshot.isDraggingOver ? 'bg-blue-100/70' : ''}`}
                  >
                    <CardHeader className="p-4 border-b bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: stage.color }}/>
                          <CardTitle className="text-base font-semibold text-gray-700">{stage.name}</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">{stats.count}</Badge>
                      </div>
                      <CardDescription className="text-xs text-gray-500 mt-1">
                        Total Value: ${stats.totalValue.toFixed(0)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-3 space-y-3 overflow-y-auto min-h-[300px] flex-1 custom-scrollbar">
                      {(pipelineJobs[stage.id] || []).map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(providedDraggable, snapshotDraggable) => (
                            <motion.div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`p-3 bg-white border rounded-md shadow-sm hover:shadow-lg transition-all cursor-grab ${
                                snapshotDraggable.isDragging ? 'ring-2 ring-blue-500 shadow-xl rotate-1 scale-105' : ''
                              }`}
                            >
                              <div {...providedDraggable.dragHandleProps} className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <GripVertical size={16} />
                              </div>
                              <div className="space-y-1.5" onClick={() => setSelectedJob(job)}>
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm text-gray-800 line-clamp-2 pr-6">{job.title}</h4>
                                  <Badge variant={getUrgencyColor(job.urgency)} className="text-xs capitalize whitespace-nowrap">
                                    {job.urgency}
                                  </Badge>
                                </div>
                                
                                <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
                                
                                <div className="space-y-0.5 pt-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <DollarSign className="h-3 w-3 text-green-500" />
                                    Budget: <span className="font-medium text-green-600">${job.budget}</span>
                                    {job.estimatedProfit && (
                                      <span className="text-blue-600 ml-1">
                                        • Est. Profit: ${calculatePotentialEarnings(job).toFixed(0)}
                                      </span>
                                    )}
                                  </div>
                                  {job.location && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <MapPin className="h-3 w-3 text-red-500" />{job.location}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 text-purple-500" />
                                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-1">
                                  <Badge variant="outline" className="text-xs">{job.category}</Badge>
                                  {job.applicants && job.applicants.length > 0 && (
                                    <span className="text-xs text-blue-600 flex items-center gap-1">
                                      <Users size={12}/> {job.applicants.length} Applicant{job.applicants.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {(!pipelineJobs[stage.id] || pipelineJobs[stage.id].length === 0) && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                          Drag jobs here or they'll appear if their status matches this stage.
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-800">{selectedJob.title}</DialogTitle>
              <Badge variant={getUrgencyColor(selectedJob.urgency)} className="w-fit text-xs capitalize">{selectedJob.urgency}</Badge>
            </DialogHeader>
            <div className="mt-2 space-y-3 text-sm">
              <p><strong className="text-gray-600">Description:</strong> {selectedJob.description}</p>
              <p><strong className="text-gray-600">Category:</strong> {selectedJob.category}</p>
              <p><strong className="text-gray-600">Location:</strong> {selectedJob.location || "N/A"}</p>
              <p><strong className="text-gray-600">Budget:</strong> <span className="text-green-600 font-semibold">${selectedJob.budget}</span></p>
              <p><strong className="text-gray-600">Est. Profit for Tech:</strong> <span className="text-blue-600 font-semibold">${calculatePotentialEarnings(selectedJob).toFixed(2)}</span> ({selectedJob.profitSharePercentage}%)</p>
              <p><strong className="text-gray-600">Advertiser:</strong> {selectedJob.advertiserName || "N/A"}</p>
              <p><strong className="text-gray-600">Posted:</strong> {new Date(selectedJob.createdAt).toLocaleString()}</p>
              <div>
                <strong className="text-gray-600">Requirements:</strong>
                {selectedJob.requirements && selectedJob.requirements.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedJob.requirements.map(req => <Badge key={req} variant="secondary">{req}</Badge>)}
                  </div>
                ) : " None"}
                {selectedJob.additionalRequirements && <p className="mt-1 text-xs italic">{selectedJob.additionalRequirements}</p>}
              </div>
              {selectedJob.applicants && selectedJob.applicants.length > 0 && (
                <div>
                  <strong className="text-gray-600">Applicants ({selectedJob.applicants.length}):</strong>
                  <ul className="list-disc list-inside ml-1 mt-1">
                    {selectedJob.applicants.map(app => <li key={app.id}>{app.name}</li>)}
                  </ul>
                </div>
              )}
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => { toast({title: "Navigate", description: "Full job page view coming soon!"})}}>
                View Full Job Details <ExternalLink size={14} className="ml-2"/>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PipelinePage;