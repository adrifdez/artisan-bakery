/**
 * PriceRangeFilter Component
 *
 * Dual-handle slider for filtering products by price range.
 * Displays current min/max values as formatted currency.
 *
 * Design Reference: designs/FiltersModal.html lines 107-125
 *
 * @example
 * ```tsx
 * <PriceRangeFilter
 *   priceRange={{ min: 10, max: 500 }}
 *   onPriceRangeChange={(range) => setPriceRange(range)}
 *   minPrice={0}
 *   maxPrice={5000}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils/cn';

/**
 * PriceRangeFilter props
 */
export interface PriceRangeFilterProps {
  /**
   * Current price range
   */
  priceRange: {
    readonly min: number;
    readonly max: number;
  };

  /**
   * Callback when price range changes
   */
  onPriceRangeChange: (range: { min: number; max: number }) => void;

  /**
   * Minimum possible price
   * @default 0
   */
  minPrice?: number;

  /**
   * Maximum possible price
   * @default 5000
   */
  maxPrice?: number;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * Format price as currency
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * PriceRangeFilter Component
 * Dual-handle slider for price range selection
 */
export const PriceRangeFilter = React.memo<PriceRangeFilterProps>(
  ({
    priceRange,
    onPriceRangeChange,
    minPrice = 0,
    maxPrice = 5000,
    className,
  }) => {
    // Handle slider value change
    const handleValueChange = React.useCallback(
      (value: readonly number[]) => {
        // Ensure we have exactly 2 values
        if (value.length === 2) {
          const [min, max] = value;
          if (min !== undefined && max !== undefined) {
            onPriceRangeChange({ min, max });
          }
        }
      },
      [onPriceRangeChange]
    );

    return (
      <div className={cn('flex flex-col gap-6', className)}>
        {/* Section Header */}
        <h3 className="font-heading text-lg font-bold leading-tight tracking-normal text-text-light dark:text-text-dark pb-2 pt-4">
          PRICE RANGE
        </h3>

        {/* Slider Container */}
        <div className="pt-6 pb-2">
          {/* Current values display */}
          <div className="flex justify-between text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
            <span>{formatPrice(priceRange.min)}</span>
            <span>{formatPrice(priceRange.max)}</span>
          </div>

          {/* Radix Slider */}
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[priceRange.min, priceRange.max]}
            onValueChange={handleValueChange}
            min={minPrice}
            max={maxPrice}
            step={1}
            minStepsBetweenThumbs={1}
            aria-label="Price range"
          >
            {/* Track */}
            <Slider.Track className="bg-border-light dark:bg-border-dark relative grow rounded-full h-1.5">
              {/* Range (selected portion) */}
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>

            {/* Thumb 1 (min) */}
            <Slider.Thumb
              className={cn(
                'block w-5 h-5 bg-primary rounded-full',
                'border-2 border-background-light dark:border-background-dark',
                'shadow-lg',
                'hover:scale-110',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary',
                'focus-visible:ring-offset-2',
                'transition-all duration-200',
                'cursor-pointer'
              )}
              aria-label="Minimum price"
            />

            {/* Thumb 2 (max) */}
            <Slider.Thumb
              className={cn(
                'block w-5 h-5 bg-primary rounded-full',
                'border-2 border-background-light dark:border-background-dark',
                'shadow-lg',
                'hover:scale-110',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary',
                'focus-visible:ring-offset-2',
                'transition-all duration-200',
                'cursor-pointer'
              )}
              aria-label="Maximum price"
            />
          </Slider.Root>
        </div>
      </div>
    );
  }
);

// Display name for React DevTools
PriceRangeFilter.displayName = 'PriceRangeFilter';
