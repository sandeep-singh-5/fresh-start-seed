import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import MarketplaceStats from './MarketplaceStats';
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceList from './MarketplaceList';
import LeadViewDialog from './LeadViewDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../hooks/use-toast';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedJob, setSelectedJob] = useState(null);
  const { allJobs, applyToJob } = useJobs();
  const { user } = useAuth();

  const categories = [
    'All Categories', 'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting',
    'Cleaning', 'Landscaping', 'Appliance Repair', 'Handyman', 'Other'
  ];

  const handleApplyToJob = (jobId) => {
    if (user.userType !== 'technician') {
      toast({
        title: "Access Denied",
        description: "Only Service Pros can apply to leads.",
        variant: "destructive"
      });
      return;
    }
    applyToJob(jobId);
    toast({
      title: "Application Sent!",
      description: "Your application has been sent to the advertiser."
    });
  };

  const calculatePotentialEarnings = (job) => {
    if (job.paymentType === 'flatRate') {
      return parseFloat(job.flatRate) || 0;
    }
    if (job.paymentType === 'profitShare' && job.estimatedProfit && job.profitSharePercentage) {
      return (parseFloat(job.estimatedProfit) * parseFloat(job.profitSharePercentage)) / 100;
    }
    return 0;
  };

  const marketplaceJobs = allJobs.filter(job => job.status === 'open' && job.isPublished);

  const filteredJobs = marketplaceJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'All Categories' || job.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'budget-high':
        return parseFloat(b.budget || 0) - parseFloat(a.budget || 0);
      case 'budget-low':
        return parseFloat(a.budget || 0) - parseFloat(b.budget || 0);
      case 'profit-high':
        return calculatePotentialEarnings(b) - calculatePotentialEarnings(a);
      case 'urgent':
        const urgencyOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
      default:
        return 0;
    }
  });

  const stats = {
    totalLeads: marketplaceJobs.length,
    openLeads: marketplaceJobs.length,
    avgBudget: marketplaceJobs.length > 0 ? Math.round(marketplaceJobs.reduce((sum, job) => sum + parseFloat(job.budget || 0), 0) / marketplaceJobs.length) : 0,
    avgProfitShare: marketplaceJobs.length > 0 ? Math.round(marketplaceJobs.reduce((sum, job) => sum + parseFloat(job.profitSharePercentage || 0), 0) / marketplaceJobs.length) : 0,
    totalPotentialEarnings: marketplaceJobs.reduce((sum, job) => sum + calculatePotentialEarnings(job), 0),
    activeUsers: new Set([...allJobs.map(job => job.advertiserId), ...allJobs.flatMap(job => job.applicants?.map(app => app.technicianId) || [])]).size
  };

  return (
    <>
     <Helmet>
      <title>Marketplace</title>
      <meta name="description" content="Browse and manage available services in the marketplace." />
    </Helmet>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Marketplace</h1>
        <p className="text-gray-600">Discover profitable service opportunities with transparent profit sharing</p>
      </div>

      <MarketplaceStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Browse All Leads</CardTitle>
          <CardDescription>Find profitable service opportunities with transparent profit sharing</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketplaceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />
          <MarketplaceList
            jobs={filteredJobs}
            onSelectJob={setSelectedJob}
            onApplyToJob={handleApplyToJob}
            user={user}
            calculatePotentialEarnings={calculatePotentialEarnings}
          />
        </CardContent>
      </Card>

      <LeadViewDialog
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApplyToJob={handleApplyToJob}
        user={user}
        calculatePotentialEarnings={calculatePotentialEarnings}
      />
    </div>
    </>
  );
};

export default Marketplace;