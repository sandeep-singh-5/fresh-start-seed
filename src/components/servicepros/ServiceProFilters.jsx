import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ServiceProFilters = ({
  searchTerm,
  setSearchTerm,
  skillFilter,
  setSkillFilter,
  ratingFilter,
  setRatingFilter,
  sortOption,
  setSortOption,
  availableSkills,
  ratingOptions,
  sortOptions
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name, company, skill, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-2.5 text-base"
          />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full py-2.5 text-base">
            <SelectValue placeholder="Filter by Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Skills">All Skills</SelectItem>
            {Array.isArray(availableSkills) && availableSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter.toString()} onValueChange={(val) => setRatingFilter(parseInt(val))}>
          <SelectTrigger className="w-full py-2.5 text-base">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mb-4">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-auto sm:min-w-[200px] py-2.5 text-base">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ServiceProFilters;