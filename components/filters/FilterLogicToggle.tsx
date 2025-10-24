/**
 * FilterLogicToggle Component (BONUS)
 *
 * Toggle switch for changing filter logic mode between AND/OR.
 * Shows visual indicator and tooltip explaining the difference.
 *
 * BONUS FEATURE: Implements advanced filtering logic
 * - AND mode: Products must match ALL selected filters
 * - OR mode: Products must match ANY selected filter
 *
 * @example
 * ```tsx
 * <FilterLogicToggle
 *   logicMode={filters.logicMode}
 *   onLogicModeChange={setLogicMode}
 * />
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { FilterLogic } from '@/types/filters';

/**
 * FilterLogicToggle props
 */
export interface FilterLogicToggleProps {
  /**
   * Current logic mode
   */
  logicMode: FilterLogic;

  /**
   * Callback when logic mode changes
   */
  onLogicModeChange: (mode: FilterLogic) => void;

  /**
   * Additional Tailwind classes
   */
  className?: string;

  /**
   * Show tooltip explanation
   * @default true
   */
  showTooltip?: boolean;
}

/**
 * FilterLogicToggle Component
 * Toggle between AND/OR filter logic modes
 */
export const FilterLogicToggle = React.memo<FilterLogicToggleProps>(
  ({ logicMode, onLogicModeChange, className, showTooltip = true }) => {
    const [showExplanation, setShowExplanation] = React.useState(false);

    const handleToggle = React.useCallback(() => {
      const newMode: FilterLogic = logicMode === 'AND' ? 'OR' : 'AND';
      onLogicModeChange(newMode);
    }, [logicMode, onLogicModeChange]);

    const isAndMode = logicMode === 'AND';

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {/* Toggle Container */}
        <div className="flex items-center justify-between">
          {/* Label */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-text-light dark:text-text-dark">
              Filter Logic
            </span>
            {showTooltip && (
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors duration-200 text-left"
              >
                {showExplanation ? 'Hide explanation' : 'How does this work?'}
              </button>
            )}
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2">
            {/* Mode Badge */}
            <span
              className={cn(
                'px-2 py-1 rounded text-xs font-bold',
                'transition-all duration-300',
                isAndMode
                  ? 'bg-primary/20 text-primary'
                  : 'bg-accent-olive/20 text-accent-olive'
              )}
            >
              {isAndMode ? 'Match All' : 'Match Any'}
            </span>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleToggle}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full',
                'transition-colors duration-300',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary',
                'focus-visible:ring-offset-2',
                isAndMode
                  ? 'bg-primary'
                  : 'bg-accent-olive'
              )}
              role="switch"
              aria-checked={!isAndMode}
              aria-label="Toggle filter logic mode"
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white',
                  'transition-transform duration-300',
                  isAndMode ? 'translate-x-1' : 'translate-x-6'
                )}
              />
            </button>
          </div>
        </div>

        {/* Explanation (expandable) */}
        {showTooltip && showExplanation && (
          <div
            className={cn(
              'p-3 rounded-lg',
              'bg-surface-subtle-light dark:bg-surface-subtle-dark',
              'border border-border-light dark:border-border-dark',
              'animate-fade-in'
            )}
          >
            <div className="flex flex-col gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
              <div>
                <span className="font-bold text-primary">Match All (AND):</span>
                {' '}
                Products must satisfy ALL selected filters simultaneously.
              </div>
              <div>
                <span className="font-bold text-accent-olive">Match Any (OR):</span>
                {' '}
                Products only need to match ANY one of the selected filters.
              </div>
              <div className="mt-1 text-[10px] italic">
                Example: With "Flours" and "Ovens" selected:
                <br />
                • AND mode: Shows nothing (products can't be both)
                <br />
                • OR mode: Shows all flours AND all ovens
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
FilterLogicToggle.displayName = 'FilterLogicToggle';
