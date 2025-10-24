/**
 * Skeleton Component
 *
 * Loading placeholder with shimmer animation.
 * Uses Tailwind's built-in shimmer keyframe animation.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="h-4 w-32" />
 *
 * // Product card skeleton
 * <div className="space-y-4">
 *   <Skeleton className="h-48 w-full" /> // Image
 *   <Skeleton className="h-4 w-24" />    // Brand
 *   <Skeleton className="h-6 w-3/4" />   // Title
 *   <Skeleton className="h-5 w-20" />    // Price
 * </div>
 *
 * // Circular skeleton
 * <Skeleton className="h-10 w-10 rounded-full" />
 * ```
 */

'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  /**
   * Additional Tailwind classes for custom sizing/styling
   */
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        // Base shimmer animation styles
        'animate-shimmer rounded',
        // Background gradient for shimmer effect
        'bg-gradient-to-r from-surface-subtle-light via-surface-light to-surface-subtle-light',
        'dark:from-surface-subtle-dark dark:via-surface-dark dark:to-surface-subtle-dark',
        // Set background size for smooth animation
        'bg-[length:200%_100%]',
        // Custom classes
        className
      )}
      aria-live="polite"
      aria-busy="true"
    />
  );
}
