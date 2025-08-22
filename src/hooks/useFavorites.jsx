import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.jsx';
import { useToast } from './use-toast';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteLists, setFavoriteLists] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback(() => {
    return user ? `favorites_${user.id}` : null;
  }, [user]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        const storedFavorites = localStorage.getItem(storageKey);
        if (storedFavorites) {
          setFavoriteLists(JSON.parse(storedFavorites));
        } else {
          setFavoriteLists([]); 
        }
      } catch (error) {
        console.error("Failed to load favorites from localStorage", error);
        setFavoriteLists([]);
        toast({
          title: "Error",
          description: "Could not load your favorite lists.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    } else {
      setFavoriteLists([]); 
      setIsLoading(false);
    }
  }, [user, getStorageKey, toast]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey && !isLoading) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(favoriteLists));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
        toast({
          title: "Error",
          description: "Could not save your favorite lists.",
          variant: "destructive",
        });
      }
    }
  }, [favoriteLists, user, getStorageKey, isLoading, toast]);

  const createFavoriteList = (listName) => {
    if (!listName.trim()) {
      toast({
        title: "Invalid List Name",
        description: "List name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (favoriteLists.some(list => list.name === listName)) {
      toast({
        title: "List Exists",
        description: `A list named "${listName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    const newList = { id: Date.now().toString(), name: listName, servicePros: [] };
    setFavoriteLists(prev => [...prev, newList]);
    toast({
      title: "List Created",
      description: `Successfully created list: ${listName}`,
    });
  };

  const deleteFavoriteList = (listId) => {
    setFavoriteLists(prev => prev.filter(list => list.id !== listId));
    toast({
      title: "List Deleted",
      description: "The favorite list has been deleted.",
    });
  };
  
  const renameFavoriteList = (listId, newName) => {
    if (!newName.trim()) {
      toast({
        title: "Invalid List Name",
        description: "List name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    if (favoriteLists.some(list => list.id !== listId && list.name === newName)) {
       toast({
        title: "List Name Exists",
        description: `Another list named "${newName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    setFavoriteLists(prev => prev.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    ));
    toast({
      title: "List Renamed",
      description: "The favorite list has been renamed.",
    });
  };

  const addServiceProToFavoriteList = (listId, servicePro) => {
    setFavoriteLists(prev => prev.map(list => {
      if (list.id === listId) {
        if (list.servicePros.some(sp => sp.id === servicePro.id)) {
          toast({
            title: "Already in List",
            description: `${servicePro.name || servicePro.companyName} is already in this list.`,
            variant: "info",
          });
          return list;
        }
        toast({
          title: "Service Pro Added",
          description: `${servicePro.name || servicePro.companyName} added to ${list.name}.`,
        });
        return { ...list, servicePros: [...list.servicePros, servicePro] };
      }
      return list;
    }));
  };

  const removeServiceProFromFavoriteList = (listId, serviceProId) => {
    setFavoriteLists(prev => prev.map(list => {
      if (list.id === listId) {
        const serviceProToRemove = list.servicePros.find(sp => sp.id === serviceProId);
        toast({
          title: "Service Pro Removed",
          description: `${serviceProToRemove?.name || serviceProToRemove?.companyName || 'Service Pro'} removed from ${list.name}.`,
        });
        return { ...list, servicePros: list.servicePros.filter(sp => sp.id !== serviceProId) };
      }
      return list;
    }));
  };

  const isServiceProInAnyFavoriteList = (serviceProId) => {
    return favoriteLists.some(list => list.servicePros.some(sp => sp.id === serviceProId));
  };

  const isServiceProInSpecificFavoriteList = (listId, serviceProId) => {
    const list = favoriteLists.find(l => l.id === listId);
    return list ? list.servicePros.some(sp => sp.id === serviceProId) : false;
  };

  const value = {
    favoriteLists,
    isLoading,
    createFavoriteList,
    deleteFavoriteList,
    renameFavoriteList,
    addServiceProToFavoriteList,
    removeServiceProFromFavoriteList,
    isServiceProInAnyFavoriteList,
    isServiceProInSpecificFavoriteList
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};