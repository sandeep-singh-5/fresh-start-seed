import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ServiceProTableRow from '@/components/servicepros/ServiceProTableRow.jsx';

const ServiceProTable = ({ servicePros, expandedRow, toggleRowExpansion, openAddToFavoritesDialog, isServiceProInAnyFavoriteList, onContactServicePro }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-100 transition-colors">
          <TableHead className="w-[50px] py-3 px-4"></TableHead> 
          <TableHead className="min-w-[250px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Pro</TableHead>
          <TableHead className="min-w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Skills</TableHead>
          <TableHead className="min-w-[180px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</TableHead>
          <TableHead className="min-w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</TableHead>
          <TableHead className="min-w-[200px] py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicePros.map((pro) => (
          <ServiceProTableRow
            key={pro.id}
            pro={pro}
            expandedRow={expandedRow}
            toggleRowExpansion={toggleRowExpansion}
            openAddToFavoritesDialog={openAddToFavoritesDialog}
            isServiceProInAnyFavoriteList={isServiceProInAnyFavoriteList}
            onContact={onContactServicePro}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceProTable;