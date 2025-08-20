import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { toast } from '@/components/ui/use-toast';
import { Gift, Plus, Trash2, DollarSign } from 'lucide-react';

const BonusIncentivesForm = ({ bonuses, onBonusesChange }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddBonus = () => {
    if (!description.trim() || !amount.trim()) {
      toast({ title: 'Error', description: 'Please fill in both bonus description and amount.', variant: 'destructive' });
      return;
    }
    if (parseFloat(amount) <= 0) {
      toast({ title: 'Error', description: 'Bonus amount must be greater than zero.', variant: 'destructive' });
      return;
    }

    const newBonus = {
      id: `bonus_${Date.now()}`,
      description,
      amount: parseFloat(amount),
    };

    onBonusesChange([...bonuses, newBonus]);
    setDescription('');
    setAmount('');
    toast({ title: 'Bonus Added!', description: 'The new incentive has been added.' });
  };

  const handleRemoveBonus = (id) => {
    onBonusesChange(bonuses.filter(b => b.id !== id));
    toast({ title: 'Bonus Removed', description: 'The incentive has been removed.' });
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-3 flex items-center">
        <Gift size={20} className="mr-2 text-pink-600"/>
        Bonuses & Incentives (Optional)
      </h3>
      <p className="text-sm text-gray-500 -mt-4">Incentivize top performance with conditional bonuses.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="bonus-desc">Bonus Condition</Label>
          <Input 
            id="bonus-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., For 5-star customer review"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bonus-amount">Bonus Amount ($)</Label>
          <div className="flex gap-2">
            <Input 
              id="bonus-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 25"
              min="0"
              className="bg-white"
            />
            <Button type="button" variant="outline" onClick={handleAddBonus}>
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
      
      {bonuses && bonuses.length > 0 && (
        <div className="space-y-2 mt-4">
          <Label className="font-medium">Added Bonuses:</Label>
          <AnimatePresence>
            {bonuses.map((bonus) => (
              <motion.div
                key={bonus.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="flex items-center justify-between p-3 border rounded-lg bg-white/70 backdrop-blur-sm shadow-sm"
              >
                <p className="text-sm text-gray-700">{bonus.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-green-600 flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    {bonus.amount.toFixed(2)}
                  </span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveBonus(bonus.id)} className="text-red-500 hover:text-red-700 h-8 w-8">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BonusIncentivesForm;