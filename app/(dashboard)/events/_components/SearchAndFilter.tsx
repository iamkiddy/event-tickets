'use client';

import * as React from "react";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { getUtilsCategories, getUtilsEventTypes } from '@/lib/actions/events';
import { UtilsCategoriesResponse, UtilsEventTypesResponse } from '@/lib/models/_events_models';

interface SearchAndFilterProps {
  onSearch: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  initialSearch?: string;
  initialCategory?: string;
  initialEventType?: string;
}

export function SearchAndFilter({ 
  onSearch, 
  onCategoryChange, 
  onTypeChange, 
  initialSearch = '',
  initialCategory = '',
  initialEventType = ''
}: SearchAndFilterProps) {
  const [categories, setCategories] = React.useState<UtilsCategoriesResponse[]>([]);
  const [eventTypes, setEventTypes] = React.useState<UtilsEventTypesResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const containerClasses = "w-full bg-white rounded-xl shadow-sm border border-gray-200 mb-5";
  const inputContainerClasses = "flex-1 relative group";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4";
  const inputClasses = "pl-9 h-10 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:ring-offset-0 transition-all";
  const selectClasses = "h-10 px-4 text-sm rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer outline-none";

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, eventTypesData] = await Promise.all([
          getUtilsCategories(),
          getUtilsEventTypes()
        ]);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setEventTypes(Array.isArray(eventTypesData) ? eventTypesData : []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-4 p-3">
        <div className={inputContainerClasses}>
          <Search className={iconClasses} />
          <Input 
            placeholder="Search events..."
            className={inputClasses}
            onChange={(e) => onSearch(e.target.value)}
            defaultValue={initialSearch}
          />
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <select 
            className={selectClasses}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            disabled={isLoading}
            value={initialCategory}
          >
            <option value="">Any Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select 
            className={selectClasses}
            onChange={(e) => onTypeChange?.(e.target.value)}
            disabled={isLoading}
            value={initialEventType}
          >
            <option value="">Event Type</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 