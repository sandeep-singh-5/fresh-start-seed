import { useState, useEffect } from 'react';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
    setLoading(false);
  }, []);

  const saveJobs = (newJobs) => {
    setJobs(newJobs);
    localStorage.setItem('jobs', JSON.stringify(newJobs));
  };

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      applicants: []
    };
    const updatedJobs = [...jobs, newJob];
    saveJobs(updatedJobs);
  };

  const updateJob = (jobId, updates) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    );
    saveJobs(updatedJobs);
  };

  const applyToJob = (jobId, technicianId) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const applicants = job.applicants || [];
        if (!applicants.includes(technicianId)) {
          return { ...job, applicants: [...applicants, technicianId] };
        }
      }
      return job;
    });
    saveJobs(updatedJobs);
  };

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    applyToJob
  };
};