import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Users, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const MarketplaceListItem = ({ job, onSelectJob, onApplyToJob, user, calculatePotentialEarnings }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'assigned': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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
            <Badge variant={getUrgencyColor(job.urgency)}>{job.urgency}</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{job.category}</Badge>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
            <span className="text-sm text-gray-600 capitalize">{job.status}</span>
            <Badge className="bg-purple-100 text-purple-700">{job.profitSharePercentage}% share</Badge>
          </div>
          <p className="text-gray-600 mb-2 line-clamp-2">{job.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="h-4 w-4" />
              Budget: ${job.budget}
            </span>
            {job.estimatedProfit && (
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                Potential: ${calculatePotentialEarnings(job).toFixed(2)}
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
            {job.applicants && job.applicants.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <Users className="h-4 w-4" />
                {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3 sm:mt-0 self-start sm:self-center">
          <Button variant="outline" size="sm" onClick={() => onSelectJob(job)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {user.userType === 'technician' && job.status === 'open' && !hasApplied() && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              onClick={() => onApplyToJob(job.id)}
            >
              Apply
            </Button>
          )}

          {user.userType === 'technician' && hasApplied() && (
            <Button size="sm" disabled variant="outline">
              Applied
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplaceListItem;