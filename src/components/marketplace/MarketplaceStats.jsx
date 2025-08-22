import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, Clock, DollarSign, Award, Users } from 'lucide-react';

const MarketplaceStats = ({ stats }) => {
  const statItems = [
    { label: 'Total Leads', value: stats.totalLeads, icon: TrendingUp, color: 'blue', delay: 0.1 },
    { label: 'Open Leads', value: stats.openLeads, icon: Clock, color: 'green', delay: 0.2 },
    { label: 'Avg Budget', value: `$${stats.avgBudget}`, icon: DollarSign, color: 'yellow', delay: 0.3 },
    { label: 'Avg Share', value: `${stats.avgProfitShare}%`, icon: Award, color: 'purple', delay: 0.4 },
    { label: 'Total Value', value: `$${stats.totalPotentialEarnings.toFixed(0)}`, icon: TrendingUp, color: 'orange', delay: 0.5 },
    { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'indigo', delay: 0.6 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {statItems.map((item) => (
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

export default MarketplaceStats;