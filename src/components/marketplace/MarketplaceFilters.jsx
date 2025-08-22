import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MarketplaceFilters = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, sortBy, setSortBy, categories }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="budget-high">Highest Budget</SelectItem>
          <SelectItem value="budget-low">Lowest Budget</SelectItem>
          <SelectItem value="profit-high">Highest Potential Earnings</SelectItem>
          <SelectItem value="urgent">Most Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MarketplaceFilters;