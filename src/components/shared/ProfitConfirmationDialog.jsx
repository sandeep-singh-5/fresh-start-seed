import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const ProfitConfirmationDialog = ({ isOpen, onClose, job, onConfirm }) => {
  const [actualProfit, setActualProfit] = useState(job?.estimatedProfit || '');
  const [notes, setNotes] = useState('');

  if (!job) return null;

  const calculateShares = () => {
    const profit = parseFloat(actualProfit) || 0;
    const technicianShare = (profit * job.profitSharePercentage) / 100;
    const advertiserShare = profit - technicianShare;
    return { technicianShare, advertiserShare };
  };

  const { technicianShare, advertiserShare } = calculateShares();

  const handleConfirm = () => {
    if (!actualProfit || parseFloat(actualProfit) < 0) {
      return;
    }
    onConfirm(job.id, actualProfit, notes);
    setActualProfit('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Actual Profit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Job: {job.title}</h4>
            <p className="text-sm text-gray-600">Customer Budget: ${job.budget}</p>
            <p className="text-sm text-gray-600">Estimated Profit: ${job.estimatedProfit}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualProfit">Actual Profit Achieved *</Label>
            <Input
              id="actualProfit"
              type="number"
              value={actualProfit}
              onChange={(e) => setActualProfit(e.target.value)}
              placeholder="Enter actual profit"
              min="0"
              step="0.01"
            />
          </div>

          {actualProfit && (
            <Card className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Profit Distribution</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Technician ({job.profitSharePercentage}%)</p>
                    <p className="text-lg font-bold text-green-600">${technicianShare.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">You ({100 - job.profitSharePercentage}%)</p>
                    <p className="text-lg font-bold text-blue-600">${advertiserShare.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the job completion..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              disabled={!actualProfit || parseFloat(actualProfit) < 0}
            >
              Confirm Profit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfitConfirmationDialog;