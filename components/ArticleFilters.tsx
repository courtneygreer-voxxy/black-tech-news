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

interface ArticleFiltersProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount: number;
  totalCount: number;
}

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  'startups-funding': 'Startups & Funding',
  'careers-opportunities': 'Careers & Opportunities',
  'innovation-products': 'Innovation & Products',
  'community-events': 'Community & Events',
  'policy-impact': 'Policy & Impact',
  'general': 'General',
};

export default function ArticleFilters({
  filterOptions,
  activeFilters,
  onFilterChange,
  resultCount,
  totalCount,
}: ArticleFiltersProps) {
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

  const toggleTag = (tag: string) => {
    const newTags = activeFilters.selectedTags.includes(tag)
      ? activeFilters.selectedTags.filter((t) => t !== tag)
      : [...activeFilters.selectedTags, tag];
    onFilterChange({ ...activeFilters, selectedTags: newTags });
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
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, or content..."
            value={activeFilters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-6">
        {/* Sources Filter */}
        {filterOptions.sources.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Sources</h3>
              <span className="text-xs text-gray-500">
                ({filterOptions.sources.length} available)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.sources.map((source) => (
                <button
                  key={source}
                  onClick={() => toggleSource(source)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.selectedSources.includes(source)
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Filter */}
        {filterOptions.categories.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.selectedCategories.includes(category)
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags Filter */}
        {filterOptions.tags.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <span className="text-xs text-gray-500">
                ({filterOptions.tags.length} available)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filterOptions.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.selectedTags.includes(tag)
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Clear Filters */}
      <div className="mt-6 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{resultCount}</span>
          <span className="text-gray-600"> of </span>
          <span className="font-semibold text-gray-900">{totalCount}</span>
          <span className="text-gray-600"> articles</span>
          {hasActiveFilters && (
            <span className="ml-2 text-gray-500">(filtered)</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
