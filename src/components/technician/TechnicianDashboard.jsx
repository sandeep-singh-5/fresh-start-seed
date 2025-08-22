import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, DollarSign, CheckCircle, Award, TrendingUp, Users, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useJobs } from '../../hooks/useJobs.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import JobCard from '../shared/JobCard.jsx';

const TechnicianDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { jobs, allJobs } = useJobs();
  const { user } = useAuth();

  const categories = [
    'All Categories',
    'Plumbing',
    'Electrical',
    'HVAC',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Landscaping',
    'Appliance Repair',
    'Handyman',
    'Other'
  ];

  const hasApplied = (job) => {
    return job.applicants?.some(app => app.technicianId === user.id);
  };

  const isAssigned = (job) => {
    return job.assignedTechnician?.technicianId === user.id;
  };

  const availableJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === 'All Categories' || job.category === categoryFilter;
    const isOpen = job.status === 'open';
    const notApplied = !hasApplied(job);
    
    return matchesSearch && matchesCategory && isOpen && notApplied;
  });

  const myJobs = jobs.filter(job => hasApplied(job) || isAssigned(job));

  const stats = {
    availableLeads: availableJobs.length,
    appliedLeads: myJobs.filter(job => hasApplied(job) && job.status === 'open').length,
    activeJobs: myJobs.filter(job => isAssigned(job) && job.status === 'assigned').length,
    completedJobs: myJobs.filter(job => job.status === 'completed' && isAssigned(job)).length,
    totalEarnings: myJobs.filter(job => job.isProfitConfirmed && isAssigned(job)).reduce((sum, job) => sum + (job.technicianEarnings || 0), 0),
    avgRating: user?.overallRating || 0,
    closingRate: user?.stats?.jobClosingRate || 0,
    memberSince: user?.memberSince ? new Date(user.memberSince).getFullYear() : new Date().getFullYear()
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Wrench className="h-8 w-8 mr-3 text-blue-600" />
          Service Pro Dashboard
        </h1>
        <p className="text-gray-600 ml-11">Find profitable leads and grow your business, {user?.username || 'User'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applied</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.appliedLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Closing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.closingRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Since</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {availableJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No available leads found</p>
              </div>
            ) : (
              availableJobs.slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} userType="technician" />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {myJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No jobs yet. Start applying to available leads!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} userType="technician" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;