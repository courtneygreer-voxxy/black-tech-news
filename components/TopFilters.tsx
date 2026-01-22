'use client';

import { useState } from 'react';

export interface TopFiltersProps {
  sources: string[];
  activeSource: string | null;
  searchQuery: string;
  onSourceChange: (source: string | null) => void;
  onSearchChange: (query: string) => void;
}

export default function TopFilters({
  sources,
  activeSource,
  searchQuery,
  onSourceChange,
  onSearchChange,
}: TopFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Source Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <button
          onClick={() => onSourceChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSource === null
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>

        {/* Source chips */}
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => onSourceChange(source)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSource === source
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  );
}
