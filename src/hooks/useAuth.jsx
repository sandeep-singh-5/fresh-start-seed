import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from './use-toast';
import { initialUsersData, createNewUserObject } from './auth/userData';
import { saveUsersToStorage, loadUsersFromStorage, saveLoggedInUserToStorage, loadLoggedInUserFromStorage, removeLoggedInUserFromStorage } from './auth/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let currentUsers = loadUsersFromStorage();
    if (!currentUsers || currentUsers.length === 0) {
      currentUsers = [...initialUsersData]; // Initialize with all default users if storage is empty
    } else {
      // Ensure all users from initialUsersData are present, adding if missing
      initialUsersData.forEach(initialUser => {
        const userExists = currentUsers.find(u => u.email === initialUser.email);
        if (!userExists) {
          currentUsers.push(initialUser);
        }
      });
    }
    setUsers(currentUsers);
    saveUsersToStorage(currentUsers);

    const loggedInUser = loadLoggedInUserFromStorage();
    if (loggedInUser) {
      // Ensure the logged-in user data is up-to-date with the users list
      const freshLoggedInUserData = currentUsers.find(u => u.id === loggedInUser.id);
      if (freshLoggedInUserData) {
        setUser(freshLoggedInUserData);
        saveLoggedInUserToStorage(freshLoggedInUserData); // Re-save to ensure consistency
      } else {
        // Logged-in user not found in current users list, possibly stale data
        removeLoggedInUserFromStorage(); 
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userToLogin = { ...foundUser, username: foundUser.username || foundUser.name || foundUser.email.split('@')[0] };
      setUser(userToLogin);
      saveLoggedInUserToStorage(userToLogin);
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userToLogin.username}!`,
        className: "bg-green-500 text-white",
      });
      return userToLogin;
    }
    toast({
      title: "Login Failed",
      description: "Invalid email or password.",
      variant: "destructive",
    });
    return null;
  }, [users, toast]);

  const logout = useCallback(() => {
    setUser(null);
    removeLoggedInUserFromStorage();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  const checkUsernameUnique = useCallback((usernameToCheck) => {
    if (!usernameToCheck) return true; // Allow empty if not required immediately
    return !users.some(u => u.username && u.username.toLowerCase() === usernameToCheck.toLowerCase());
  }, [users]);
  
  const register = useCallback((userData) => {
    const existingUserByEmail = users.find(u => u.email === userData.email);
    if (existingUserByEmail) {
      toast({ title: "Registration Failed", description: "User with this email already exists.", variant: "destructive" });
      return null;
    }
    if (!checkUsernameUnique(userData.username)) {
       toast({ title: "Registration Failed", description: "Username is already taken.", variant: "destructive" });
       return null;
    }

    const newUser = createNewUserObject(userData);
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    setUser(newUser);
    saveLoggedInUserToStorage(newUser);
    toast({ title: "Registration Successful!", description: `Welcome, ${newUser.username}!`, className: "bg-green-500 text-white" });
    return newUser;
  }, [users, toast, checkUsernameUnique]);

  const updateUser = useCallback((updatedData) => { // `userId` is implicitly user.id
    if (!user) return null;

    const userIdToUpdate = user.id;

    // If username is being changed, check for uniqueness
    if (updatedData.username && updatedData.username !== user.username && !checkUsernameUnique(updatedData.username)) {
      toast({ title: "Update Failed", description: "Username is already taken. Please choose another.", variant: "destructive" });
      return null; // Or throw an error
    }
    
    let userToUpdate = users.find(u => u.id === userIdToUpdate);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, ...updatedData };
      const updatedUsersList = users.map(u => (u.id === userIdToUpdate ? updatedUser : u));
      setUsers(updatedUsersList);
      saveUsersToStorage(updatedUsersList);
      
      setUser(updatedUser); // Update current user in state
      saveLoggedInUserToStorage(updatedUser); // Update in localStorage

      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      return updatedUser;
    }
    return null;
  }, [users, user, toast, checkUsernameUnique]);

  const updateUserStats = useCallback((technicianId, newStats) => {
    setUsers(prevUsers => {
      const updatedUsersList = prevUsers.map(u => {
        if (u.id === technicianId && u.userType === 'technician') {
          const currentStats = u.stats || {};
          const mergedStats = { ...currentStats, ...newStats };
          
          if (typeof mergedStats.completedJobs === 'number' && typeof mergedStats.jobsAppliedTo === 'number' && mergedStats.jobsAppliedTo > 0) {
            mergedStats.jobClosingRate = Math.round((mergedStats.completedJobs / mergedStats.jobsAppliedTo) * 100);
          } else if (typeof mergedStats.completedJobs === 'number' && typeof mergedStats.jobsAppliedTo === 'number' && mergedStats.jobsAppliedTo === 0) {
             mergedStats.jobClosingRate = 0;
          }
          return { ...u, stats: mergedStats, completedJobs: mergedStats.completedJobs !== undefined ? mergedStats.completedJobs : u.completedJobs };
        }
        return u;
      });
      saveUsersToStorage(updatedUsersList);
      
      if (user && user.id === technicianId) {
        const updatedCurrentUser = updatedUsersList.find(u => u.id === technicianId);
        if (updatedCurrentUser) {
          setUser(updatedCurrentUser);
          saveLoggedInUserToStorage(updatedCurrentUser);
        }
      }
      return updatedUsersList;
    });
  }, [user]);


  const value = { user, users, loading, login, logout, register, updateUser, updateUserStats, checkUsernameUnique };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};