import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AddToFavoritesDialog = ({
  isOpen,
  onClose,
  servicePro,
  favoriteLists,
  selectedListId,
  setSelectedListId,
  newListName,
  setNewListName,
  onConfirm,
  isServiceProInSpecificFavoriteList
}) => {
  if (!servicePro) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {servicePro.name || servicePro.companyName} to Favorites</DialogTitle>
          <DialogDescription>
            Select an existing list or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Select onValueChange={setSelectedListId} defaultValue={selectedListId || favoriteLists[0]?.id || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select a list" />
            </SelectTrigger>
            <SelectContent>
              {favoriteLists.map((list) => (
                <SelectItem 
                  key={list.id} 
                  value={list.id} 
                  disabled={isServiceProInSpecificFavoriteList(list.id, servicePro.id)}
                >
                  {list.name} {isServiceProInSpecificFavoriteList(list.id, servicePro.id) && "(Already in list)"}
                </SelectItem>
              ))}
              <SelectItem value="create_new_list">
                <div className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" /> Create New List
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {selectedListId === 'create_new_list' && (
            <Input
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Add to List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToFavoritesDialog;