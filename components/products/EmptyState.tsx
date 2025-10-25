/**
 * EmptyState Component
 *
 * Displays when no products match the current search/filter criteria.
 * Includes helpful actions: clear filters and popular search suggestions.
 *
 * Design Reference: designs/NoproductFound.html lines 49-67
 *
 * @example
 * ```tsx
 * <EmptyState
 *   hasActiveFilters={filters.categories.size > 0}
 *   onClearFilters={() => dispatch({ type: 'CLEAR_ALL' })}
 *   onSearchClick={(query) => setSearchQuery(query)}
 *   searchQuery="xyz123"
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  readonly hasActiveFilters: boolean;
  readonly onClearFilters: () => void;
  readonly onSearchClick: (query: string) => void;
  readonly searchQuery?: string;
}

/**
 * Popular search suggestions
 * Hardcoded list of common search terms
 */
const POPULAR_SEARCHES: ReadonlyArray<string> = [
  'Organic flour',
  'Steam oven',
  'Round banneton',
  'Artisan bread',
];

/**
 * EmptyState - Displays when no products found
 */
export function EmptyState({
  hasActiveFilters,
  onClearFilters,
  onSearchClick,
  searchQuery,
}: EmptyStateProps) {
  const handleSearchClick = React.useCallback(
    (query: string) => {
      onSearchClick(query);
    },
    [onSearchClick]
  );

  return (
    <div
      className="flex w-full flex-col items-center justify-center py-16 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <Search
        className="h-16 w-16 text-text-muted-light dark:text-text-muted-dark"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mt-6 flex max-w-md flex-col items-center gap-2">
        {/* Heading */}
        <h2 className="font-heading text-2xl font-semibold text-crust dark:text-text-dark">
          No products found
        </h2>

        {/* Description */}
        <p className="text-sm font-normal leading-relaxed text-text-muted-light dark:text-text-muted-dark">
          {searchQuery
            ? `No results for "${searchQuery}". Try adjusting your filters or search for something else.`
            : 'Try adjusting your filters or search for something else.'}
        </p>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="secondary"
          onClick={onClearFilters}
          className="mt-8 w-full max-w-xs"
          aria-label="Clear all active filters"
        >
          Clear all filters
        </Button>
      )}

      {/* Popular Searches */}
      <div className="mt-10 w-full max-w-md text-left">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
          Popular searches:
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {POPULAR_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => handleSearchClick(query)}
              className="text-sm font-normal text-crust dark:text-text-dark underline-offset-4 transition-colors hover:underline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              type="button"
              aria-label={`Search for ${query}`}
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
