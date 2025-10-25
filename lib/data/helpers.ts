/**
 * Product Data Helpers
 *
 * Computed values and facets derived from the product database
 */

import { MOCK_PRODUCTS } from './products';
import { isFlourProduct, isBannetonProduct, isOvenProduct } from '@/types/product';
import type { ProductCategory, FlourType, BannetonShape, OvenType } from '@/types/product';

/**
 * Unique product categories
 */
export const UNIQUE_CATEGORIES: ReadonlySet<ProductCategory> = new Set(
  MOCK_PRODUCTS.map((p) => p.category)
);

/**
 * Unique flour types from all flour products
 */
export const UNIQUE_FLOUR_TYPES: ReadonlyArray<FlourType> = Array.from(
  new Set(
    MOCK_PRODUCTS.filter(isFlourProduct).map((p) => p.flourType)
  )
);

/**
 * Unique banneton shapes
 */
export const UNIQUE_BANNETON_SHAPES: ReadonlyArray<BannetonShape> = Array.from(
  new Set(
    MOCK_PRODUCTS.filter(isBannetonProduct).map((p) => p.shape)
  )
);

/**
 * Unique oven types
 */
export const UNIQUE_OVEN_TYPES: ReadonlyArray<OvenType> = Array.from(
  new Set(
    MOCK_PRODUCTS.filter(isOvenProduct).map((p) => p.ovenType)
  )
);

/**
 * Price range across all products
 */
export const PRICE_RANGE = {
  min: Math.floor(Math.min(...MOCK_PRODUCTS.map((p) => p.price))),
  max: Math.ceil(Math.max(...MOCK_PRODUCTS.map((p) => p.price))),
} as const;

/**
 * Product count facets by category
 */
export const PRODUCT_FACETS = new Map<ProductCategory, number>([
  ['flour', MOCK_PRODUCTS.filter((p) => p.category === 'flour').length],
  ['banneton', MOCK_PRODUCTS.filter((p) => p.category === 'banneton').length],
  ['oven', MOCK_PRODUCTS.filter((p) => p.category === 'oven').length],
]);

/**
 * Get product count for a specific category
 */
export function getProductCount(category: ProductCategory): number {
  return PRODUCT_FACETS.get(category) ?? 0;
}

/**
 * Stock statistics
 */
export const STOCK_STATS = {
  total: MOCK_PRODUCTS.length,
  inStock: MOCK_PRODUCTS.filter((p) => p.inStock).length,
  outOfStock: MOCK_PRODUCTS.filter((p) => !p.inStock).length,
  inStockPercentage: Math.round(
    (MOCK_PRODUCTS.filter((p) => p.inStock).length / MOCK_PRODUCTS.length) * 100
  ),
} as const;

/**
 * Rating statistics
 */
export const RATING_STATS = {
  average: Number(
    (MOCK_PRODUCTS.reduce((sum, p) => sum + p.rating, 0) / MOCK_PRODUCTS.length).toFixed(1)
  ),
  highest: Math.max(...MOCK_PRODUCTS.map((p) => p.rating)),
  lowest: Math.min(...MOCK_PRODUCTS.map((p) => p.rating)),
} as const;

/**
 * Popular tags (top 10 most common)
 */
export const POPULAR_TAGS: ReadonlyArray<string> = Array.from(
  MOCK_PRODUCTS.flatMap((p) => p.tags)
    .reduce((map, tag) => {
      map.set(tag, (map.get(tag) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
    .entries()
)
  .toSorted((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([tag]) => tag);

/**
 * Get products by category
 */
export function getProductsByCategory(category: ProductCategory): ReadonlyArray<typeof MOCK_PRODUCTS[number]> {
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

/**
 * Get products by price range
 */
export function getProductsByPriceRange(min: number, max: number): ReadonlyArray<typeof MOCK_PRODUCTS[number]> {
  return MOCK_PRODUCTS.filter((p) => p.price >= min && p.price <= max);
}

/**
 * Get products by rating
 */
export function getProductsByRating(minRating: number): ReadonlyArray<typeof MOCK_PRODUCTS[number]> {
  return MOCK_PRODUCTS.filter((p) => p.rating >= minRating);
}

/**
 * Get in-stock products
 */
export function getInStockProducts(): ReadonlyArray<typeof MOCK_PRODUCTS[number]> {
  return MOCK_PRODUCTS.filter((p) => p.inStock);
}

/**
 * Get organic products (flour only)
 */
export function getOrganicProducts(): ReadonlyArray<typeof MOCK_PRODUCTS[number]> {
  return MOCK_PRODUCTS.filter((p) => isFlourProduct(p) && p.organic);
}
