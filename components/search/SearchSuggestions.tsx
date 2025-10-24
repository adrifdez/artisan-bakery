/**
 * SearchSuggestions Component
 *
 * Dropdown with search suggestions generated from current search results.
 * Implements keyboard navigation (arrows, enter, escape) for accessibility.
 *
 * @example
 * ```tsx
 * <SearchSuggestions
 *   products={searchResults}
 *   query={searchQuery}
 *   isOpen={showSuggestions}
 *   onSelect={(suggestion) => {
 *     setSearchQuery(suggestion);
 *     performSearch(suggestion);
 *   }}
 *   onClose={() => setShowSuggestions(false)}
 * />
 * ```
 */

'use client';

import { useEffect, useRef } from 'react';
import { TrendingUp, Package } from 'lucide-react';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { cn } from '@/lib/utils/cn';
import type { BakeryProduct } from '@/types/product';
import { SearchHighlight } from './SearchHighlight';

export interface SearchSuggestionsProps {
  /**
   * Current search results to generate suggestions from
   */
  products: ReadonlyArray<BakeryProduct>;

  /**
   * Current search query (for highlighting)
   */
  query: string;

  /**
   * Whether the suggestions dropdown is open
   */
  isOpen: boolean;

  /**
   * Callback when a suggestion is selected
   */
  onSelect: (suggestion: string) => void;

  /**
   * Callback to close the suggestions dropdown
   */
  onClose: () => void;

  /**
   * Maximum number of suggestions to show
   * @default 5
   */
  maxSuggestions?: number;

  /**
   * Additional classes for the container
   */
  className?: string;
}

/**
 * Suggestion item type
 */
interface Suggestion {
  text: string;
  category?: string;
  type: 'product' | 'category';
}

/**
 * Create a product suggestion
 */
function createProductSuggestion(product: BakeryProduct): Suggestion {
  return {
    text: product.name,
    category: product.category,
    type: 'product',
  };
}

/**
 * Create a category suggestion
 */
function createCategorySuggestion(category: string): Suggestion {
  return {
    text: category.charAt(0).toUpperCase() + category.slice(1),
    category,
    type: 'category',
  };
}

/**
 * Generate suggestions from products
 */
function generateSuggestions(
  products: ReadonlyArray<BakeryProduct>,
  query: string,
  maxSuggestions: number
): Array<Suggestion> {
  if (!query.trim() || products.length === 0) {
    return [];
  }

  // Generate product suggestions (top 3) using map + filter
  const productSuggestions = products
    .slice(0, 3)
    .map(createProductSuggestion)
    .filter((suggestion, index, self) =>
      // Remove duplicates (case-insensitive)
      self.findIndex((s) => s.text.toLowerCase() === suggestion.text.toLowerCase()) === index
    );

  // If we have enough suggestions, return early
  if (productSuggestions.length >= maxSuggestions) {
    return productSuggestions.slice(0, maxSuggestions);
  }

  // Extract unique categories using Set (immutable approach)
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.category))
  );

  // Generate category suggestions
  const categorySuggestions = uniqueCategories
    .map(createCategorySuggestion)
    .filter((suggestion) =>
      // Ensure no duplicates with product suggestions
      !productSuggestions.some(
        (p) => p.text.toLowerCase() === suggestion.text.toLowerCase()
      )
    );

  // Combine and limit to maxSuggestions
  return [...productSuggestions, ...categorySuggestions].slice(0, maxSuggestions);
}

export function SearchSuggestions({
  products,
  query,
  isOpen,
  onSelect,
  onClose,
  maxSuggestions = 5,
  className,
}: SearchSuggestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestions = generateSuggestions(products, query, maxSuggestions);

  // Keyboard navigation
  const { activeIndex, handleKeyDown, reset } = useKeyboardNavigation({
    itemCount: suggestions.length,
    onSelect: (index) => {
      if (suggestions[index]) {
        onSelect(suggestions[index].text);
      }
    },
    onEscape: () => {
      onClose();
      reset();
    },
    isEnabled: isOpen,
  });

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeItem = containerRef.current.querySelector(
        `[data-suggestion-index="${activeIndex}"]`
      );
      activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Don't render if closed or no suggestions
  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        // Positioning
        'absolute top-full left-0 right-0',
        'mt-2',
        'z-50',
        // Styling
        'rounded-lg',
        'bg-surface-light dark:bg-surface-dark',
        'border border-border-light dark:border-border-dark',
        'shadow-lg dark:shadow-2xl',
        'overflow-hidden',
        // Animation
        'animate-in fade-in slide-in-from-top-2',
        'duration-200',
        className
      )}
      role="listbox"
      aria-label="Search suggestions"
    >
      <ul className="max-h-80 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={`${suggestion.text}-${index}`}
            data-suggestion-index={index}
            role="option"
            aria-selected={index === activeIndex}
            onClick={() => onSelect(suggestion.text)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex items-center gap-3',
              'px-4 py-3',
              'cursor-pointer',
              'transition-colors',
              // Active/hover states
              index === activeIndex
                ? 'bg-surface-subtle-light dark:bg-surface-subtle-dark'
                : 'hover:bg-surface-subtle-light dark:hover:bg-surface-subtle-dark',
              // Border between items
              index < suggestions.length - 1 &&
                'border-b border-border-light dark:border-border-dark'
            )}
          >
            {/* Icon based on type */}
            <div className="flex-shrink-0">
              {suggestion.type === 'product' ? (
                <Package
                  size={16}
                  className="text-text-muted-light dark:text-text-muted-dark"
                />
              ) : (
                <TrendingUp
                  size={16}
                  className="text-primary"
                />
              )}
            </div>

            {/* Suggestion text with highlighting */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-light dark:text-text-dark truncate">
                <SearchHighlight text={suggestion.text} query={query} />
              </p>
              {suggestion.type === 'product' && suggestion.category && (
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark capitalize">
                  in {suggestion.category}
                </p>
              )}
            </div>

            {/* Visual indicator for active item */}
            {index === activeIndex && (
              <div className="flex-shrink-0">
                <div className="w-1 h-4 bg-primary rounded-full" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
