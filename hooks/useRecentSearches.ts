/**
 * useRecentSearches Hook
 *
 * Manages recent search history with localStorage persistence.
 * Maintains a maximum of 5 recent searches with automatic deduplication.
 *
 * @returns Object with recent searches and management functions
 *
 * @example
 * ```tsx
 * const { searches, addSearch, removeSearch, clearAll } = useRecentSearches();
 *
 * // Add a search
 * addSearch('artisan bread flour', 15);
 *
 * // Remove a specific search
 * removeSearch('old search');
 *
 * // Clear all searches
 * clearAll();
 * ```
 */

'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { RecentSearch } from '@/types/search';

const STORAGE_KEY = 'artisan-bakery-recent-searches';
const MAX_ITEMS = 5;

interface UseRecentSearchesReturn {
  /**
   * Array of recent searches, sorted by timestamp (most recent first)
   */
  readonly searches: ReadonlyArray<RecentSearch>;

  /**
   * Add a new search to history (with deduplication)
   */
  addSearch: (query: string, resultCount?: number) => void;

  /**
   * Remove a specific search from history
   */
  removeSearch: (query: string) => void;

  /**
   * Clear all search history
   */
  clearAll: () => void;
}

export function useRecentSearches(): UseRecentSearchesReturn {
  const [searches, setSearches, clearValue] = useLocalStorage<RecentSearch[]>(
    STORAGE_KEY,
    []
  );

  /**
   * Add a search to history with automatic deduplication and limit enforcement
   */
  const addSearch = useCallback(
    (query: string, resultCount?: number) => {
      // Don't add empty queries
      if (!query.trim()) {
        return;
      }

      setSearches((prevSearches) => {
        // Remove duplicate if exists (case-insensitive)
        const normalizedQuery = query.toLowerCase();
        const withoutDuplicates = prevSearches.filter(
          (search) => search.query.toLowerCase() !== normalizedQuery
        );

        // Create new search entry
        const newSearch: RecentSearch = {
          query: query.trim(),
          timestamp: Date.now(),
          resultCount,
        };

        // Add to beginning and limit to MAX_ITEMS
        // Using slice to ensure immutability
        return [newSearch, ...withoutDuplicates].slice(0, MAX_ITEMS);
      });
    },
    [setSearches]
  );

  /**
   * Remove a specific search from history
   */
  const removeSearch = useCallback(
    (query: string) => {
      setSearches((prevSearches) => {
        const normalizedQuery = query.toLowerCase();
        return prevSearches.filter(
          (search) => search.query.toLowerCase() !== normalizedQuery
        );
      });
    },
    [setSearches]
  );

  /**
   * Clear all search history
   */
  const clearAll = useCallback(() => {
    clearValue();
  }, [clearValue]);

  return {
    searches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
