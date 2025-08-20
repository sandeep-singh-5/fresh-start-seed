import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import PostJobForm from '@/components/advertiser/PostJobForm';
import EditJobForm from '@/components/jobs/EditJobForm'; 
import { toast } from '@/components/ui/use-toast';
import JobFilters from '@/components/jobs/JobFilters';
import JobStatsCards from '@/components/jobs/JobStatsCards';
import JobList from '@/components/jobs/JobList';
import JobViewDialog from '@/components/jobs/JobViewDialog';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedJobForView, setSelectedJobForView] = useState(null);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [showPostJobDialog, setShowPostJobDialog] = useState(false);
  const [showEditJobDialog, setShowEditJobDialog] = useState(false);

  const { jobs, allJobs, deleteJob } = useJobs();
  const { user } = useAuth();

  const categories = [
    'All Categories', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 
    'Cleaning', 'Landscaping', 'Appliance Repair', 'Garage Doors', 'Handyman', 'Roofing', 
    'Pest Control', 'Moving', 'Other'
  ];

  const statuses = ['All Statuses', 'open', 'assigned', 'in progress', 'completed', 'paid', 'disputed'];

  const displayJobs = user.userType === 'advertiser' ? jobs : allJobs;

  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.customerName && job.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (job.jobNumber && job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || statusFilter === 'All Statuses' || job.status === statusFilter;
    const matchesCategory = !categoryFilter || categoryFilter === 'All Categories' || job.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleOpenEditDialog = (job) => {
    setSelectedJobForEdit(job);
    setShowEditJobDialog(true);
    if(selectedJobForView && selectedJobForView.id === job.id) setSelectedJobForView(null); 
  };
  
  const handleDeleteJob = (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete the job: "${jobTitle}"? This action cannot be undone.`)) {
      try {
        deleteJob(jobId);
        toast({ title: "Job Deleted", description: `Job "${jobTitle}" has been successfully deleted.` });
        if (selectedJobForView && selectedJobForView.id === jobId) setSelectedJobForView(null);
        if (selectedJobForEdit && selectedJobForEdit.id === jobId) setShowEditJobDialog(false);
      } catch (error) {
        toast({ title: "Error", description: `Failed to delete job: ${error.message}`, variant: "destructive" });
      }
    }
  };

  const stats = {
    totalJobs: displayJobs.length,
    openJobs: displayJobs.filter(job => job.status === 'open').length,
    assignedJobs: displayJobs.filter(job => job.status === 'assigned').length,
    completedJobs: displayJobs.filter(job => job.status === 'completed' || job.status === 'paid').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">
            {user.userType === 'advertiser' 
              ? 'Manage your posted jobs and leads' 
              : 'Browse and track all available jobs'}
          </p>
        </div>
        {user.userType === 'advertiser' && (
          <Button onClick={() => setShowPostJobDialog(true)} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white self-start sm:self-center">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        )}
      </div>

      <JobStatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>
            {user.userType === 'advertiser' 
              ? 'View and manage your posted jobs' 
              : 'Browse all available jobs in the marketplace'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobFilters 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            categories={categories} statuses={statuses}
          />
          <JobList 
            jobs={filteredJobs} 
            userType={user.userType}
            onSelectJobForView={setSelectedJobForView}
            onOpenEditDialog={handleOpenEditDialog}
            onDeleteJob={handleDeleteJob}
          />
        </CardContent>
      </Card>

      <JobViewDialog 
        job={selectedJobForView}
        isOpen={!!selectedJobForView}
        onClose={() => setSelectedJobForView(null)}
        userType={user.userType}
        onOpenEditDialog={handleOpenEditDialog}
      />

      {user.userType === 'advertiser' && (
        <>
          <Dialog open={showPostJobDialog} onOpenChange={setShowPostJobDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
               <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl">Post New Job</DialogTitle>
              </DialogHeader>
              <div className="p-6 pt-2">
                <PostJobForm onJobPosted={() => setShowPostJobDialog(false)} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showEditJobDialog} onOpenChange={setShowEditJobDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl">Edit Job</DialogTitle>
              </DialogHeader>
              <div className="p-6 pt-2">
                <EditJobForm 
                  jobData={selectedJobForEdit} 
                  onJobUpdated={() => {
                    setShowEditJobDialog(false);
                    setSelectedJobForEdit(null);
                  }} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default JobsPage;