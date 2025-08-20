import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ListPlus, Trash2, Edit3, User, Briefcase, MapPin, Star, PlusCircle, X, Wrench } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast.js';

const FavoritesPage = () => {
  const { 
    favoriteLists, 
    createFavoriteList, 
    deleteFavoriteList, 
    renameFavoriteList,
    removeServiceProFromFavoriteList 
  } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();

  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null); 
  const [renamingListName, setRenamingListName] = useState('');
  const [showCreateListDialog, setShowCreateListDialog] = useState(false);
  const [showRenameListDialog, setShowRenameListDialog] = useState(false);

  if (!user || user.userType !== 'advertiser') {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Favorites are only available for advertiser accounts.</p>
      </div>
    );
  }

  const handleCreateList = () => {
    if (newListName.trim()) {
      createFavoriteList(newListName.trim());
      setNewListName('');
      setShowCreateListDialog(false);
    } else {
      toast({
        title: "Error",
        description: "List name cannot be empty.",
        variant: "destructive"
      });
    }
  };

  const handleRenameList = () => {
    if (editingList && renamingListName.trim()) {
      renameFavoriteList(editingList.id, renamingListName.trim());
      setEditingList(null);
      setRenamingListName('');
      setShowRenameListDialog(false);
    } else {
      toast({
        title: "Error",
        description: "List name cannot be empty or list not selected.",
        variant: "destructive"
      });
    }
  };
  
  const openRenameDialog = (list) => {
    setEditingList(list);
    setRenamingListName(list.name);
    setShowRenameListDialog(true);
  };


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-l-4 border-pink-500">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
                  <Heart className="h-8 w-8 mr-3 text-pink-600 fill-pink-500" />
                  Favorite Service Pros
                </CardTitle>
                <CardDescription className="text-gray-600 ml-11">
                  Manage your lists of preferred Service Pros.
                </CardDescription>
              </div>
              <Dialog open={showCreateListDialog} onOpenChange={setShowCreateListDialog}>
                <DialogTrigger asChild>
                  <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                    <ListPlus className="h-5 w-5 mr-2" /> Create New List
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Favorite List</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new list of favorite Service Pros.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="E.g., 'Top Plumbers', 'Go-To Electricians'"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateListDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateList}>Create List</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {favoriteLists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">You haven't created any favorite lists yet.</p>
          <p className="text-gray-400">Start by creating a list to organize your favorite Service Pros!</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {favoriteLists.map((list) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gray-50 border-b p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-700">{list.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openRenameDialog(list)} className="text-gray-500 hover:text-blue-600">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete the list "{list.name}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                               <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => deleteFavoriteList(list.id)}>Delete List</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {list.servicePros.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No Service Pros added to this list yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.servicePros.map((servicePro) => (
                        <Card key={servicePro.id} className="overflow-hidden group relative">
                           <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 z-10 bg-black/30 hover:bg-red-500/80 text-white rounded-full h-7 w-7"
                            onClick={() => removeServiceProFromFavoriteList(list.id, servicePro.id)}
                            title="Remove from list"
                           >
                            <X className="h-4 w-4" />
                          </Button>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar className="h-12 w-12 border-2 border-pink-300">
                                <AvatarImage src={servicePro.avatar || `https://avatar.vercel.sh/${servicePro.username}.png`} alt={servicePro.name || servicePro.companyName} />
                                <AvatarFallback>{(servicePro.name || servicePro.companyName || 'S').substring(0,2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-md font-semibold text-gray-800">{servicePro.name || servicePro.companyName}</p>
                                {servicePro.companyName && servicePro.name && <p className="text-xs text-gray-500">{servicePro.companyName}</p>}
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs text-gray-600">
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-400 fill-yellow-400" />
                                Rating: {servicePro.overallRating?.toFixed(1) || 'N/A'} ({servicePro.totalReviews || 0} reviews)
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                Jobs Completed: {servicePro.completedJobs || 0}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                {servicePro.location || 'Location N/A'}
                              </div>
                            </div>
                             <div className="mt-3">
                                {(servicePro.skills || []).slice(0,3).map(skill => (
                                    <Badge key={skill} variant="secondary" className="mr-1 mb-1 text-xs bg-pink-100 text-pink-700 border-pink-200">{skill}</Badge>
                                ))}
                                {(servicePro.skills || []).length > 3 && <Badge variant="outline" className="text-xs">+{ (servicePro.skills || []).length - 3} more</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showRenameListDialog} onOpenChange={setShowRenameListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Favorite List</DialogTitle>
            <DialogDescription>
              Enter a new name for the list "{editingList?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="New list name"
              value={renamingListName}
              onChange={(e) => setRenamingListName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRenameListDialog(false); setEditingList(null); }}>Cancel</Button>
            <Button onClick={handleRenameList}>Save Name</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FavoritesPage;