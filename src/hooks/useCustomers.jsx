import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth.jsx';

const CustomersContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};

export const CustomersProvider = ({ children }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error("Failed to parse customers from localStorage", error);
        setCustomers([]);
      }
    }
    setLoading(false);
  }, []);

  const saveCustomers = useCallback((updatedCustomers) => {
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  }, []);

  const addCustomer = useCallback((customerData) => {
    const newCustomer = {
      ...customerData,
      id: Date.now().toString(),
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      totalJobs: 0,
      totalSpent: 0,
      lastContact: new Date().toISOString(),
      status: 'active',
      rating: 0,
      notes: []
    };
    const updatedCustomers = [...customers, newCustomer];
    saveCustomers(updatedCustomers);
    return newCustomer;
  }, [customers, user, saveCustomers]);

  const updateCustomer = useCallback((customerId, updates) => {
    let updatedCustomer = null;
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        updatedCustomer = { ...customer, ...updates, lastContact: new Date().toISOString() };
        return updatedCustomer;
      }
      return customer;
    });
    saveCustomers(updatedCustomers);
    return updatedCustomer;
  }, [customers, saveCustomers]);

  const deleteCustomer = useCallback((customerId) => {
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
    saveCustomers(updatedCustomers);
  }, [customers, saveCustomers]);

  const addCustomerNote = useCallback((customerId, noteText) => {
    let notedCustomer = null;
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        notedCustomer = {
          ...customer,
          notes: [
            ...(customer.notes || []),
            {
              id: Date.now().toString(),
              text: noteText,
              createdAt: new Date().toISOString(),
              createdBy: user?.id
            }
          ],
          lastContact: new Date().toISOString()
        };
        return notedCustomer;
      }
      return customer;
    });
    saveCustomers(updatedCustomers);
    return notedCustomer; 
  }, [customers, user, saveCustomers]);
  
  const incrementCustomerJobStats = useCallback((customerId, jobBudget) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          totalJobs: (customer.totalJobs || 0) + 1,
          totalSpent: (customer.totalSpent || 0) + parseFloat(jobBudget || 0),
        };
      }
      return customer;
    });
    saveCustomers(updatedCustomers);
  }, [customers, saveCustomers]);

  const getUserCustomers = useCallback(() => {
    if (!user) return [];
    return customers.filter(customer => customer.createdBy === user.id);
  }, [customers, user]);

  const value = {
    customers: getUserCustomers(),
    allCustomers: customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addCustomerNote,
    incrementCustomerJobStats,
  };

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
};