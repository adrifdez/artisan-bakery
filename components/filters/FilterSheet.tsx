/**
 * FilterSheet Component (Mobile)
 *
 * Full-screen modal for mobile filter interface.
 * Uses Radix Dialog with sticky header/footer and scrollable content.
 *
 * Design Reference: designs/FiltersModal.html (entire file)
 *
 * @example
 * ```tsx
 * <FilterSheet
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   productCount={42}
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */

'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CategoryFilter } from './CategoryFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { RatingFilter } from './RatingFilter';
import type { FilterState } from '@/types/filters';
import { PRICE_RANGE } from '@/lib/data/helpers';
import { EMPTY_FILTER_STATE } from '@/types/filters';

/**
 * FilterSheet props
 */
export interface FilterSheetProps {
  /**
   * Current filter state
   */
  filters: FilterState;

  /**
   * Callback when filters change
   */
  onFiltersChange: (filters: FilterState) => void;

  /**
   * Number of products matching current filters
   */
  productCount: number;

  /**
   * Dialog open state
   */
  isOpen: boolean;

  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (isOpen: boolean) => void;

  /**
   * Trigger element (button to open modal)
   */
  trigger?: React.ReactNode;
}

/**
 * FilterSheet Component
 * Mobile full-screen filter modal
 */
export const FilterSheet: React.FC<FilterSheetProps> = ({
  filters,
  onFiltersChange,
  productCount,
  isOpen,
  onOpenChange,
  trigger,
}) => {
  // Helper functions for filter updates
  const handleToggleCategory = React.useCallback(
    (category: 'flour' | 'banneton' | 'oven') => {
      const newCategories = new Set(filters.categories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      onFiltersChange({ ...filters, categories: newCategories });
    },
    [filters, onFiltersChange]
  );

  const handlePriceRangeChange = React.useCallback(
    (priceRange: { min: number; max: number }) => {
      onFiltersChange({ ...filters, priceRange });
    },
    [filters, onFiltersChange]
  );

  const handleRatingChange = React.useCallback(
    (minRating: number) => {
      onFiltersChange({ ...filters, minRating });
    },
    [filters, onFiltersChange]
  );

  const handleInStockChange = React.useCallback(
    (checked: boolean) => {
      onFiltersChange({ ...filters, inStock: checked ? true : undefined });
    },
    [filters, onFiltersChange]
  );

  const handleOrganicChange = React.useCallback(
    (checked: boolean) => {
      onFiltersChange({ ...filters, organic: checked ? true : undefined });
    },
    [filters, onFiltersChange]
  );

  const handleClearAll = React.useCallback(() => {
    onFiltersChange(EMPTY_FILTER_STATE);
  }, [onFiltersChange]);

  const handleApply = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {/* Trigger */}
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      {/* Portal for modal */}
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50',
            'bg-gray-900/50',
            'data-[state=open]:animate-fade-in'
          )}
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed inset-0 z-50',
            'flex flex-col',
            'bg-background-light dark:bg-background-dark',
            'text-text-light dark:text-text-dark',
            // Slide-in animation from bottom
            'data-[state=open]:animate-slide-up'
          )}
        >
          {/* Header - Sticky */}
          <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border-light bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className={cn(
                  'p-2 rounded-full',
                  'text-text-light dark:text-text-dark',
                  'hover:bg-surface-subtle-light dark:hover:bg-surface-subtle-dark',
                  'transition-all duration-200',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-primary',
                  'focus-visible:ring-offset-2'
                )}
                aria-label="Close filters"
              >
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>

            {/* Title */}
            <Dialog.Title className="font-heading text-xl font-bold text-text-light dark:text-text-dark">
              Filters
            </Dialog.Title>

            {/* Clear button */}
            <button
              onClick={handleClearAll}
              className={cn(
                'font-semibold text-primary',
                'px-2 py-1 rounded',
                'hover:bg-primary/10',
                'transition-all duration-200',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary',
                'focus-visible:ring-offset-2'
              )}
            >
              Clear
            </button>
          </header>

          {/* Scrollable Content */}
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full">
              <main className="flex flex-col gap-6 p-4 pb-8">
                {/* Category Filter */}
                <CategoryFilter
                  selectedCategories={filters.categories}
                  onToggleCategory={handleToggleCategory}
                />

                {/* Divider */}
                <hr className="border-t border-border-light dark:border-border-dark" />

                {/* Price Range Filter */}
                <PriceRangeFilter
                  priceRange={filters.priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  minPrice={PRICE_RANGE.min}
                  maxPrice={PRICE_RANGE.max}
                />

                {/* Divider */}
                <hr className="border-t border-border-light dark:border-border-dark" />

                {/* Rating Filter */}
                <RatingFilter
                  minRating={filters.minRating}
                  onRatingChange={handleRatingChange}
                />

                {/* Divider */}
                <hr className="border-t border-border-light dark:border-border-dark" />

                {/* More Filters Section */}
                <div>
                  <h3 className="font-heading text-lg font-bold leading-tight tracking-normal text-text-light dark:text-text-dark pb-2 pt-4">
                    MORE FILTERS
                  </h3>
                  <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
                    {/* In Stock Toggle */}
                    <label
                      htmlFor="stock-toggle"
                      className="flex cursor-pointer items-center justify-between py-3"
                    >
                      <span className="text-base text-text-light dark:text-text-dark">
                        In stock only
                      </span>
                      <div className="relative">
                        <input
                          id="stock-toggle"
                          type="checkbox"
                          checked={filters.inStock === true}
                          onChange={(e) => handleInStockChange(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="block h-7 w-12 rounded-full bg-border-light peer-checked:bg-primary dark:bg-border-dark transition-colors duration-200" />
                        <div className="dot absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-full" />
                      </div>
                    </label>

                    {/* Organic Toggle */}
                    <label
                      htmlFor="organic-toggle"
                      className="flex cursor-pointer items-center justify-between py-3"
                    >
                      <span className="text-base text-text-light dark:text-text-dark">
                        Organic only
                      </span>
                      <div className="relative">
                        <input
                          id="organic-toggle"
                          type="checkbox"
                          checked={filters.organic === true}
                          onChange={(e) => handleOrganicChange(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="block h-7 w-12 rounded-full bg-border-light peer-checked:bg-primary dark:bg-border-dark transition-colors duration-200" />
                        <div className="dot absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-full" />
                      </div>
                    </label>
                  </div>
                </div>
              </main>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          {/* Footer - Sticky */}
          <footer className="sticky bottom-0 shrink-0 border-t border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
            <button
              onClick={handleApply}
              className={cn(
                'w-full rounded-lg bg-primary py-3 px-6',
                'text-base font-bold text-white',
                'shadow-lg',
                'transition-all duration-200',
                'hover:bg-primary/90',
                'active:scale-95',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary/50',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background-light',
                'dark:focus-visible:ring-offset-background-dark'
              )}
            >
              Show {productCount} {productCount === 1 ? 'product' : 'products'}
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Display name for React DevTools
FilterSheet.displayName = 'FilterSheet';
