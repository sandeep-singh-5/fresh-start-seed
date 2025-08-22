import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.jsx';
import { useToast } from './use-toast';
import { useCustomers } from './useCustomers';

const sampleJobs = [
    {
      "id": "job_1",
      "title": "Leaky Faucet Repair",
      "description": "Kitchen sink faucet is dripping continuously. Needs washer replacement or potential faucet replacement if corroded.",
      "category": "Plumbing",
      "location": "Springfield, IL",
      "budget": 150,
      "postedDate": "2025-08-10T08:00:00.000Z",
      "status": "open",
      "isPublished": true,
      "advertiserId": "adv_1",
      "advertiserName": "Alice Johnson",
      "advertiserUsername": "alicej",
      "applicants": [],
      "assignedTechnicianId": null,
      "tags": [{ id: "tag_urgent", name: "Urgent", color: "#ef4444" }],
      "paymentType": "profitShare",
      "profitSharePercentage": 50,
      "estimatedProfit": 70,
      "bonuses": [
        { "id": "bonus_1_1", "description": "For 5-star customer review", "amount": 25 },
        { "id": "bonus_1_2", "description": "For completing job 1 day early", "amount": 50 }
      ]
    },
    {
      "id": "job_2",
      "title": "Install Ceiling Fan",
      "description": "Need a licensed electrician to install a new ceiling fan in the master bedroom. Wiring is already in place from a previous light fixture.",
      "category": "Electrical",
      "location": "Shelbyville, TN",
      "budget": 250,
      "postedDate": "2025-08-09T11:30:00.000Z",
      "status": "open",
      "isPublished": true,
      "advertiserId": "adv_1",
      "advertiserName": "Alice Johnson",
      "advertiserUsername": "alicej",
      "applicants": [],
      "assignedTechnicianId": null,
      "tags": [{ id: "tag_electrical", name: "Electrical", color: "#f97316" }],
      "paymentType": "flatRate",
      "flatRate": 200,
      "bonuses": []
    },
    {
      "id": "job_3",
      "title": "Lawn Mowing and Garden Weeding",
      "description": "Weekly lawn mowing for a medium-sized yard and weeding of front garden beds. Approximately 2-3 hours of work.",
      "category": "Landscaping",
      "location": "Ogdenville, SC",
      "budget": 75,
      "postedDate": "2025-08-08T14:00:00.000Z",
      "status": "assigned",
      "isPublished": false,
      "advertiserId": "adv_2",
      "advertiserName": "Bob Smith",
      "advertiserUsername": "bobsmith",
      "applicants": [],
      "assignedTechnicianId": "tech_1",
      "assignedTechnicianName": "Charlie Brown",
      "tags": [{ id: "tag_landscaping", name: "Landscaping", color: "#22c55e" }],
      "paymentType": "profitShare",
      "profitSharePercentage": 60,
      "estimatedProfit": 40,
      "bonuses": [
        { "id": "bonus_3_1", "description": "For positive mention on social media", "amount": 15 }
      ]
    }
];

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const { toast } = useToast();
  const { incrementCustomerJobStats } = useCustomers();

  useEffect(() => {
    let savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      savedJobs = JSON.parse(savedJobs);
    } else {
      savedJobs = sampleJobs;
    }
    setAllJobs(savedJobs);

    if (user) {
      if (user.userType === 'advertiser') {
        const userJobs = savedJobs.filter(job => job.advertiserId === user.id);
        setJobs(userJobs);
      } else if (user.userType === 'technician') {
        const assignedJobs = savedJobs.filter(job => job.assignedTechnicianId === user.id);
        setJobs(assignedJobs);
      }
    }
  }, [user]);

  const saveJobs = (updatedJobs) => {
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setAllJobs(updatedJobs);
    if (user) {
      if (user.userType === 'advertiser') {
        setJobs(updatedJobs.filter(job => job.advertiserId === user.id));
      } else if (user.userType === 'technician') {
        setJobs(updatedJobs.filter(job => job.assignedTechnicianId === user.id));
      }
    }
  };

  const addJob = (jobData) => {
    if (!user || user.userType !== 'advertiser') {
      toast({ title: 'Error', description: 'Only advertisers can post jobs.', variant: 'destructive' });
      return;
    }

    const newJob = {
      ...jobData,
      id: `job_${Date.now()}`,
      advertiserId: user.id,
      advertiserName: user.name,
      advertiserUsername: user.username,
      status: 'open',
      isPublished: jobData.isPublished || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicants: [],
      assignedTechnicianId: null,
      tags: jobData.tags || [],
      bonuses: jobData.bonuses || []
    };

    const updatedJobs = [newJob, ...allJobs];
    saveJobs(updatedJobs);
    
    let earnings = 0;
    if(jobData.paymentType === 'profitShare') {
        earnings = jobData.estimatedProfit || 0;
    }

    if (jobData.customerId && earnings > 0) {
      incrementCustomerJobStats(jobData.customerId, earnings);
    }
    toast({ title: 'Job Created!', description: 'Your new job has been saved.' });
  };
  
  const updateJob = (jobId, updatedData) => {
    const updatedJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, ...updatedData, updatedAt: new Date().toISOString() };
      }
      return job;
    });
    saveJobs(updatedJobs);
    toast({ title: "Success", description: "Job updated successfully." });
  };
  
  const deleteJob = (jobId) => {
    const updatedJobs = allJobs.filter(job => job.id !== jobId);
    saveJobs(updatedJobs);
    toast({ title: "Success", description: "Job deleted successfully." });
  };

  const applyToJob = (jobId) => {
    if (!user || user.userType !== 'technician') {
        toast({ title: "Error", description: "Only technicians can apply for jobs.", variant: "destructive" });
        return;
    }
    const updatedJobs = allJobs.map(job => {
        if (job.id === jobId) {
            const applicantExists = job.applicants?.some(app => app.technicianId === user.id);
            if (!applicantExists) {
                const newApplicant = {
                    technicianId: user.id,
                    technicianName: user.name,
                    appliedAt: new Date().toISOString()
                };
                const updatedApplicants = job.applicants ? [...job.applicants, newApplicant] : [newApplicant];
                return { ...job, applicants: updatedApplicants };
            }
        }
        return job;
    });
    saveJobs(updatedJobs);
  };
  
  const assignTechnician = (jobId, technicianId, technicianName) => {
     const updatedJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { 
          ...job, 
          assignedTechnicianId: technicianId, 
          assignedTechnicianName: technicianName,
          status: 'assigned',
          isPublished: false,
          updatedAt: new Date().toISOString(),
        };
      }
      return job;
    });
    saveJobs(updatedJobs);
    toast({ title: "Success", description: `Technician ${technicianName} assigned.` });
  };

  const updateJobStatus = (jobId, newStatus) => {
    const updatedJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return job;
    });
    saveJobs(updatedJobs);
    toast({ title: "Success", description: `Job status updated to ${newStatus}.` });
  };

  const togglePublishStatus = (jobId, currentStatus) => {
    const updatedJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, isPublished: !currentStatus, updatedAt: new Date().toISOString() };
      }
      return job;
    });
    saveJobs(updatedJobs);
    toast({ title: "Success", description: `Job has been ${!currentStatus ? 'published to' : 'removed from'} the marketplace.` });
  };

  const value = {
    jobs,
    allJobs,
    addJob,
    updateJob,
    deleteJob,
    applyToJob,
    assignTechnician,
    updateJobStatus,
    togglePublishStatus,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};