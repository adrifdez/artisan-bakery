/**
 * Product Index API Route Handler
 *
 * Lightweight endpoint that returns only product names and categories
 * for instant client-side autocomplete suggestions.
 *
 * This endpoint applies the same filters as the main products endpoint
 * but returns minimal data (~2KB instead of ~60KB) for fast responses.
 */

import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import type { BakeryProduct } from '@/types/product';
import { isFlourProduct } from '@/types/product';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Product index item (minimal data for autocomplete)
 */
interface ProductIndexItem {
  readonly name: string;
  readonly category: string;
}

/**
 * API response structure
 */
interface IndexResponse {
  readonly index: ReadonlyArray<ProductIndexItem>;
}

/**
 * Parsed search parameters from URL query string
 */
interface ParsedFilterParams {
  readonly categories: ReadonlyArray<string>;
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly minRating: number;
  readonly inStock: boolean | undefined;
  readonly organic: boolean | undefined;
}

// =============================================================================
// FILTER LOGIC (reused from main products route)
// =============================================================================

/**
 * Applies filters to products
 * Same logic as /api/products but optimized for index generation
 */
function applyFilters(
  products: ReadonlyArray<BakeryProduct>,
  params: ParsedFilterParams
): ReadonlyArray<BakeryProduct> {
  // Convert categories array to Set for O(1) lookup
  const categorySet = new Set(params.categories);

  return products.filter((product) => {
    // Category filter
    if (categorySet.size > 0) {
      const categoryMatch = categorySet.has(product.category);
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

/**
 * Converts products to minimal index items
 */
function createIndex(
  products: ReadonlyArray<BakeryProduct>
): ReadonlyArray<ProductIndexItem> {
  return products.map((product) => ({
    name: product.name,
    category: product.category,
  }));
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

/**
 * GET handler for product index
 *
 * Query parameters (same as main products endpoint):
 * - categories: Comma-separated list of categories (flour,banneton,oven)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - minRating: Minimum rating filter (0-5)
 * - inStock: Filter by stock status (true/false)
 * - organic: Filter by organic (true/false) - only for flour
 *
 * @returns JSON object with index array
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // NO SIMULATED DELAY - We need maximum speed for autocomplete

    // Parse URL and extract filter parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Parse and validate all parameters
    const params: ParsedFilterParams = {
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
    };

    // Apply filters to products
    const filteredProducts = applyFilters(MOCK_PRODUCTS, params);

    // Create minimal index (name + category only)
    const index = createIndex(filteredProducts);

    // Return index
    const response: IndexResponse = {
      index,
    };

    return NextResponse.json(response);
  } catch (error) {
    // Error handling
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Product index API error:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch product index',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
