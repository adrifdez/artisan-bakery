/**
 * FilterTag Component
 *
 * Displays an active filter as a badge with a remove button.
 * Used to show which filters are currently applied.
 *
 * @example
 * ```tsx
 * <FilterTag
 *   label="Flours"
 *   onRemove={() => removeFilter('flour')}
 * />
 *
 * <FilterTag
 *   label="$10 - $50"
 *   onRemove={() => resetPriceRange()}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * FilterTag props
 */
export interface FilterTagProps {
  /**
   * Display label for the filter
   */
  label: string;

  /**
   * Callback when remove button is clicked
   */
  onRemove: () => void;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * FilterTag Component
 * Badge with X button for removing active filters
 */
export const FilterTag = React.memo<FilterTagProps>(
  ({ label, onRemove, className }) => {
    return (
      <div
        className={cn(
          // Base badge styles
          'inline-flex items-center gap-1.5',
          'px-3 py-1.5',
          'rounded-full',
          // Colors - using filter variant from Badge
          'bg-primary/10 dark:bg-primary/20',
          'text-text-light dark:text-text-dark',
          'text-sm font-medium',
          // Border
          'border border-primary/20 dark:border-primary/30',
          // Animation
          'animate-fade-in',
          // Custom classes
          className
        )}
      >
        <span>{label}</span>
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            // Button reset
            'inline-flex items-center justify-center',
            // Size - 44px touch target for accessibility
            'h-5 w-5',
            'rounded-full',
            // Colors
            'text-text-light/70 dark:text-text-dark/70',
            'hover:text-text-light dark:hover:text-text-dark',
            'hover:bg-primary/20 dark:hover:bg-primary/30',
            // Transitions
            'transition-all duration-200',
            // Scale animation on hover
            'hover:scale-110',
            // Active state
            'active:scale-95',
            // Focus styles
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-1'
          )}
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }
);

// Display name for React DevTools
FilterTag.displayName = 'FilterTag';
