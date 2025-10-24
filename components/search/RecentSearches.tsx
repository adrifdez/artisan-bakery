/**
 * RecentSearches Component
 *
 * Displays recent search history with localStorage persistence.
 * Shows last 5 searches with ability to re-run or remove individual searches.
 *
 * @example
 * ```tsx
 * <RecentSearches
 *   onSearchClick={(query) => {
 *     setSearchQuery(query);
 *     performSearch(query);
 *   }}
 * />
 * ```
 */

'use client';

import { Clock, X, Trash2 } from 'lucide-react';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { cn } from '@/lib/utils/cn';

export interface RecentSearchesProps {
  /**
   * Callback when a recent search is clicked
   */
  onSearchClick: (query: string) => void;

  /**
   * Additional classes for the container
   */
  className?: string;

  /**
   * Maximum number of searches to display
   * @default 5
   */
  maxItems?: number;
}

export function RecentSearches({
  onSearchClick,
  className,
  maxItems = 5,
}: RecentSearchesProps) {
  const { searches, removeSearch, clearAll } = useRecentSearches();

  // Limit to maxItems
  const displaySearches = searches.slice(0, maxItems);

  // Don't render if no searches
  if (displaySearches.length === 0) {
    return null;
  }

  /**
   * Format timestamp to relative time
   */
  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div
      className={cn(
        'rounded-lg',
        'bg-surface-light dark:bg-surface-dark',
        'border border-border-light dark:border-border-dark',
        'p-4',
        'space-y-3',
        // Fade-in animation
        'animate-in fade-in slide-in-from-top-2',
        'duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock
            size={16}
            className="text-text-muted-light dark:text-text-muted-dark"
          />
          <h3 className="text-sm font-medium text-text-light dark:text-text-dark">
            Recent Searches
          </h3>
        </div>

        {/* Clear All Button */}
        <button
          onClick={clearAll}
          className={cn(
            'text-xs',
            'text-text-muted-light dark:text-text-muted-dark',
            'hover:text-text-light dark:hover:text-text-dark',
            'transition-colors',
            'flex items-center gap-1'
          )}
          aria-label="Clear all recent searches"
        >
          <Trash2 size={12} />
          <span>Clear all</span>
        </button>
      </div>

      {/* Search List */}
      <ul className="space-y-2" role="list">
        {displaySearches.map((search, index) => (
          <li
            key={`${search.query}-${search.timestamp}`}
            className={cn(
              'flex items-center justify-between',
              'group',
              'rounded-md',
              'p-2',
              'hover:bg-surface-subtle-light dark:hover:bg-surface-subtle-dark',
              'transition-colors',
              // Staggered fade-in animation
              'animate-in fade-in slide-in-from-left-2',
              `delay-${index * 50}`
            )}
          >
            {/* Search Query (clickable) */}
            <button
              onClick={() => onSearchClick(search.query)}
              className={cn(
                'flex-1',
                'flex items-center gap-3',
                'text-left',
                'text-sm',
                'text-text-light dark:text-text-dark',
                'hover:text-primary',
                'transition-colors',
                'truncate'
              )}
            >
              <span className="truncate font-medium">{search.query}</span>
              {search.resultCount !== undefined && (
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
                  ({search.resultCount} results)
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Timestamp */}
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {formatTimestamp(search.timestamp)}
              </span>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearch(search.query);
                }}
                className={cn(
                  'p-1',
                  'rounded-full',
                  'text-text-muted-light dark:text-text-muted-dark',
                  'hover:text-red-500 dark:hover:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'transition-all',
                  'opacity-0 group-hover:opacity-100'
                )}
                aria-label={`Remove search: ${search.query}`}
              >
                <X size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
