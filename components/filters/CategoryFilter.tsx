/**
 * CategoryFilter Component
 *
 * Multi-select checkbox filter for product categories.
 * Shows product counts for each category.
 *
 * Design Reference: designs/FiltersModal.html lines 63-79
 *
 * @example
 * ```tsx
 * <CategoryFilter
 *   selectedCategories={filters.categories}
 *   onToggleCategory={toggleCategory}
 * />
 * ```
 */

'use client';

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProductCategory } from '@/types/product';
import { getProductCount } from '@/lib/data/helpers';

/**
 * Category display data
 */
interface CategoryOption {
  readonly value: ProductCategory;
  readonly label: string;
}

/**
 * Available categories with labels
 */
const CATEGORY_OPTIONS: ReadonlyArray<CategoryOption> = [
  { value: 'flour', label: 'Flours' },
  { value: 'banneton', label: 'Bannetons' },
  { value: 'oven', label: 'Ovens' },
];

/**
 * CategoryFilter props
 */
export interface CategoryFilterProps {
  /**
   * Set of currently selected categories
   */
  selectedCategories: ReadonlySet<ProductCategory>;

  /**
   * Callback when a category is toggled
   */
  onToggleCategory: (category: ProductCategory) => void;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * CategoryFilter Component
 * Multi-select checkboxes for product categories with counts
 */
export const CategoryFilter = React.memo<CategoryFilterProps>(
  ({ selectedCategories, onToggleCategory, className }) => {
    return (
      <div className={cn('flex flex-col gap-6', className)}>
        {/* Section Header */}
        <h3 className="font-heading text-lg font-bold leading-tight tracking-normal text-text-light dark:text-text-dark pb-2 pt-4">
          CATEGORY
        </h3>

        {/* Category Options */}
        <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
          {CATEGORY_OPTIONS.map((option) => {
            const productCount = getProductCount(option.value);
            const isChecked = selectedCategories.has(option.value);

            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-x-3 py-3 group"
              >
                {/* Radix Checkbox */}
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={() => onToggleCategory(option.value)}
                  className={cn(
                    // Size and shape
                    'h-5 w-5 rounded',
                    // Border
                    'border-2 border-border-light dark:border-border-dark',
                    // Background
                    'bg-transparent',
                    // Checked state
                    'data-[state=checked]:border-primary',
                    'data-[state=checked]:bg-primary',
                    // Focus styles
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-primary',
                    'focus-visible:ring-offset-2',
                    // Transition
                    'transition-all duration-200'
                  )}
                  aria-label={`Filter by ${option.label}`}
                >
                  <Checkbox.Indicator className="flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                {/* Label with count */}
                <p className="text-base font-normal leading-normal text-text-light dark:text-text-dark">
                  {option.label} ({productCount})
                </p>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
);

// Display name for React DevTools
CategoryFilter.displayName = 'CategoryFilter';
