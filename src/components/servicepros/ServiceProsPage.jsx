import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useAuth } from '../../hooks/useAuth.jsx'; 
import { useSettings } from '../../hooks/useSettings.jsx';
import { useFavorites } from '../../hooks/useFavorites.jsx';
import { useMessages } from '../../hooks/useMessages.jsx';
import { useToast } from '../../hooks/use-toast.js';
import ServiceProFilters from './ServiceProFilters.jsx';
import ServiceProTable from './ServiceProTable.jsx';
import AddToFavoritesDialog from './AddToFavoritesDialog.jsx';

const ServiceProsPage = ({ setCurrentView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState('rating_desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const { users: usersFromAuth } = useAuth(); 
  const { settings } = useSettings();
  const { 
    favoriteLists, 
    addServiceProToFavoriteList, 
    createFavoriteList, 
    isServiceProInAnyFavoriteList, 
    isServiceProInSpecificFavoriteList 
  } = useFavorites();
  const { sendMessage, startOrGoToConversation } = useMessages();
  const { toast } = useToast();

  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedServiceProForFavorites, setSelectedServiceProForFavorites] = useState(null);
  const [selectedFavoriteListId, setSelectedFavoriteListId] = useState('');
  const [newFavoriteListName, setNewFavoriteListName] = useState('');
  
  const availableSkills = useMemo(() => settings?.trades || [], [settings]);

  const servicePros = useMemo(() => {
    if (!Array.isArray(usersFromAuth)) {
      return []; 
    }
    return usersFromAuth.filter(user => user.userType === 'technician');
  }, [usersFromAuth]);

  const filteredAndSortedServicePros = useMemo(() => {
    let processedServicePros = [...servicePros];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      processedServicePros = processedServicePros.filter(pro =>
        (pro.username && pro.username.toLowerCase().includes(lowerSearchTerm)) ||
        (pro.name && pro.name.toLowerCase().includes(lowerSearchTerm)) ||
        (pro.companyName && pro.companyName.toLowerCase().includes(lowerSearchTerm)) ||
        (pro.bio && pro.bio.toLowerCase().includes(lowerSearchTerm)) ||
        (pro.skills && (Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills).flat()).some(skill => skill.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    if (skillFilter && skillFilter !== 'All Skills') {
      processedServicePros = processedServicePros.filter(pro =>
        pro.skills && (Array.isArray(pro.skills) ? pro.skills : Object.values(pro.skills).flat()).includes(skillFilter)
      );
    }

    if (ratingFilter > 0) {
      processedServicePros = processedServicePros.filter(pro =>
        pro.overallRating && pro.overallRating >= ratingFilter
      );
    }
    
    const [sortBy, sortOrder] = sortOption.split('_');

    processedServicePros.sort((a, b) => {
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
        case 'name': // Sort by username, fallback to name/companyName
          valA = (a.username || a.name || a.companyName || '').toLowerCase();
          valB = (b.username || b.name || b.companyName || '').toLowerCase();
          if (sortOrder === 'asc') return valA.localeCompare(valB);
          return valB.localeCompare(valA);
        case 'memberSince':
            valA = new Date(a.memberSince || 0).getTime();
            valB = new Date(b.memberSince || 0).getTime();
            break;
        default:
          return 0;
      }
      return sortOrder === 'asc' ? valA - valB : valB - a;
    });

    return processedServicePros;
  }, [servicePros, searchTerm, skillFilter, ratingFilter, sortOption]);

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
    { value: 'name_asc', label: 'Username (A-Z)' },
    { value: 'name_desc', label: 'Username (Z-A)' },
    { value: 'memberSince_desc', label: 'Newest Members' },
    { value: 'memberSince_asc', label: 'Oldest Members' },
  ];

  const toggleRowExpansion = (proId) => {
    setExpandedRow(expandedRow === proId ? null : proId);
  };

  const openAddToFavoritesDialog = (pro) => {
    setSelectedServiceProForFavorites(pro);
    setSelectedFavoriteListId(favoriteLists[0]?.id || ''); 
    setShowAddToListDialog(true);
  };

  const handleAddServiceProToFavorites = () => {
    if (!selectedServiceProForFavorites) return;
    const proDisplayName = selectedServiceProForFavorites.username || selectedServiceProForFavorites.name || selectedServiceProForFavorites.companyName;

    if (selectedFavoriteListId === 'create_new_list') {
      if (!newFavoriteListName.trim()) {
        toast({ title: "Error", description: "New list name cannot be empty.", variant: "destructive" });
        return;
      }
      const existingList = favoriteLists.find(l => l.name === newFavoriteListName.trim());
      if (existingList) {
         toast({ title: "List Exists", description: `A list named "${newFavoriteListName.trim()}" already exists. Please choose a different name or select the existing list.`, variant: "destructive" });
         return;
      }

      createFavoriteList(newFavoriteListName.trim());
      
      const findNewListAndAdd = () => {
        const newList = favoriteLists.find(l => l.name === newFavoriteListName.trim());
        if (newList) {
          addServiceProToFavoriteList(newList.id, selectedServiceProForFavorites);
          setNewFavoriteListName('');
          setShowAddToListDialog(false);
          setSelectedServiceProForFavorites(null);
        } else {
          setTimeout(findNewListAndAdd, 50);
        }
      };
      setTimeout(findNewListAndAdd, 50);

    } else if (selectedFavoriteListId) {
       if (isServiceProInSpecificFavoriteList(selectedFavoriteListId, selectedServiceProForFavorites.id)) {
        toast({
          title: "Already Added",
          description: `${proDisplayName} is already in the selected list.`,
          variant: "info",
        });
      } else {
        addServiceProToFavoriteList(selectedFavoriteListId, selectedServiceProForFavorites);
      }
      setShowAddToListDialog(false);
      setSelectedServiceProForFavorites(null);
    } else {
      toast({ title: "Error", description: "Please select a list or create a new one.", variant: "destructive" });
      return;
    }
  };

  const handleCloseAddToFavoritesDialog = () => {
    setShowAddToListDialog(false);
    setSelectedServiceProForFavorites(null);
    setNewFavoriteListName('');
    setSelectedFavoriteListId('');
  };

  const handleContactServicePro = (servicePro) => {
    if (!servicePro || !servicePro.id) {
      toast({ title: "Error", description: "Service Pro details are missing.", variant: "destructive" });
      return;
    }
    const proDisplayName = servicePro.username || servicePro.name || servicePro.companyName;
    startOrGoToConversation(servicePro.id, proDisplayName);
    navigate('/messages');
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
                  <Wrench className="h-8 w-8 mr-3 text-blue-600" />
                  Find Service Pros
                </CardTitle>
                <CardDescription className="text-gray-600 ml-11">
                  Discover skilled professionals for your projects.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ServiceProFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              skillFilter={skillFilter}
              setSkillFilter={setSkillFilter}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
              availableSkills={availableSkills}
              ratingOptions={ratingOptions}
              sortOptions={sortOptions}
            />
          </CardContent>
        </Card>
      </motion.div>

      {filteredAndSortedServicePros.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No Service Pros found matching your criteria.</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0 overflow-x-auto">
            <ServiceProTable
              servicePros={filteredAndSortedServicePros}
              expandedRow={expandedRow}
              toggleRowExpansion={toggleRowExpansion}
              openAddToFavoritesDialog={openAddToFavoritesDialog}
              isServiceProInAnyFavoriteList={isServiceProInAnyFavoriteList}
              onContactServicePro={handleContactServicePro}
            />
          </CardContent>
        </Card>
      )}

      <AddToFavoritesDialog
        isOpen={showAddToListDialog}
        onClose={handleCloseAddToFavoritesDialog}
        servicePro={selectedServiceProForFavorites}
        favoriteLists={favoriteLists}
        selectedListId={selectedFavoriteListId}
        setSelectedListId={setSelectedFavoriteListId}
        newListName={newFavoriteListName}
        setNewListName={setNewFavoriteListName}
        onConfirm={handleAddServiceProToFavorites}
        isServiceProInSpecificFavoriteList={isServiceProInSpecificFavoriteList}
      />
    </div>
  );
};

export default ServiceProsPage;