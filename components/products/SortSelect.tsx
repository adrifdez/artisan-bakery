/**
 * SortSelect Component
 *
 * Custom select component for sorting products using Radix UI Select.
 * Provides a polished dropdown experience with smooth animations and consistent styling.
 *
 * Design Reference: Follows SearchBar and FilterSheet styling patterns
 *
 * Features:
 * - Custom styled dropdown with Radix UI
 * - Smooth animations
 * - Keyboard navigation (arrows, enter, escape)
 * - Dark mode support
 * - Full accessibility (ARIA labels)
 * - Consistent with application design system
 *
 * @example
 * ```tsx
 * <SortSelect
 *   value="relevance"
 *   onValueChange={(value) => setSortBy(value)}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

export interface SortSelectProps {
  /**
   * Current sort value
   */
  value: SortOption;

  /**
   * Callback when sort value changes
   */
  onValueChange: (value: SortOption) => void;

  /**
   * Additional classes for the trigger
   */
  className?: string;
}

/**
 * Sort option configuration
 */
interface SortOptionConfig {
  readonly value: SortOption;
  readonly label: string;
}

const SORT_OPTIONS: ReadonlyArray<SortOptionConfig> = [
  { value: 'relevance', label: 'Sort by: Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

/**
 * SortSelect - Custom dropdown for product sorting
 */
export function SortSelect({ value, onValueChange, className }: SortSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      {/* Trigger Button */}
      <Select.Trigger
        className={cn(
          // Base styles matching SearchBar subtle appearance
          'flex items-center justify-between gap-2',
          'rounded-full h-10 px-4 pr-3',
          'bg-surface-subtle-light dark:bg-surface-subtle-dark',
          'text-text-muted-light dark:text-text-muted-dark',
          'text-sm font-medium',
          'min-w-[180px]',
          // Hover and focus states
          'hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80',
          'transition-colors duration-200',
          // Focus visible (keyboard navigation)
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer',
          className
        )}
        aria-label="Sort products"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark" />
        </Select.Icon>
      </Select.Trigger>

      {/* Dropdown Portal */}
      <Select.Portal>
        <Select.Content
          className={cn(
            // Base styles
            'overflow-hidden',
            'rounded-lg',
            'bg-surface-light dark:bg-surface-dark',
            'shadow-lg',
            // Z-index to appear above other content
            'z-50',
            // Animation
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
          )}
          position="popper"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          <Select.Viewport className="p-1">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

/**
 * SelectItem - Individual item in dropdown
 */
interface SelectItemProps {
  readonly value: string;
  readonly children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children }, forwardedRef) => {
    return (
      <Select.Item
        ref={forwardedRef}
        value={value}
        className={cn(
          // Base styles
          'relative flex items-center justify-between',
          'rounded-md px-3 py-2.5',
          'text-sm font-medium',
          'text-text-light dark:text-text-dark',
          // Hover and focus states
          'hover:bg-primary/10 dark:hover:bg-primary/20',
          'focus:bg-primary/10 dark:focus:bg-primary/20',
          'outline-none',
          // Selected state
          'data-[state=checked]:bg-primary/15 dark:data-[state=checked]:bg-primary/25',
          'data-[state=checked]:text-primary dark:data-[state=checked]:text-primary',
          // Transition
          'transition-colors duration-150',
          'cursor-pointer',
          // Prevent text selection
          'select-none'
        )}
      >
        {/* Item text */}
        <Select.ItemText>{children}</Select.ItemText>

        {/* Check icon for selected item */}
        <Select.ItemIndicator>
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = 'SelectItem';
