/**
 * Badge Component
 *
 * Pill-style badge for labels, tags, and status indicators.
 * Supports multiple variants for different use cases.
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // Filter chip (active filter)
 * <Badge variant="filter">Flour</Badge>
 *
 * // Status badges
 * <Badge variant="success">In Stock</Badge>
 * <Badge variant="warning">Low Stock</Badge>
 * <Badge variant="secondary">Featured</Badge>
 * ```
 */

'use client';

import { cn } from '@/lib/utils/cn';

/**
 * Badge variant types
 */
type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'filter';

interface BadgeProps {
  /**
   * Badge content (text or elements)
   */
  children: React.ReactNode;

  /**
   * Visual variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * Variant styles mapping
 * Extracted from designs/searchResults.html
 */
const variantStyles: Record<BadgeVariant, string> = {
  // Default badge - neutral
  default: 'bg-surface-subtle-light dark:bg-surface-subtle-dark text-text-light dark:text-text-dark',

  // Secondary - accent color
  secondary: 'bg-accent-dough dark:bg-accent-dough/80 text-text-crust dark:text-text-light',

  // Success - in stock, positive states
  success: 'bg-accent-olive text-surface-light',

  // Warning - low stock, attention needed
  warning: 'bg-accent-wheat text-text-crust',

  // Filter - active filter chips (primary color with transparency)
  filter: 'bg-primary/20 dark:bg-primary/30 text-text-crust dark:text-text-dark',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles - rounded pill shape
        'inline-flex items-center justify-center',
        'rounded-full px-3 py-1',
        'text-sm font-medium leading-none',
        // Variant-specific styles
        variantStyles[variant],
        // Custom classes
        className
      )}
    >
      {children}
    </span>
  );
}
