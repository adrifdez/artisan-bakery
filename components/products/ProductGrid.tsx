/**
 * ProductGrid Component
 *
 * Responsive grid layout for displaying product cards.
 * Automatically adjusts columns based on viewport size:
 * - Mobile (< 768px): 1 column
 * - Tablet (768px - 1023px): 2 columns
 * - Laptop (1024px - 1439px): 3 columns
 * - Desktop (≥ 1440px): 4 columns
 *
 * Design Reference: designs/searchResults.html lines 119-221
 *
 * @example
 * ```tsx
 * <ProductGrid products={bakeryProducts} />
 * ```
 */

'use client';

import * as React from 'react';
import type { BakeryProduct } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  readonly products: ReadonlyArray<BakeryProduct>;
  readonly searchQuery?: string;
}

/**
 * ProductGrid - Displays products in responsive grid layout
 */
export function ProductGrid({ products, searchQuery }: ProductGridProps) {
  // Handle empty products array
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="grid gap-4 pb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label={`${products.length} products`}
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} searchQuery={searchQuery} />
        </div>
      ))}
    </div>
  );
}
