import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Mail, Phone, Building, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CustomerList = ({ customers, onViewCustomer, onEditCustomer, onDeleteCustomer }) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-2"/>
        No customers found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <motion.div
          key={customer.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex items-center gap-4 flex-1 mb-3 sm:mb-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                  {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-800">{customer.firstName} {customer.lastName}</h3>
                  {customer.status && <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>{customer.status}</Badge>}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  {customer.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{customer.email}</span>}
                  {customer.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{customer.phone}</span>}
                  {customer.company && <span className="flex items-center gap-1"><Building className="h-4 w-4" />{customer.company}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 self-start sm:self-center">
              <Button variant="outline" size="sm" onClick={() => onViewCustomer(customer)}>
                <Eye className="h-4 w-4 mr-1" />View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEditCustomer(customer)}>
                <Edit className="h-4 w-4 mr-1" />Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteCustomer(customer.id, `${customer.firstName} ${customer.lastName}`)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};