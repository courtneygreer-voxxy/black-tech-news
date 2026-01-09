'use client';

import { Search, X, Filter } from 'lucide-react';

export interface FilterOptions {
  sources: string[];
  tags: string[];
}

export interface ActiveFilters {
  searchQuery: string;
  selectedSources: string[];
  selectedTags: string[];
}

interface SidebarFiltersProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount: number;
  totalCount: number;
}

export default function SidebarFilters({
  filterOptions,
  activeFilters,
  onFilterChange,
  resultCount,
  totalCount,
}: SidebarFiltersProps) {
  const hasActiveFilters =
    activeFilters.searchQuery ||
    activeFilters.selectedSources.length > 0 ||
    activeFilters.selectedTags.length > 0;

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...activeFilters, searchQuery: query });
  };

  const toggleSource = (source: string) => {
    const newSources = activeFilters.selectedSources.includes(source)
      ? activeFilters.selectedSources.filter((s) => s !== source)
      : [...activeFilters.selectedSources, source];
    onFilterChange({ ...activeFilters, selectedSources: newSources });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      selectedSources: [],
      selectedTags: [],
    });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Search Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900">
              Search Articles
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={activeFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-black">{resultCount}</span> of{' '}
            <span className="font-semibold text-black">{totalCount}</span> articles
          </div>
        </div>
      </div>
    </aside>
  );
}
