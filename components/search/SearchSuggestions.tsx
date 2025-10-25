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
import { cn } from '@/lib/utils/cn';
import type { BakeryProduct } from '@/types/product';
import type { ProductIndexItem } from '@/hooks/useProductIndex';
import { searchIndex } from '@/hooks/useProductIndex';
import { SearchHighlight } from './SearchHighlight';

export interface SearchSuggestionsProps {
  /**
   * Product index for instant suggestions (Phase 1 - priority)
   * Used when products haven't loaded yet for instant autocomplete
   */
  index: ReadonlyArray<ProductIndexItem>;

  /**
   * Current search results to generate enriched suggestions from (Phase 2)
   * Used when available to provide richer suggestions with more context
   */
  products: ReadonlyArray<BakeryProduct>;

  /**
   * Loading state from the products API
   * When true, use index for instant suggestions
   * When false, use products for enriched suggestions
   */
  isLoadingProducts: boolean;

  /**
   * Raw search query (without debounce) for instant index searching
   * Used for Phase 1 instant suggestions
   */
  query: string;

  /**
   * Debounced search query used by the API
   * Used to detect when we're in debounce period
   */
  debouncedQuery: string;

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
   * Current active index from keyboard navigation
   * Managed by parent (SearchInterface)
   */
  activeIndex: number;

  /**
   * Callback when suggestions change
   * Used by parent to update keyboard navigation and handle Enter key
   */
  onSuggestionsChange?: (suggestions: ReadonlyArray<{ text: string }>) => void;

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
 * Generate suggestions from index (Phase 1 - instant)
 * Uses lightweight index data for immediate autocomplete feedback
 */
function generateSuggestionsFromIndex(
  index: ReadonlyArray<ProductIndexItem>,
  query: string,
  maxSuggestions: number
): Array<Suggestion> {
  if (!query.trim() || index.length === 0) {
    return [];
  }

  // Use the searchIndex function for instant local filtering
  const matches = searchIndex(query, index, maxSuggestions);

  // Convert index items to suggestions
  return matches.map((item) => ({
    text: item.name,
    category: item.category,
    type: 'product' as const,
  }));
}

/**
 * Generate suggestions from products (Phase 2 - enriched)
 * Uses full product data for richer suggestions with more context
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
  index,
  products,
  isLoadingProducts,
  query,
  debouncedQuery,
  isOpen,
  onSelect,
  activeIndex,
  onSuggestionsChange,
  maxSuggestions = 5,
  className,
}: SearchSuggestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Progressive 2-phase strategy for autocomplete:
  // Phase 1 (instant): Use index when in debounce period OR API is loading
  //   - Provides 0ms latency with raw query
  //   - User sees instant feedback while typing
  // Phase 2 (enriched): Use products when API finishes AND debounce complete
  //   - Provides richer context from full product data
  const useInstantSuggestions =
    query !== debouncedQuery ||  // We're in debounce period (query is ahead)
    isLoadingProducts ||         // API is currently loading
    products.length === 0;       // No products available yet

  const suggestions = useInstantSuggestions
    ? generateSuggestionsFromIndex(index, query, maxSuggestions)  // Use raw query for instant search
    : generateSuggestions(products, debouncedQuery, maxSuggestions); // Use debounced query for consistency

  // Use the appropriate query for highlighting based on which phase we're in
  const highlightQuery = useInstantSuggestions ? query : debouncedQuery;

  // Notify parent of suggestions changes for keyboard navigation
  useEffect(() => {
    if (onSuggestionsChange) {
      onSuggestionsChange(suggestions);
    }
  }, [suggestions, onSuggestionsChange]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeItem = containerRef.current.querySelector(
        `[data-suggestion-index="${activeIndex}"]`
      );
      activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

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
                <SearchHighlight text={suggestion.text} query={highlightQuery} />
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
