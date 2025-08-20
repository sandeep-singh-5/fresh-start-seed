import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Percent, HeartHandshake as Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobPricingForm = ({ formData, onInputChange, paymentType, setPaymentType }) => {
  const profit = parseFloat(formData.estimatedProfit) || 0;
  const percentage = parseFloat(formData.profitSharePercentage) || 0;
  
  const technicianShare = (profit * percentage / 100).toFixed(2);
  const advertiserShare = (profit * (100 - percentage) / 100).toFixed(2);

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2 sm:mb-0">
          <Handshake size={20} className="mr-2 text-indigo-600"/>
          Job Pricing
        </h3>
        <div className="flex items-center gap-2 p-1 bg-gray-200/70 rounded-lg">
          <Button
            size="sm"
            variant={paymentType === 'profitShare' ? 'default' : 'ghost'}
            className={`flex-1 transition-all ${paymentType === 'profitShare' ? 'bg-white shadow' : 'text-gray-600'}`}
            onClick={() => setPaymentType('profitShare')}
          >
            <Percent className="h-4 w-4 mr-2" />
            Profit Share
          </Button>
          <Button
            size="sm"
            variant={paymentType === 'flatRate' ? 'default' : 'ghost'}
            className={`flex-1 transition-all ${paymentType === 'flatRate' ? 'bg-white shadow' : 'text-gray-600'}`}
            onClick={() => setPaymentType('flatRate')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Flat Rate
          </Button>
        </div>
      </div>
      
      {paymentType === 'profitShare' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="estimatedProfit" className="font-medium">Estimated Profit ($)</Label>
              <Input
                id="estimatedProfit"
                type="number"
                value={formData.estimatedProfit}
                onChange={(e) => onInputChange('estimatedProfit', e.target.value)}
                placeholder="e.g., 150"
                min="0"
                className="focus:ring-green-500 focus:border-green-500 bg-white"
              />
               <p className="text-xs text-gray-500">The profit you expect the tech to make from the job budget.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profitSharePercentage" className="font-medium flex items-center">
                <Percent size={16} className="mr-1 text-green-600"/> Technician's Share
              </Label>
              <Select value={formData.profitSharePercentage} onValueChange={(value) => onInputChange('profitSharePercentage', value)}>
                <SelectTrigger className="focus:ring-green-500 focus:border-green-500 bg-white">
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent>
                  {[30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(val => (
                     <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Percentage of profit the tech will receive.</p>
            </div>
          </div>

          {formData.estimatedProfit && formData.profitSharePercentage && (
            <Card className="mt-4 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Projected Earnings:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-500">Technician Will Earn</p>
                    <p className="text-lg font-bold text-green-700">${technicianShare}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-500">You Will Earn (Lead Fee)</p>
                    <p className="text-lg font-bold text-blue-700">${advertiserShare}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="flatRate" className="font-medium">Flat Rate Payout ($)</Label>
          <Input
            id="flatRate"
            type="number"
            value={formData.flatRate}
            onChange={(e) => onInputChange('flatRate', e.target.value)}
            placeholder="e.g., 200"
            min="0"
            className="focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          />
          <p className="text-xs text-gray-500">The fixed amount the technician will be paid for completing this job.</p>
        </div>
      )}
    </div>
  );
};

export default JobPricingForm;
