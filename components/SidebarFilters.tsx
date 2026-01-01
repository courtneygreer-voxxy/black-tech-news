'use client';

import { Search, X, Filter } from 'lucide-react';
import { NewsCategory } from '@/lib/news/types';

export interface FilterOptions {
  sources: string[];
  categories: NewsCategory[];
  tags: string[];
}

export interface ActiveFilters {
  searchQuery: string;
  selectedSources: string[];
  selectedCategories: NewsCategory[];
  selectedTags: string[];
}

interface SidebarFiltersProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount: number;
  totalCount: number;
}

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  'startups-funding': 'Startups & Funding',
  'careers-opportunities': 'Careers',
  'innovation-products': 'Innovation',
  'community-events': 'Community',
  'policy-impact': 'Policy',
  'general': 'General',
};

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
    activeFilters.selectedCategories.length > 0 ||
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

  const toggleCategory = (category: NewsCategory) => {
    const newCategories = activeFilters.selectedCategories.includes(category)
      ? activeFilters.selectedCategories.filter((c) => c !== category)
      : [...activeFilters.selectedCategories, category];
    onFilterChange({ ...activeFilters, selectedCategories: newCategories });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      selectedSources: [],
      selectedCategories: [],
      selectedTags: [],
    });
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-24 bg-white border-2 border-gray-200 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-black" />
            <h2 className="text-lg font-bold text-black">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={activeFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
            />
          </div>
        </div>

        {/* Categories Filter */}
        {filterOptions.categories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {filterOptions.categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 border-2 border-gray-300 rounded text-black focus:ring-black focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                    {CATEGORY_LABELS[category]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sources Filter */}
        {filterOptions.sources.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Sources ({filterOptions.sources.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filterOptions.sources.map((source) => (
                <label
                  key={source}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.selectedSources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="w-4 h-4 border-2 border-gray-300 rounded text-black focus:ring-black focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                    {source}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold text-black">{resultCount}</span> of{' '}
            <span className="font-semibold text-black">{totalCount}</span>{' '}
            articles
          </div>
        </div>
      </div>
    </aside>
  );
}
