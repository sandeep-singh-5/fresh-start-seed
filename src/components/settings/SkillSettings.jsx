import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit, Save, Wrench, Briefcase, Tag as SkillTagIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../hooks/useAuth.jsx';
import { toast } from '../ui/use-toast';

const SkillSettings = () => {
  const { user, updateUser } = useAuth();
  
  const [currentTrade, setCurrentTrade] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState({ trade: null, index: null, value: '' });

  const trades = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Cleaning', 'Landscaping', 'Appliance Repair', 'Garage Doors', 'Handyman', 'Other'];

  const handleAddSkill = () => {
    if (!currentTrade || !currentSkill.trim()) {
      toast({ title: "Error", description: "Please select a trade and enter a skill.", variant: "destructive" });
      return;
    }
    const updatedSkills = { ...(user.skills || {}) };
    if (!updatedSkills[currentTrade]) {
      updatedSkills[currentTrade] = [];
    }
    if (!updatedSkills[currentTrade].map(s => s.toLowerCase()).includes(currentSkill.trim().toLowerCase())) {
      updatedSkills[currentTrade].push(currentSkill.trim());
      updateUser({ skills: updatedSkills });
      setCurrentSkill('');
      toast({ title: "Skill Added", description: `Skill "${currentSkill.trim()}" added to ${currentTrade}.` });
    } else {
      toast({ title: "Info", description: "Skill already exists for this trade.", variant: "default" });
    }
  };

  const handleRemoveSkill = (trade, skillToRemove) => {
    const updatedSkills = { ...user.skills };
    updatedSkills[trade] = updatedSkills[trade].filter(skill => skill !== skillToRemove);
    if (updatedSkills[trade].length === 0) {
      delete updatedSkills[trade];
    }
    updateUser({ skills: updatedSkills });
    toast({ title: "Skill Removed", description: `Skill "${skillToRemove}" removed from ${trade}.` });
  };

  const handleEditSkill = (trade, index, value) => {
    setEditingSkill({ trade, index, value });
  };

  const handleSaveSkillEdit = () => {
    if (!editingSkill.trade || editingSkill.index === null || !editingSkill.value.trim()) return;
    const updatedSkills = { ...user.skills };
    updatedSkills[editingSkill.trade][editingSkill.index] = editingSkill.value.trim();
    updateUser({ skills: updatedSkills });
    setEditingSkill({ trade: null, index: null, value: '' });
    toast({ title: "Skill Updated", description: "Skill has been updated." });
  };

  if (!user || user.userType !== 'technician') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <Wrench className="h-7 w-7 text-blue-600" /> Skills Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">This section is for technicians to manage their skills.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card as={motion.div} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <Wrench className="h-7 w-7 text-blue-600" />
          Manage Your Skills
        </CardTitle>
        <CardDescription className="text-slate-600 mt-1">
          List your skills for different trades to attract more job offers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end p-5 border border-slate-200 rounded-lg bg-slate-50/60">
            <div className="space-y-1.5">
              <Label htmlFor="trade">Select Trade</Label>
              <Select value={currentTrade} onValueChange={setCurrentTrade}>
                <SelectTrigger id="trade">
                  <SelectValue placeholder="Choose a trade" />
                </SelectTrigger>
                <SelectContent>
                  {trades.map(trade => (
                    <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="skill">Add Skill</Label>
              <div className="flex gap-2.5">
                <Input
                  id="skill"
                  placeholder="e.g., Faucet Repair, Circuit Breaker Installation"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  disabled={!currentTrade}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-grow"
                />
                <Button onClick={handleAddSkill} disabled={!currentTrade || !currentSkill.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-5 w-5 mr-1.5" /> Add
                </Button>
              </div>
            </div>
          </div>

          {user.skills && Object.keys(user.skills).length > 0 ? (
            <div className="space-y-5 pt-5 border-t border-slate-200">
              <h4 className="text-lg font-semibold text-slate-700">Your Current Skills:</h4>
              {Object.entries(user.skills).map(([trade, skillsList]) => (
                skillsList.length > 0 && (
                  <div key={trade} className="p-4 border border-slate-200 rounded-lg bg-slate-50/60">
                    <h5 className="font-semibold text-md text-blue-700 mb-2.5 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" /> {trade}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill, index) => (
                        editingSkill.trade === trade && editingSkill.index === index ? (
                          <div key={index} className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border-2 border-blue-500 shadow-md">
                            <Input 
                              value={editingSkill.value} 
                              onChange={(e) => setEditingSkill({...editingSkill, value: e.target.value})}
                              className="h-8 text-sm py-1.5 px-2"
                              autoFocus
                            />
                            <Button size="icon" variant="ghost" onClick={handleSaveSkillEdit} className="h-8 w-8 hover:bg-green-100"><Save className="h-4 w-4 text-green-600"/></Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingSkill({trade: null, index: null, value: ''})} className="h-8 w-8 hover:bg-red-100"><X className="h-4 w-4 text-red-600"/></Button>
                          </div>
                        ) : (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full cursor-default"
                          >
                            <SkillTagIcon className="h-3.5 w-3.5"/>
                            {skill}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 hover:bg-blue-200 rounded-full ml-0.5"
                              onClick={() => handleEditSkill(trade, index, skill)}
                            >
                              <Edit className="h-3 w-3 text-blue-700" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 hover:bg-red-100 rounded-full"
                              onClick={() => handleRemoveSkill(trade, skill)}
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </Button>
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-md text-slate-500 text-center py-8">No skills added yet. Start by selecting a trade and adding your skills.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillSettings;