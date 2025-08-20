import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LeadViewDialog = ({ job, isOpen, onClose, onApplyToJob, user, calculatePotentialEarnings }) => {
  if (!job) return null;

  const hasApplied = () => {
    return job.applicants?.some(app => app.technicianId === user.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Lead Description</h4>
            <p className="text-gray-600">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Customer Budget</h4>
              <p className="text-lg font-semibold text-green-600">${job.budget}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Estimated Profit</h4>
              <p className="text-lg font-semibold text-blue-600">${job.estimatedProfit}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Your Share</h4>
              <p className="text-lg font-semibold text-purple-600">{job.profitSharePercentage}%</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Your Potential Earnings</h4>
              <p className="text-lg font-semibold text-orange-600">${calculatePotentialEarnings(job).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Category</h4>
              <p className="text-gray-600">{job.category}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Urgency</h4>
              <p className="text-gray-600 capitalize">{job.urgency}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Status</h4>
              <p className="text-gray-600 capitalize">{job.status}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Posted By</h4>
              <p className="text-gray-600">{job.advertiserName}</p>
            </div>
          </div>

          {job.location && (
            <div>
              <h4 className="font-semibold mb-1">Location</h4>
              <p className="text-gray-600">{job.location}</p>
            </div>
          )}
          
          {job.requirements && (
            <div>
              <h4 className="font-semibold mb-2">Requirements</h4>
              <p className="text-gray-600">{job.requirements}</p>
            </div>
          )}
          
          {user.userType === 'technician' && job.status === 'open' && !hasApplied() && (
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600" 
              onClick={() => {
                onApplyToJob(job.id);
                onClose();
              }}
            >
              Apply for This Lead
            </Button>
          )}

          {user.userType === 'technician' && hasApplied() && (
            <Button disabled className="w-full">
              Already Applied
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadViewDialog;