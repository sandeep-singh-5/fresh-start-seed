import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserCircle, Eye, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '@/hooks/useCustomers';
import { useJobs } from '@/hooks/useJobs.jsx';
import { toast } from '@/components/ui/use-toast';
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog.jsx';
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog.jsx';
import { CustomerList } from '@/components/customers/CustomerList.jsx';
import { CustomerStatsCards } from '@/components/customers/CustomerStatsCards.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';


const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' });
  
  const { customers, addCustomer, deleteCustomer, updateCustomer, addCustomerNote } = useCustomers();
  const { allJobs } = useJobs();

  const sortedCustomers = useMemo(() => {
    let sortableCustomers = [...customers];
    if (sortConfig.key !== null) {
      sortableCustomers.sort((a, b) => {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (!b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;

        if (a[sortConfig.key].toString().toLowerCase() < b[sortConfig.key].toString().toLowerCase()) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key].toString().toLowerCase() > b[sortConfig.key].toString().toLowerCase()) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCustomers;
  }, [customers, sortConfig]);

  const filteredCustomers = sortedCustomers.filter(customer => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const email = customer.email?.toLowerCase() || '';
    const company = customer.company?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search) || company.includes(search);
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 inline ml-1" /> : <ChevronDown className="h-4 w-4 inline ml-1" />;
    }
    return null;
  };

  const handleOpenAddDialog = () => {
    setCustomerToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (customer) => {
    setCustomerToEdit(customer);
    setIsFormDialogOpen(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedCustomer(null);
  };

  const handleSubmitForm = (formData) => {
    try {
      if (customerToEdit) {
        const updated = updateCustomer(customerToEdit.id, formData);
        if (updated && updated.firstName && updated.lastName) {
          toast({ title: "Customer Updated", description: `${updated.firstName} ${updated.lastName} has been updated.` });
          if (selectedCustomer && selectedCustomer.id === updated.id) {
            setSelectedCustomer(updated); 
          }
        } else {
           toast({ title: "Update Error", description: "Failed to update customer. Please try again.", variant: "destructive" });
        }
      } else {
        const newCustomer = addCustomer(formData);
        if (newCustomer && newCustomer.firstName && newCustomer.lastName) {
          toast({ title: "Customer Added", description: `${newCustomer.firstName} ${newCustomer.lastName} has been added.` });
        } else {
          toast({ title: "Add Error", description: "Failed to add customer. Please try again.", variant: "destructive" });
        }
      }
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error("Error in handleSubmitForm:", error);
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      setIsFormDialogOpen(false); 
    }
  };

  const handleDelete = (customerId, customerName) => {
    try {
      deleteCustomer(customerId);
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
      }
      toast({ title: "Customer Deleted", description: `${customerName} has been removed.`, variant: "destructive" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({ title: "Delete Error", description: "Could not delete customer. Please try again.", variant: "destructive" });
    }
  };
  
  const handleAddNoteToCustomer = (customerId, noteText) => {
    try {
      const updatedCustomerWithNote = addCustomerNote(customerId, noteText);
      if (updatedCustomerWithNote) {
        setSelectedCustomer(updatedCustomerWithNote);
        toast({ title: "Note Added", description: "Customer note has been added successfully." });
        return true; 
      }
      toast({ title: "Note Error", description: "Could not add note. Please try again.", variant: "destructive" });
      return false;
    } catch (error) {
      console.error("Error adding note:", error);
      toast({ title: "Note Error", description: "An unexpected error occurred while adding note.", variant: "destructive" });
      return false;
    }
  };

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
    avgRating: customers.length > 0 ? (customers.reduce((sum, c) => sum + (c.rating || 0), 0) / customers.filter(c => c.rating > 0).length || 0) : 0
  };
  
  const statItems = [
    { icon: Eye, label: 'Total Customers', value: stats.totalCustomers, color: 'blue' },
    { icon: UserCircle, label: 'Active Customers', value: stats.activeCustomers, color: 'green' },
    { icon: DollarSign, label: 'Total Revenue', value: `${stats.totalSpent.toFixed(0)}`, color: 'yellow' },
    { icon: Star, label: 'Avg Rating', value: `${stats.avgRating.toFixed(1)}/5`, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCircle className="h-8 w-8 mr-3 text-blue-600"/>Customers
          </h1>
          <p className="text-gray-600 ml-11">Manage your customer relationships and contact information.</p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white self-start sm:self-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomerStatsCards stats={statItems} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <CardTitle>Customer Directory</CardTitle>
            <div className="flex gap-2 items-center">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort By: {sortConfig.key} {getSortIndicator(sortConfig.key)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => requestSort('firstName')}>Name {getSortIndicator('firstName')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => requestSort('createdAt')}>Date Added {getSortIndicator('createdAt')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => requestSort('totalSpent')}>Total Spent {getSortIndicator('totalSpent')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => requestSort('company')}>Company {getSortIndicator('company')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomerList
            customers={filteredCustomers}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleOpenEditDialog}
            onDeleteCustomer={handleDelete}
          />
        </CardContent>
      </Card>

      <CustomerFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        customerData={customerToEdit}
        onSubmit={handleSubmitForm}
      />

      <CustomerDetailsDialog
        isOpen={!!selectedCustomer}
        onOpenChange={handleCloseDetailsDialog}
        customer={selectedCustomer}
        jobs={allJobs.filter(job => selectedCustomer && job.customerId === selectedCustomer.id)}
        onAddNote={handleAddNoteToCustomer}
        onEditCustomer={handleOpenEditDialog}
      />
    </div>
  );
};

export default CustomersPage;