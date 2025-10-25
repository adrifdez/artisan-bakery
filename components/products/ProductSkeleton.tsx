/**
 * ProductSkeleton Component
 *
 * Loading placeholder that matches ProductCard layout exactly.
 * Uses shimmer animation for smooth loading experience.
 *
 * Design Reference: designs/skeleton.html lines 56-68
 *
 * @example
 * ```tsx
 * // Single skeleton
 * <ProductSkeleton />
 *
 * // Array of skeletons for grid
 * const skeletons = createSkeletonArray(8);
 * ```
 */

'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

/**
 * ProductSkeleton - Single product card loading state
 */
export function ProductSkeleton() {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg',
        'bg-surface-light dark:bg-surface-dark',
        'shadow-subtle'
      )}
      aria-busy="true"
      aria-label="Loading product"
    >
      {/* Image Skeleton */}
      <Skeleton className="aspect-[16/9] w-full" />

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2 p-4">
        {/* Brand Skeleton */}
        <Skeleton className="h-4 w-1/3" />

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Rating Skeleton */}
        <Skeleton className="h-4 w-2/5" />

        {/* Price & Badge Skeleton */}
        <div className="flex items-center justify-between pt-2">
          {/* Price Skeleton */}
          <Skeleton className="h-5 w-20" />

          {/* Badge Skeleton */}
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Creates an array of ProductSkeleton components for grid display
 *
 * @param count - Number of skeleton cards to generate
 * @returns ReadonlyArray of ProductSkeleton components with unique keys
 *
 * @example
 * ```tsx
 * <ProductGrid>
 *   {createSkeletonArray(8).map(skeleton => skeleton)}
 * </ProductGrid>
 * ```
 */
export function createSkeletonArray(count: number): ReadonlyArray<React.ReactElement> {
  return Array.from({ length: count }, (_, index) => (
    <ProductSkeleton key={`skeleton-${index}`} />
  ));
}
