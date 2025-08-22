import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit, ChevronDown, ListChecks } from 'lucide-react';
import JobProgressBar from './JobProgressBar.jsx';
import JobChecklistDisplay from './JobChecklistDisplay.jsx';
import JobActivityLog from './JobActivityLog.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useJobs } from '../../hooks/useJobs.jsx';
import { toast } from '../ui/use-toast';

const JOB_STAGES_ADVERTISER = ['open', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];
const JOB_STAGES_TECHNICIAN = ['open', 'applied', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];

const JobViewDialog = ({ job, isOpen, onClose, userType, onOpenEditDialog }) => {
  const { updateJobStatus } = useJobs();

  if (!job) return null;

  const handleStatusChange = (newStatus) => {
    updateJobStatus(job.id, newStatus);
    toast({
      title: "Status Updated",
      description: `Job "${job.title}" status changed to ${newStatus}.`,
    });
  };
  
  const availableStages = userType === 'advertiser' ? JOB_STAGES_ADVERTISER : JOB_STAGES_TECHNICIAN;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          {job.jobNumber && <p className="text-sm text-muted-foreground">{job.jobNumber}</p>}
        </DialogHeader>
        <div className="space-y-4 mt-2 max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex justify-end gap-2 items-center">
            {userType === 'advertiser' && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableStages.map((stage) => (
                      <DropdownMenuItem key={stage} onClick={() => handleStatusChange(stage)} disabled={job.status === stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={() => { onClose(); onOpenEditDialog(job); }}>
                  <Edit className="h-4 w-4 mr-1" />Edit Job
                </Button>
              </>
            )}
             {userType === 'technician' && (job.status === 'assigned' || job.status === 'in progress') && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {['assigned', 'in progress', 'completed'].map((stage) => (
                      <DropdownMenuItem key={stage} onClick={() => handleStatusChange(stage)} disabled={job.status === stage}>
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
            )}
          </div>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Job Progress</h4>
              <JobProgressBar status={job.status} userType={userType} />
            </CardContent>
          </Card>

          {job.checklistId && (
            <JobChecklistDisplay 
              jobId={job.id}
              checklistId={job.checklistId}
              initialProgress={job.checklistProgress}
              userType={userType}
            />
          )}

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Job Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardContent className="p-4"><h4 className="font-semibold mb-1 text-gray-700">Customer Budget</h4><p className="text-lg font-semibold text-green-600">${job.budget}</p></CardContent></Card>
            <Card><CardContent className="p-4"><h4 className="font-semibold mb-1 text-gray-700">Category</h4><p className="text-gray-600">{job.category}</p></CardContent></Card>
            <Card><CardContent className="p-4"><h4 className="font-semibold mb-1 text-gray-700">Urgency</h4><p className="text-gray-600 capitalize">{job.urgency}</p></CardContent></Card>
             {job.customerName && <Card><CardContent className="p-4"><h4 className="font-semibold mb-1 text-gray-700">Customer</h4><p className="text-gray-600">{job.customerName}</p></CardContent></Card>}
             {job.location && <Card><CardContent className="p-4"><h4 className="font-semibold mb-1 text-gray-700">Location</h4><p className="text-gray-600">{job.location}</p></CardContent></Card>}
          </div>
          
          {(job.requirements && job.requirements.length > 0) || job.additionalRequirements ? (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-gray-700">Requirements</h4>
                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.requirements.map(tag => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                )}
                {job.additionalRequirements && <p className="text-gray-600 whitespace-pre-wrap">{job.additionalRequirements}</p>}
              </CardContent>
            </Card>
          ) : null}

          {job.estimatedProfit > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-gray-700">Profit Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Estimated Profit</p><p className="text-lg font-bold text-blue-600">${job.estimatedProfit}</p></div>
                  <div><p className="text-sm text-gray-600">Technician's Share</p><p className="text-lg font-bold text-purple-600">{job.profitSharePercentage}%</p></div>
                   {job.status === 'paid' && job.actualProfit > 0 && (
                    <>
                      <div><p className="text-sm text-gray-600">Actual Profit</p><p className="text-lg font-bold text-green-700">${job.actualProfit}</p></div>
                      <div><p className="text-sm text-gray-600">Technician Earnings</p><p className="text-lg font-bold text-green-700">${job.technicianEarnings?.toFixed(2)}</p></div>
                      <div><p className="text-sm text-gray-600">Advertiser Earnings</p><p className="text-lg font-bold text-green-700">${job.advertiserEarnings?.toFixed(2)}</p></div>
                    </>
                   )}
                </div>
              </CardContent>
            </Card>
          )}

          {userType === 'advertiser' && job.activityLog && (
            <JobActivityLog activityLog={job.activityLog} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobViewDialog;