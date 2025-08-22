import React from 'react';
import MarketplaceListItem from './MarketplaceListItem';

const MarketplaceList = ({ jobs, onSelectJob, onApplyToJob, user, calculatePotentialEarnings }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No leads found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <MarketplaceListItem
          key={job.id}
          job={job}
          onSelectJob={onSelectJob}
          onApplyToJob={onApplyToJob}
          user={user}
          calculatePotentialEarnings={calculatePotentialEarnings}
        />
      ))}
    </div>
  );
};

export default MarketplaceList;