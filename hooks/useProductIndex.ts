/**
 * useProductIndex Hook
 *
 * Fetches and caches a lightweight product index (names + categories only)
 * for instant client-side autocomplete suggestions.
 *
 * The index is automatically updated when filters change, providing
 * filtered suggestions without waiting for the full product API.
 *
 * @param filters - Current filter state
 * @returns Object with index array, loading state, and error
 *
 * @example
 * ```tsx
 * const filters = useFilters();
 * const debouncedFilters = useDebounce(filters, 300);
 * const { index, isLoading, error } = useProductIndex(debouncedFilters);
 *
 * // Use index for instant autocomplete
 * const suggestions = searchIndex(query, index);
 * ```
 */

'use client';

import useSWR from 'swr';
import type { FilterState } from '@/types/filters';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Product index item (minimal data for autocomplete)
 */
export interface ProductIndexItem {
  readonly name: string;
  readonly category: string;
}

/**
 * API response structure from /api/products/index
 */
interface IndexResponse {
  readonly index: ReadonlyArray<ProductIndexItem>;
}

/**
 * Return type for useProductIndex hook
 */
export interface UseProductIndexReturn {
  /**
   * Product index (names + categories)
   * Empty array if loading or error
   */
  readonly index: ReadonlyArray<ProductIndexItem>;

  /**
   * Loading state
   */
  readonly isLoading: boolean;

  /**
   * Error object if request failed
   */
  readonly error: Error | undefined;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Builds the API URL with query parameters from filters
 * Reuses same logic as useSearchAPI for consistency
 */
function buildIndexURL(filters: FilterState): string {
  const params = new URLSearchParams();

  // Add category filters (convert Set to comma-separated string)
  if (filters.categories.size > 0) {
    const categoriesArray = Array.from(filters.categories);
    params.append('categories', categoriesArray.join(','));
  }

  // Add price range filters (only if different from defaults)
  if (filters.priceRange.min > 0) {
    params.append('minPrice', filters.priceRange.min.toString());
  }
  if (filters.priceRange.max < 5000) {
    params.append('maxPrice', filters.priceRange.max.toString());
  }

  // Add rating filter
  if (filters.minRating > 0) {
    params.append('minRating', filters.minRating.toString());
  }

  // Add stock filter
  if (filters.inStock !== undefined) {
    params.append('inStock', filters.inStock.toString());
  }

  // Add organic filter
  if (filters.organic !== undefined) {
    params.append('organic', filters.organic.toString());
  }

  // Build final URL
  const queryString = params.toString();
  return queryString
    ? `/api/products/index?${queryString}`
    : '/api/products/index';
}

/**
 * Fetcher function for SWR
 * Validates response structure with type guard
 */
async function fetcher(url: string): Promise<ReadonlyArray<ProductIndexItem>> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Index API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;

  // Type guard: ensure we got the expected structure
  if (
    typeof data !== 'object' ||
    data === null ||
    !('index' in data) ||
    !Array.isArray((data as Record<string, unknown>).index)
  ) {
    throw new Error('Invalid index API response: expected { index: Array }');
  }

  return (data as IndexResponse).index;
}

/**
 * Normalizes a string for search comparison
 * - Converts to lowercase
 * - Removes diacritics and special characters
 * - Trims whitespace
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}

/**
 * Searches the index locally for matching product names
 * This is the key function that provides instant autocomplete
 *
 * @param query - Search query string
 * @param index - Product index array
 * @param maxResults - Maximum number of results to return
 * @returns Filtered index items matching the query
 */
export function searchIndex(
  query: string,
  index: ReadonlyArray<ProductIndexItem>,
  maxResults = 5
): ReadonlyArray<ProductIndexItem> {
  if (!query.trim() || index.length === 0) {
    return [];
  }

  const normalizedQuery = normalizeString(query);

  // Filter and limit results using immutable patterns
  return index
    .filter((item) => {
      const normalizedName = normalizeString(item.name);
      return normalizedName.includes(normalizedQuery);
    })
    .slice(0, maxResults);
}

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * Hook for fetching and searching product index
 */
export function useProductIndex(filters: FilterState): UseProductIndexReturn {
  // Build the API URL from filters
  const url = buildIndexURL(filters);

  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR<
    ReadonlyArray<ProductIndexItem>,
    Error
  >(url, fetcher, {
    // Revalidate on window focus to ensure fresh data
    revalidateOnFocus: true,

    // Dedupe requests within 5 seconds (longer than search API)
    dedupingInterval: 5000,

    // Keep previous data while revalidating (prevents flash of empty state)
    keepPreviousData: true,

    // Retry once on error
    shouldRetryOnError: true,
    errorRetryCount: 1,
  });

  return {
    index: data ?? [],
    isLoading,
    error,
  };
}
