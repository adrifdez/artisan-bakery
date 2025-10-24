/**
 * RatingFilter Component
 *
 * Filter products by minimum star rating.
 * Shows "X stars & up" options with visual star icons.
 *
 * Design Reference: designs/FiltersModal.html lines 129-154
 *
 * @example
 * ```tsx
 * <RatingFilter
 *   minRating={4}
 *   onRatingChange={(rating) => setMinRating(rating)}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Rating option
 */
interface RatingOption {
  readonly value: number;
  readonly stars: number;
}

/**
 * Available rating options (5★, 4★, 3★, 2★, 1★)
 */
const RATING_OPTIONS: ReadonlyArray<RatingOption> = [
  { value: 5, stars: 5 },
  { value: 4, stars: 4 },
  { value: 3, stars: 3 },
  { value: 2, stars: 2 },
  { value: 1, stars: 1 },
];

/**
 * RatingFilter props
 */
export interface RatingFilterProps {
  /**
   * Current minimum rating filter (0 = no filter)
   */
  minRating: number;

  /**
   * Callback when rating filter changes
   */
  onRatingChange: (rating: number) => void;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * Star display component
 */
const StarDisplay = React.memo<{ count: number; total?: number }>(
  ({ count, total = 5 }) => {
    return (
      <div className="flex items-center text-primary">
        {Array.from({ length: total }).map((_, index) => {
          const isFilled = index < count;
          return (
            <Star
              key={index}
              className={cn(
                'text-xl w-5 h-5',
                isFilled ? 'fill-current' : 'text-border-light dark:text-border-dark'
              )}
            />
          );
        })}
      </div>
    );
  }
);

StarDisplay.displayName = 'StarDisplay';

/**
 * RatingFilter Component
 * Filter by minimum star rating
 */
export const RatingFilter = React.memo<RatingFilterProps>(
  ({ minRating, onRatingChange, className }) => {
    return (
      <div className={cn('flex flex-col gap-6', className)}>
        {/* Section Header */}
        <h3 className="font-heading text-lg font-bold leading-tight tracking-normal text-text-light dark:text-text-dark pb-2 pt-4">
          RATING
        </h3>

        {/* Rating Options */}
        <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
          {RATING_OPTIONS.map((option) => {
            const isChecked = minRating === option.value;

            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-x-3 py-3 group"
              >
                {/* Radix Checkbox */}
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    // Toggle: if already selected, deselect (set to 0)
                    onRatingChange(checked ? option.value : 0);
                  }}
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
                  aria-label={`${option.stars} stars and up`}
                >
                  <Checkbox.Indicator className="flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                {/* Star display */}
                <StarDisplay count={option.stars} />

                {/* "& up" text */}
                <p className="text-base font-normal leading-normal text-text-light dark:text-text-dark">
                  & up
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
RatingFilter.displayName = 'RatingFilter';
