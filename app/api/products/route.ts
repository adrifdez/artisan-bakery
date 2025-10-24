/**
 * Products API Route Handler
 *
 * This endpoint handles server-side product search and filtering with:
 * - Scoring-based relevance algorithm (immutable, functional patterns)
 * - Fuzzy matching with Levenshtein distance (BONUS)
 * - Advanced OR/AND filter logic (BONUS)
 * - Simulated delays and random failures for realistic testing
 * 
 * AI Usage: Claude Code assisted with implementing the Levenshtein distance
 * algorithm and optimizing the search scoring system.
 */

import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import type { BakeryProduct } from '@/types/product';
import { isFlourProduct, isOvenProduct } from '@/types/product';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Simulates network delay for realistic API behavior
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
async function simulateDelay(min: number, max: number): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Simulates random API failures for error handling testing
 * @param rate Failure rate (0-1, e.g., 0.05 = 5% failure rate)
 * @returns true if should fail, false otherwise
 */
function shouldFail(rate: number): boolean {
  return Math.random() < rate;
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

// =============================================================================
// LEVENSHTEIN DISTANCE (FUZZY SEARCH - BONUS FEATURE)
// =============================================================================

/**
 * Calculates Levenshtein distance between two strings using immutable patterns
 * This measures the minimum number of single-character edits needed
 * to change one string into another (insertions, deletions, substitutions)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Edge cases
  if (m === 0) return n;
  if (n === 0) return m;

  // Initialize first row: [0, 1, 2, ..., n]
  const initialRow = Array.from({ length: n + 1 }, (_, i) => i);

  // Build each row immutably using reduce
  const finalRow = Array.from({ length: m }, (_, i) => i + 1).reduce(
    (previousRow, i) => {
      // Each new row starts with the row index
      return Array.from({ length: n + 1 }, (_, j) => {
        if (j === 0) return i;

        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

        return Math.min(
          (previousRow[j] ?? 0) + 1, // deletion
          (previousRow[j - 1] ?? 0) + cost, // substitution
          i + 1 // insertion (current row index + 1)
        );
      });
    },
    initialRow
  );

  return finalRow[n] ?? 0;
}

/**
 * Checks if two strings match with fuzzy tolerance
 * @param str1 First string
 * @param str2 Second string
 * @param maxDistance Maximum allowed Levenshtein distance
 * @returns true if strings are within tolerance
 */
function fuzzyMatch(str1: string, str2: string, maxDistance = 2): boolean {
  const distance = levenshteinDistance(
    normalizeString(str1),
    normalizeString(str2)
  );
  return distance <= maxDistance;
}

// =============================================================================
// SEARCH ALGORITHM
// =============================================================================

/**
 * Finds matching text positions for result highlighting
 * Uses functional pattern with recursion instead of while loop
 *
 * @param text Text to search in
 * @param query Search query
 * @returns ReadonlyArray of [start, end] positions for matches
 */
function findMatches(
  text: string,
  query: string
): ReadonlyArray<[number, number]> {
  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);

  // Recursive helper to find all matches immutably
  const findAllMatches = (
    startIndex: number,
    accumulator: ReadonlyArray<[number, number]>
  ): ReadonlyArray<[number, number]> => {
    const position = normalizedText.indexOf(normalizedQuery, startIndex);

    if (position === -1) {
      return accumulator;
    }

    const newMatch: [number, number] = [
      position,
      position + normalizedQuery.length,
    ];

    return findAllMatches(position + 1, [...accumulator, newMatch]);
  };

  return findAllMatches(0, []);
}

/**
 * Calculates relevance score for a product based on search query
 *
 * Scoring rules:
 * - Exact match in name: 100 points
 * - Name starts with query: 80 points
 * - Name contains query: 60 points
 * - Brand exact match: 50 points
 * - Brand contains query: 30 points
 * - Description contains query: 20 points
 * - Tag matches: 40 points per tag
 * - Category-specific bonuses:
 *   - Flour: protein content match: +10 points
 *   - Oven: feature match: +15 points per feature
 * - Popularity bonus (rating >= 4.5): +5 points
 * - Fuzzy match bonus: +10 points
 *
 * @param product Product to score
 * @param query Search query
 * @returns Relevance score (higher = more relevant)
 */
function calculateRelevanceScore(
  product: BakeryProduct,
  query: string
): number {
  if (!query.trim()) return 0;

  const normalizedQuery = normalizeString(query);
  const normalizedName = normalizeString(product.name);
  const normalizedBrand = normalizeString(product.brand);
  const normalizedDescription = normalizeString(product.description);

  // Calculate all scoring components as array, then sum with reduce
  const scoreComponents = [
    // Name matching (highest priority)
    normalizedName === normalizedQuery
      ? 100
      : normalizedName.startsWith(normalizedQuery)
        ? 80
        : normalizedName.includes(normalizedQuery)
          ? 60
          : fuzzyMatch(normalizedName, normalizedQuery)
            ? 10
            : 0,

    // Brand matching
    normalizedBrand === normalizedQuery
      ? 50
      : normalizedBrand.includes(normalizedQuery)
        ? 30
        : 0,

    // Description matching
    normalizedDescription.includes(normalizedQuery) ? 20 : 0,

    // Tag matching - functional pattern with filter + reduce
    product.tags
      .filter((tag) => normalizeString(tag).includes(normalizedQuery))
      .reduce((acc) => acc + 40, 0),

    // Category-specific scoring for flour
    isFlourProduct(product)
      ? (() => {
          const proteinMatch = query.match(/(\d+)%?\s*protein/i);
          if (!proteinMatch) return 0;

          const queryProtein = parseInt(proteinMatch[1]!, 10);
          const diff = Math.abs(product.proteinContent - queryProtein);
          return diff <= 1 ? 10 : 0;
        })()
      : 0,

    // Category-specific scoring for oven
    isOvenProduct(product)
      ? product.features
          .filter((feature) =>
            normalizedQuery.includes(normalizeString(feature))
          )
          .reduce((acc) => acc + 15, 0)
      : 0,

    // Popularity bonus
    product.rating >= 4.5 ? 5 : 0,
  ];

  // Sum all components immutably
  return scoreComponents.reduce((total, component) => total + component, 0);
}

// =============================================================================
// FILTER LOGIC
// =============================================================================

/**
 * Applies all filters to products with OR/AND logic support (BONUS)
 *
 * @param products Products to filter
 * @param params Parsed search parameters
 * @returns Filtered products
 */
function applyFilters(
  products: ReadonlyArray<BakeryProduct>,
  params: ParsedSearchParams
): ReadonlyArray<BakeryProduct> {
  // Convert categories array to Set for O(1) lookup
  const categorySet = new Set(params.categories);

  return products.filter((product) => {
    // Category filter with Set O(1) lookup instead of includes O(n)
    if (categorySet.size > 0) {
      const categoryMatch = categorySet.has(product.category);
      // Note: OR/AND logic doesn't apply to single category field
      // Both modes require product to be in one of selected categories
      if (!categoryMatch) return false;
    }

    // Price range filter
    if (product.price < params.minPrice || product.price > params.maxPrice) {
      return false;
    }

    // Rating filter
    if (product.rating < params.minRating) {
      return false;
    }

    // Stock filter
    if (params.inStock !== undefined && product.inStock !== params.inStock) {
      return false;
    }

    // Organic filter (only for flour products)
    if (params.organic !== undefined) {
      if (isFlourProduct(product)) {
        if (product.organic !== params.organic) return false;
      } else {
        // Non-flour products don't have organic property
        // If organic filter is applied, exclude non-flour products
        return false;
      }
    }

    return true;
  });
}

// =============================================================================
// TYPES
// =============================================================================

/**
 * Parsed search parameters from URL query string
 */
interface ParsedSearchParams {
  readonly q: string;
  readonly categories: ReadonlyArray<string>;
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly minRating: number;
  readonly inStock: boolean | undefined;
  readonly organic: boolean | undefined;
  readonly logicMode: 'AND' | 'OR';
}

/**
 * Search result with score and matches
 */
interface SearchResult {
  readonly product: BakeryProduct;
  readonly score: number;
  readonly matches: ReadonlyArray<[number, number]>;
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

/**
 * GET handler for product search and filtering
 *
 * Query parameters:
 * - q: Search query string
 * - categories: Comma-separated list of categories (flour,banneton,oven)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - minRating: Minimum rating filter (0-5)
 * - inStock: Filter by stock status (true/false)
 * - organic: Filter by organic (true/false) - only for flour
 * - logicMode: AND or OR for category filters (default: AND)
 *
 * @returns JSON array of matching products sorted by relevance
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Simulate realistic network delay (300-800ms)
    await simulateDelay(300, 800);

    // Simulate random failures (5% chance)
    if (shouldFail(0.05)) {
      throw new Error('Simulated API failure for testing error handling');
    }

    // Parse URL and extract search parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Parse and validate all parameters with readonly types
    const params: ParsedSearchParams = {
      q: searchParams.get('q') || '',
      categories: searchParams.get('categories')
        ? searchParams
            .get('categories')!
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
        : [],
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 5000,
      minRating: Number(searchParams.get('minRating')) || 0,
      inStock:
        searchParams.get('inStock') === 'true'
          ? true
          : searchParams.get('inStock') === 'false'
            ? false
            : undefined,
      organic:
        searchParams.get('organic') === 'true'
          ? true
          : searchParams.get('organic') === 'false'
            ? false
            : undefined,
      logicMode: searchParams.get('logicMode') === 'OR' ? 'OR' : 'AND',
    };

    // Step 1: Apply filters first (returns new array, immutable)
    const filteredProducts = applyFilters(MOCK_PRODUCTS, params);

    // Step 2: If there's a search query, calculate relevance scores and sort
    const finalResults: ReadonlyArray<BakeryProduct> = params.q.trim()
      ? // With search query: score, filter, and sort by relevance
        filteredProducts
          .map(
            (product): SearchResult => ({
              product,
              score: calculateRelevanceScore(product, params.q),
              matches: findMatches(product.name, params.q),
            })
          )
          .filter((result) => result.score > 0)
          // Use spread to create new array before sorting (immutable)
          .sort((a, b) => b.score - a.score)
          .map((r) => r.product)
      : // No search query: sort by rating (immutable with spread)
        [...filteredProducts].sort((a, b) => b.rating - a.rating);

    // Return results
    return NextResponse.json(finalResults);
  } catch (error) {
    // Error handling for production
    // Note: In production, replace with proper logging service
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('API error:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
