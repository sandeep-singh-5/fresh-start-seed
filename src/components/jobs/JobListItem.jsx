import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Hash, ChevronDown, Trash2, Store, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import JobProgressBar from '@/components/jobs/JobProgressBar.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useJobs } from '@/hooks/useJobs.jsx';
import { toast } from '@/components/ui/use-toast';

const JOB_STAGES_ADVERTISER = ['open', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];
const JOB_STAGES_TECHNICIAN = ['open', 'applied', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];


const JobListItem = ({ job, userType, onSelectJobForView, onDeleteJob }) => {
  const { updateJobStatus, togglePublishStatus } = useJobs();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleStatusChange = (newStatus) => {
    updateJobStatus(job.id, newStatus);
    toast({
      title: "Status Updated",
      description: `Job "${job.title}" status changed to ${newStatus}.`,
    });
  };
  
  const handleTogglePublish = () => {
    togglePublishStatus(job.id, job.isPublished);
  };

  const availableStages = userType === 'advertiser' ? JOB_STAGES_ADVERTISER : JOB_STAGES_TECHNICIAN;

  const handleItemClick = (e) => {
    if (e.target.closest('.delete-button-wrapper') || e.target.closest('.actions-dropdown-wrapper')) {
      return;
    }
    onSelectJobForView(job);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex-1 mb-3 sm:mb-0 pr-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
            {job.isPublished ? (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <Store size={12} className="mr-1"/> Published
                </Badge>
            ) : (
                 <Badge variant="secondary" className="text-xs">
                    <EyeOff size={12} className="mr-1"/> Not Published
                </Badge>
            )}
            {job.jobNumber && <Badge variant="secondary" className="text-xs"><Hash size={12} className="mr-1"/>{job.jobNumber}</Badge>}
            <Badge variant={getUrgencyColor(job.urgency)} className="text-xs">{job.urgency}</Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{job.category}</Badge>
            {job.profitSharePercentage && (
              <Badge className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                {job.profitSharePercentage}% share
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
            {job.customerName && <span className="flex items-center gap-1">Customer: <strong>{job.customerName}</strong></span>}
            {job.budget && <span className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="h-3 w-3" /> Budget: ${job.budget}
            </span>}
            {job.estimatedProfit > 0 && (
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                Est. Profit: ${job.estimatedProfit}
              </span>
            )}
            {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
            <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
            {userType === 'technician' && <span>By: {job.advertiserUsername}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {(job.tags || []).map(tag => (
              <Badge key={tag.id} variant="outline" style={{ color: tag.color, borderColor: tag.color, backgroundColor: 'white' }}>
                {tag.name}
              </Badge>
            ))}
            {(job.requirements || []).map(req => (
              <Badge key={req.id} variant="outline" style={{ color: req.color, borderColor: req.color, backgroundColor: 'white' }}>
                {req.name}
              </Badge>
            ))}
          </div>
          <div className="mt-3">
             <JobProgressBar status={job.status} userType={userType} />
          </div>
        </div>
        
        <div className="flex gap-2 self-start sm:self-center mt-3 sm:mt-0 shrink-0">
          {userType === 'advertiser' && (
             <div className="actions-dropdown-wrapper">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    Actions
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleTogglePublish();}}>
                    {job.isPublished ? <EyeOff className="mr-2 h-4 w-4"/> : <Store className="mr-2 h-4 w-4"/>}
                    {job.isPublished ? 'Unpublish' : 'Publish'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {availableStages.map((stage) => (
                    <DropdownMenuItem key={stage} onClick={(e) => {e.stopPropagation(); handleStatusChange(stage);}} disabled={job.status === stage}>
                      Set as {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id, job.title);}}>
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobListItem;