import React from 'react';

const JOB_STAGES_ADVERTISER = ['open', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];
const JOB_STAGES_TECHNICIAN = ['open', 'applied', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];

const JobProgressBar = ({ status, userType }) => {
  const stages = userType === 'advertiser' ? JOB_STAGES_ADVERTISER : JOB_STAGES_TECHNICIAN;
  
  let currentStageIndex = stages.indexOf(status?.toLowerCase());
  if (currentStageIndex === -1 && status?.toLowerCase() === 'pending confirmation') {
    currentStageIndex = stages.indexOf('completed'); 
  } else if (currentStageIndex === -1) {
    currentStageIndex = 0; 
  }

  const progressPercentage = ((currentStageIndex + 1) / stages.length) * 100;

  let progressBarColor = 'bg-gray-400';
  if (status === 'disputed') {
    progressBarColor = 'bg-red-500';
  } else if (status === 'paid' || (status === 'completed' && progressPercentage >= 80)) {
    progressBarColor = 'bg-green-500';
  } else if (progressPercentage > 60) {
    progressBarColor = 'bg-blue-500';
  } else if (progressPercentage > 30) {
    progressBarColor = 'bg-yellow-500';
  } else {
    progressBarColor = 'bg-orange-500';
  }


  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-700 capitalize">
          {status === 'pending confirmation' ? 'Pending Confirmation' : status || 'Unknown'}
        </span>
        <span className="text-xs font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default JobProgressBar;