import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Briefcase, MapPin, Award, MessageSquare, ChevronDown, ChevronUp, Users, Heart, PlusCircle, ListPlus, CalendarDays, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../hooks/useAuth.jsx'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSettings } from '../../hooks/useSettings.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../ui/dialog';
import { useFavorites } from '../../hooks/useFavorites.jsx';
import { useToast } from '../ui/use-toast.js';

const TechsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState('rating_desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const { users: usersFromAuth } = useAuth(); 
  const { settings } = useSettings();
  const { favoriteLists, addTechToFavoriteList, createFavoriteList, isTechInAnyFavoriteList, isTechInSpecificFavoriteList } = useFavorites();
  const { toast } = useToast();

  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedTechForFavorites, setSelectedTechForFavorites] = useState(null);
  const [selectedFavoriteListId, setSelectedFavoriteListId] = useState('');
  const [newFavoriteListName, setNewFavoriteListName] = useState('');
  
  const availableSkills = useMemo(() => settings?.trades || [], [settings]);

  const technicians = useMemo(() => {
    if (!Array.isArray(usersFromAuth)) {
      return []; 
    }
    return usersFromAuth.filter(user => user.userType === 'technician');
  }, [usersFromAuth]);

  const filteredAndSortedTechnicians = useMemo(() => {
    let processedTechnicians = [...technicians];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      processedTechnicians = processedTechnicians.filter(tech =>
        (tech.name && tech.name.toLowerCase().includes(lowerSearchTerm)) ||
        (tech.companyName && tech.companyName.toLowerCase().includes(lowerSearchTerm)) ||
        (tech.bio && tech.bio.toLowerCase().includes(lowerSearchTerm)) ||
        (tech.skills && tech.skills.some(skill => skill.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    if (skillFilter && skillFilter !== 'All Skills') {
      processedTechnicians = processedTechnicians.filter(tech =>
        tech.skills && tech.skills.includes(skillFilter)
      );
    }

    if (ratingFilter > 0) {
      processedTechnicians = processedTechnicians.filter(tech =>
        tech.overallRating && tech.overallRating >= ratingFilter
      );
    }
    
    const [sortBy, sortOrder] = sortOption.split('_');

    processedTechnicians.sort((a, b) => {
      let valA, valB;
      switch (sortBy) {
        case 'rating':
          valA = a.overallRating || 0;
          valB = b.overallRating || 0;
          break;
        case 'experience':
          valA = a.completedJobs || 0;
          valB = b.completedJobs || 0;
          break;
        case 'name':
          valA = (a.name || a.companyName || '').toLowerCase();
          valB = (b.name || b.companyName || '').toLowerCase();
          if (sortOrder === 'asc') return valA.localeCompare(valB);
          return valB.localeCompare(valA);
        case 'memberSince':
            valA = new Date(a.memberSince || 0).getTime();
            valB = new Date(b.memberSince || 0).getTime();
            break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return processedTechnicians;
  }, [technicians, searchTerm, skillFilter, ratingFilter, sortOption]);

  const ratingOptions = [
    { value: 0, label: 'Any Rating' },
    { value: 1, label: '1+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 5, label: '5 Stars' },
  ];

  const sortOptions = [
    { value: 'rating_desc', label: 'Rating (High to Low)' },
    { value: 'rating_asc', label: 'Rating (Low to High)' },
    { value: 'experience_desc', label: 'Experience (Most Jobs)' },
    { value: 'experience_asc', label: 'Experience (Fewest Jobs)' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'memberSince_desc', label: 'Newest Members' },
    { value: 'memberSince_asc', label: 'Oldest Members' },
  ];

  const toggleRowExpansion = (techId) => {
    setExpandedRow(expandedRow === techId ? null : techId);
  };

  const openAddToFavoritesDialog = (tech) => {
    setSelectedTechForFavorites(tech);
    setSelectedFavoriteListId(favoriteLists[0]?.id || ''); 
    setShowAddToListDialog(true);
  };

  const handleAddTechToFavorites = () => {
    if (!selectedTechForFavorites) return;

    if (selectedFavoriteListId === 'create_new_list') {
      if (!newFavoriteListName.trim()) {
        toast({ title: "Error", description: "New list name cannot be empty.", variant: "destructive" });
        return;
      }
      // Find if a list with this name already exists
      const existingList = favoriteLists.find(l => l.name === newFavoriteListName.trim());
      if (existingList) {
         toast({ title: "List Exists", description: `A list named "${newFavoriteListName.trim()}" already exists. Please choose a different name or select the existing list.`, variant: "destructive" });
         return;
      }

      createFavoriteList(newFavoriteListName.trim());
      // To reliably add to the newly created list, we need to wait for the state update or find the new list's ID.
      // This timeout is a simplified way to handle the async nature of setState.
      setTimeout(() => {
        const newList = favoriteLists.find(l => l.name === newFavoriteListName.trim());
        if (newList) {
          addTechToFavoriteList(newList.id, selectedTechForFavorites);
        }
        setNewFavoriteListName('');
      }, 100); 
    } else if (selectedFavoriteListId) {
       if (isTechInSpecificFavoriteList(selectedFavoriteListId, selectedTechForFavorites.id)) {
        toast({
          title: "Already Added",
          description: `${selectedTechForFavorites.name || selectedTechForFavorites.companyName} is already in the selected list.`,
          variant: "info",
        });
      } else {
        addTechToFavoriteList(selectedFavoriteListId, selectedTechForFavorites);
      }
    } else {
      toast({ title: "Error", description: "Please select a list or create a new one.", variant: "destructive" });
      return;
    }
    setShowAddToListDialog(false);
    setSelectedTechForFavorites(null);
  };


  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-blue-600" />
                  Find Technicians
                </CardTitle>
                <CardDescription className="text-gray-600 ml-11">
                  Discover skilled professionals for your projects.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, company, skill, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 py-2.5 text-base"
                />
              </div>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full py-2.5 text-base">
                  <SelectValue placeholder="Filter by Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Skills">All Skills</SelectItem>
                  {Array.isArray(availableSkills) && availableSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter.toString()} onValueChange={(val) => setRatingFilter(parseInt(val))}>
                <SelectTrigger className="w-full py-2.5 text-base">
                  <SelectValue placeholder="Filter by Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="flex justify-end mb-4">
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full sm:w-auto sm:min-w-[200px] py-2.5 text-base">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {filteredAndSortedTechnicians.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No technicians found matching your criteria.</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100 transition-colors">
                  <TableHead className="w-[50px] py-3 px-4"></TableHead> 
                  <TableHead className="min-w-[250px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</TableHead>
                  <TableHead className="min-w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Skills</TableHead>
                  <TableHead className="min-w-[180px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</TableHead>
                  <TableHead className="min-w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</TableHead>
                  <TableHead className="min-w-[200px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTechnicians.map((tech) => (
                  <React.Fragment key={tech.id}>
                    <TableRow 
                      className="border-b hover:bg-gray-50/70 transition-colors duration-150"
                    >
                      <TableCell className="py-3 px-4 cursor-pointer align-top" onClick={() => toggleRowExpansion(tech.id)}>
                        {expandedRow === tech.id ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-gray-400 hover:text-blue-500" />}
                      </TableCell>
                      <TableCell className="py-3 px-4 align-top">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-blue-300 flex-shrink-0">
                            <AvatarImage src={tech.profilePicture || `https://avatar.vercel.sh/${tech.username || 'Tech'}.png`} alt={tech.name || tech.companyName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-green-400 text-white">{(tech.name || tech.companyName || 'T').substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">{tech.name || tech.companyName}</div>
                            {tech.companyName && tech.name && <div className="text-xs text-gray-500">{tech.companyName}</div>}
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <CalendarDays className="h-3.5 w-3.5 mr-1 text-gray-400"/> Member Since: {tech.memberSince ? new Date(tech.memberSince).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 align-top">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {(tech.skills || []).slice(0, 3).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5">{skill}</Badge>
                          ))}
                          {(tech.skills || []).length > 3 && <Badge variant="outline" className="text-xs px-2 py-0.5">+{ (tech.skills || []).length - 3} more</Badge>}
                           {(!tech.skills || tech.skills.length === 0) && <span className="text-xs text-gray-400">No skills listed</span> }
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 align-top">
                        <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-700">
                                <Star className={`h-4 w-4 mr-1 ${tech.overallRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                <span className="font-medium">{(tech.overallRating || 0).toFixed(1)}</span>&nbsp;({tech.totalReviews || 0} reviews)
                            </div>
                            <div className="flex items-center text-xs text-gray-700">
                                <Briefcase className="h-4 w-4 mr-1.5 text-blue-500" />
                                {tech.completedJobs || 0} Jobs Completed
                            </div>
                             {tech.responseTime && (
                                <div className="flex items-center text-xs text-gray-700">
                                    <Clock className="h-4 w-4 mr-1.5 text-purple-500" />
                                    Avg. Response: {tech.responseTime}
                                </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-xs text-gray-700 align-top">
                        <div className="flex items-center">
                           <MapPin className="h-4 w-4 mr-1.5 text-green-500 flex-shrink-0" /> 
                           <span>{tech.location || 'N/A'}</span>
                        </div>
                        {tech.serviceArea && (
                            <div className="text-xs text-gray-500 mt-1 ml-0.5">Serves: {tech.serviceArea}</div>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 align-top">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-2">
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-xs px-2.5 py-1.5 w-full sm:w-auto">
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Contact
                          </Button>
                           <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openAddToFavoritesDialog(tech)}
                            className={`text-xs px-2.5 py-1.5 w-full sm:w-auto ${isTechInAnyFavoriteList(tech.id) ? 'text-pink-600 border-pink-500 hover:bg-pink-50 hover:text-pink-700' : 'text-gray-600 hover:border-pink-500 hover:text-pink-600'}`}
                            >
                            <Heart className={`h-3.5 w-3.5 mr-1.5 ${isTechInAnyFavoriteList(tech.id) ? 'fill-pink-500' : ''}`} /> 
                            Favorite
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRow === tech.id && (
                      <TableRow className="bg-gradient-to-r from-blue-50/30 via-white to-green-50/30">
                        <TableCell colSpan={6} className="p-0">
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 sm:p-6 bg-white shadow-inner rounded-b-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Sparkles className="h-4 w-4 mr-2 text-purple-500"/>Full Bio</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">{tech.bio || 'No detailed bio provided by this technician.'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Award className="h-4 w-4 mr-2 text-amber-500"/>All Skills</h4>
                                        {(tech.skills && tech.skills.length > 0) ? (
                                            <div className="flex flex-wrap gap-1.5">
                                            {tech.skills.map(skill => (
                                                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5 font-normal">{skill}</Badge>
                                            ))}
                                            </div>
                                        ) : <p className="text-xs text-gray-500">No specific skills listed.</p>}
                                    </div>
                                    
                                    <div className="space-y-2 text-xs text-gray-600">
                                         <h4 className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-teal-500"/>Verifications & More</h4>
                                        {tech.certifications && tech.certifications.length > 0 && (
                                            <div className="flex items-start">
                                                <strong className="w-24 font-medium text-gray-500">Certifications:</strong>
                                                <span>{tech.certifications.join(', ')}</span>
                                            </div>
                                        )}
                                        {tech.yearsOfExperience && (
                                            <div className="flex items-center">
                                                <strong className="w-24 font-medium text-gray-500">Experience:</strong>
                                                <span>{tech.yearsOfExperience} years</span>
                                            </div>
                                        )}
                                         <div className="flex items-center">
                                            <strong className="w-24 font-medium text-gray-500">Insurance:</strong>
                                            <span>{tech.insuranceDetails || 'Details not provided'}</span>
                                        </div>
                                         <div className="flex items-center">
                                            <strong className="w-24 font-medium text-gray-500">License No:</strong>
                                            <span>{tech.licenseNumber || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddToListDialog} onOpenChange={setShowAddToListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedTechForFavorites?.name || selectedTechForFavorites?.companyName} to Favorites</DialogTitle>
            <DialogDescription>
              Select an existing list or create a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Select onValueChange={setSelectedFavoriteListId} defaultValue={favoriteLists[0]?.id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {favoriteLists.map((list) => (
                  <SelectItem key={list.id} value={list.id} disabled={isTechInSpecificFavoriteList(list.id, selectedTechForFavorites?.id)}>
                    {list.name} {isTechInSpecificFavoriteList(list.id, selectedTechForFavorites?.id) && "(Already in list)"}
                  </SelectItem>
                ))}
                <SelectItem value="create_new_list">
                  <div className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" /> Create New List
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {selectedFavoriteListId === 'create_new_list' && (
              <Input
                placeholder="New list name"
                value={newFavoriteListName}
                onChange={(e) => setNewFavoriteListName(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowAddToListDialog(false); setSelectedTechForFavorites(null)}}>Cancel</Button>
            <Button onClick={handleAddTechToFavorites}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TechsPage;