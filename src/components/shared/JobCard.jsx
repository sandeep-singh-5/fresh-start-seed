import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Clock, Star, CheckCircle, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../hooks/use-toast';
import JobProgressBar from '../jobs/JobProgressBar.jsx';

const JobCard = ({ job, userType }) => {
  const { applyToJob, completeJob } = useJobs();
  const { user } = useAuth();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const hasApplied = () => {
    return job.applicants?.some(app => app.technicianId === user.id);
  };

  const isAssigned = () => {
    return job.assignedTechnician?.technicianId === user.id;
  };

  const calculatePotentialEarnings = () => {
    if (!job.estimatedProfit || !job.profitSharePercentage) return 0;
    return (parseFloat(job.estimatedProfit) * parseFloat(job.profitSharePercentage)) / 100;
  };

  const handleApplyToJob = () => {
    applyToJob(job.id);
    toast({
      title: "Application Sent!",
      description: "Your application has been sent to the advertiser."
    });
  };

  const handleCompleteJob = () => {
    completeJob(job.id);
    toast({
      title: "Job Completed!",
      description: "The job has been marked as completed. Awaiting profit confirmation."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-blue-50/30"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex-1 mb-3 sm:mb-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            {job.jobNumber && <Badge variant="secondary" className="text-xs"><Hash size={12} className="mr-1"/>{job.jobNumber}</Badge>}
            <Badge variant={getUrgencyColor(job.urgency)}>
              {job.urgency}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {job.category}
            </Badge>
            {job.profitSharePercentage && (
              <Badge className="bg-purple-100 text-purple-700">
                {job.profitSharePercentage}% share
              </Badge>
            )}
            {isAssigned() && (
              <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                Assigned to you
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mb-2 line-clamp-2">{job.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap mb-3">
            <span className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="h-4 w-4" />
              Budget: ${job.budget}
            </span>
            {job.estimatedProfit && userType === 'technician' && (
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                Potential: ${calculatePotentialEarnings().toFixed(2)}
              </span>
            )}
            {job.estimatedProfit && userType === 'advertiser' && (
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                Est. Profit: ${job.estimatedProfit}
              </span>
            )}
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            )}
            <span>By: {job.advertiserUsername}</span>
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <JobProgressBar status={job.status} userType={userType} />
        </div>
        
        <div className="flex gap-2 mt-3 sm:mt-0 self-start sm:self-center">
          {userType === 'technician' && job.status === 'open' && !hasApplied() && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              onClick={handleApplyToJob}
            >
              Apply
            </Button>
          )}

          {userType === 'technician' && hasApplied() && job.status === 'open' && (
            <Button size="sm" disabled variant="outline">
              Applied
            </Button>
          )}

          {userType === 'technician' && isAssigned() && job.status === 'assigned' && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              onClick={handleCompleteJob}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}

          {job.applicants && job.applicants.length > 0 && userType === 'advertiser' && (
            <span className="text-sm text-blue-600 px-3 py-1 bg-blue-50 rounded">
              {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;