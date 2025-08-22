import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { FileText, User, Edit3, CheckCircle, AlertTriangle, Flag, PlusCircle, Trash2, Users, DollarSign, ListChecks } from 'lucide-react';
import { Badge } from '../ui/badge';

const JobActivityLog = ({ activityLog }) => {
  if (!activityLog || activityLog.length === 0) {
    return (
      <Card className="mt-4 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-700">
            <FileText className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">No activity recorded for this job yet.</p>
        </CardContent>
      </Card>
    );
  }

  const getIconForAction = (action) => {
    if (action.includes('Created')) return <PlusCircle className="h-4 w-4 text-green-500" />;
    if (action.includes('Updated') || action.includes('Changed')) return <Edit3 className="h-4 w-4 text-blue-500" />;
    if (action.includes('Assigned')) return <User className="h-4 w-4 text-purple-500" />;
    if (action.includes('Applied')) return <Users className="h-4 w-4 text-indigo-500" />;
    if (action.includes('Completed')) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (action.includes('Status Changed')) return <Flag className="h-4 w-4 text-yellow-500" />;
    if (action.includes('Disputed')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (action.includes('Deleted')) return <Trash2 className="h-4 w-4 text-red-600" />;
    if (action.includes('Profit Confirmed') || action.includes('Paid')) return <DollarSign className="h-4 w-4 text-teal-500" />;
    if (action.includes('Checklist')) return <ListChecks className="h-4 w-4 text-cyan-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="mt-6 shadow-md border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
          <FileText className="h-6 w-6 text-gray-700" />
          Job Activity Log
        </CardTitle>
        <CardDescription>A chronological record of all changes and updates to this job.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-4">
            {activityLog.map((logEntry) => (
              <motion.div
                key={logEntry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-3 p-3 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 pt-1">
                  {getIconForAction(logEntry.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">{logEntry.action}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(logEntry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">By: <Badge variant="secondary" className="text-xs">{logEntry.user}</Badge></p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{logEntry.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default JobActivityLog;