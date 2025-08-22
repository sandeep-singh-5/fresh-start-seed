import React from 'react';
import { Search } from 'lucide-react';
import JobListItem from './JobListItem';

const JobList = ({ jobs, userType, onSelectJobForView, onOpenEditDialog, onDeleteJob }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-2"/>
        No jobs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListItem 
          key={job.id} 
          job={job} 
          userType={userType}
          onSelectJobForView={onSelectJobForView}
          onOpenEditDialog={onOpenEditDialog}
          onDeleteJob={onDeleteJob}
        />
      ))}
    </div>
  );
};

export default JobList;