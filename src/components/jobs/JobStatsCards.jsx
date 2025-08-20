import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Star, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const JobStatsCards = ({ stats }) => {
  const cardData = [
    { label: 'Total Jobs', value: stats.totalJobs, icon: Eye, color: 'blue', delay: 0.1 },
    { label: 'Open', value: stats.openJobs, icon: Clock, color: 'green', delay: 0.2 },
    { label: 'Assigned', value: stats.assignedJobs, icon: Star, color: 'yellow', delay: 0.3 },
    { label: 'Completed/Paid', value: stats.completedJobs, icon: DollarSign, color: 'purple', delay: 0.4 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((item) => (
        <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: item.delay }}>
          <Card className={`border-${item.color}-500 border-l-4 shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                  <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default JobStatsCards;