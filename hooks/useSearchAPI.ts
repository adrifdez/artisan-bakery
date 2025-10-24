/**
 * useSearchAPI Hook
 *
 * Server-side search hook with SWR for data fetching, caching, and revalidation.
 * Integrates with the /api/products endpoint for real-time product search and filtering.
 *
 * @param query - Search query string
 * @param filters - Filter state object
 * @returns Object with products array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const [filters, setFilters] = useState(EMPTY_FILTER_STATE);
 * const debouncedQuery = useDebounce(query, 300);
 *
 * const { products, isLoading, error, refetch } = useSearchAPI(
 *   debouncedQuery,
 *   filters
 * );
 * ```
 */

'use client';

import useSWR from 'swr';
import type { BakeryProduct } from '@/types/product';
import type { FilterState } from '@/types/filters';

/**
 * Return type for the useSearchAPI hook
 */
interface UseSearchAPIReturn {
  /**
   * Array of products matching search and filters (empty array if loading or error)
   */
  readonly products: ReadonlyArray<BakeryProduct>;

  /**
   * Loading state (true during initial fetch and revalidation)
   */
  readonly isLoading: boolean;

  /**
   * Error object if request failed
   */
  readonly error: Error | undefined;

  /**
   * Function to manually refetch data
   */
  readonly refetch: () => Promise<BakeryProduct[] | undefined>;
}

/**
 * Builds the API URL with query parameters from search query and filters
 */
function buildSearchURL(query: string, filters: FilterState): string {
  const params = new URLSearchParams();

  // Add search query
  if (query.trim()) {
    params.append('q', query.trim());
  }

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

  // Add logic mode (AND/OR for category filters)
  params.append('logicMode', filters.logicMode);

  // Build final URL
  const queryString = params.toString();
  return queryString ? `/api/products?${queryString}` : '/api/products';
}

/**
 * Fetcher function for SWR
 */
async function fetcher(url: string): Promise<BakeryProduct[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;

  // Type guard: ensure we got an array
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: expected array of products');
  }

  return data as BakeryProduct[];
}

/**
 * Main hook for server-side product search with SWR caching
 */
export function useSearchAPI(
  query: string,
  filters: FilterState
): UseSearchAPIReturn {
  // Build the API URL from query and filters
  const url = buildSearchURL(query, filters);

  // Use SWR for data fetching with caching
  const { data, error, isLoading, mutate } = useSWR<BakeryProduct[], Error>(
    url,
    fetcher,
    {
      // Don't revalidate on window focus (avoid unnecessary API calls)
      revalidateOnFocus: false,

      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,

      // Keep previous data while revalidating (prevents flash of empty state)
      keepPreviousData: true,

      // Don't retry on error (5% failure rate is intentional for testing)
      shouldRetryOnError: false,
    }
  );

  return {
    products: data ?? [],
    isLoading,
    error,
    refetch: mutate,
  };
}
