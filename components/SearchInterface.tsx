/**
 * SearchInterface Component
 *
 * Main application component that orchestrates search, filters, and product display.
 * Integrates all sub-components: SearchBar, Filters, ProductGrid, states.
 *
 * Design Reference: designs/searchResults.html (full layout, lines 61-221)
 *
 * Features:
 * - Real-time search with 300ms debouncing
 * - Filter integration (categories, price, rating, stock, organic)
 * - Sort functionality (4 options)
 * - Active filter tags (removable)
 * - RecentSearches dropdown
 * - Loading/Error/Empty states
 *
 * @example
 * ```tsx
 * <SearchInterface />
 * ```
 */

'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SearchBar } from './search/SearchBar';
import { SearchSuggestions } from './search/SearchSuggestions';
import { RecentSearches } from './search/RecentSearches';
import { FilterSheet } from './filters/FilterSheet';
import { FilterTag } from './filters/FilterTag';
import { ProductGrid, EmptyState, ErrorState, createSkeletonArray, SortSelect } from './products';
import type { SortOption } from './products/SortSelect';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchAPI } from '@/hooks/useSearchAPI';
import { useProductIndex } from '@/hooks/useProductIndex';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useFilters } from '@/hooks/useFilters';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { cn } from '@/lib/utils/cn';
import { PRICE_RANGE } from '@/lib/data/helpers';
import type { BakeryProduct } from '@/types/product';

/**
 * Active filter tag structure
 */
interface FilterTagData {
  readonly type: 'category' | 'price' | 'rating' | 'stock' | 'organic';
  readonly label: string;
  readonly onRemove: () => void;
}

/**
 * SearchInterface - Main application component
 */
export function SearchInterface() {
  // ========== State Management ==========
  const [query, setQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [hasFocus, setHasFocus] = React.useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>('relevance');

  // ========== Custom Hooks ==========
  const debouncedQuery = useDebounce(query, 300);
  const {
    filters,
    toggleCategory,
    setPriceRange,
    setMinRating,
    setInStock,
    setOrganic,
    clearAllFilters,
    activeFilterCount,
  } = useFilters();
  const debouncedFilters = useDebounce(filters, 300);

  // Fetch lightweight product index for instant autocomplete (Phase 1)
  const { index } = useProductIndex(debouncedFilters);

  // Fetch full products for enriched results (Phase 2)
  const { products, isLoading, error, refetch } = useSearchAPI(
    debouncedQuery,
    debouncedFilters
  );

  const { searches, addSearch } = useRecentSearches();

  // Track current suggestions for keyboard navigation
  const suggestionsRef = React.useRef<ReadonlyArray<{ text: string }>>([]);

  // Keyboard navigation for suggestions
  const { activeIndex, handleKeyDown: hookHandleKeyDown, reset: resetKeyboardNav } = useKeyboardNavigation({
    itemCount: suggestionsRef.current.length,
    onSelect: (index) => {
      // When Enter is pressed, select the suggestion at the active index
      const suggestion = suggestionsRef.current[index];
      if (suggestion) {
        handleSuggestionSelect(suggestion.text);
      }
    },
    onEscape: () => {
      setShowSuggestions(false);
      resetKeyboardNav();
    },
    isEnabled: showSuggestions && query.length > 0,
  });

  // Wrap keyboard handler to close suggestions on Enter without selection
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // If Enter is pressed without active selection, save query and close suggestions
    if (e.key === 'Enter' && activeIndex === -1 && showSuggestions) {
      e.preventDefault();
      // Save the current query to recent searches
      if (query.trim()) {
        addSearch(query.trim());
      }
      setShowSuggestions(false);
      return;
    }
    // Otherwise use the hook's handler
    hookHandleKeyDown(e);
  }, [hookHandleKeyDown, activeIndex, showSuggestions, query, addSearch]);

  // ========== Search Handlers ==========
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  }, []);

  const handleClearSearch = React.useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setHasFocus(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    // Delay to allow click events on suggestions/recent searches to fire first
    setTimeout(() => {
      setHasFocus(false);
      setShowSuggestions(false);
    }, 200);
  }, []);

  const handleSuggestionSelect = React.useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestions(false);
      if (suggestion.trim()) {
        addSearch(suggestion);
      }
    },
    [addSearch]
  );

  const handleRecentSearchClick = React.useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      setShowSuggestions(false);
      addSearch(searchQuery);
    },
    [addSearch]
  );

  // ========== Filter Tag Management ==========
  const activeFilterTags = React.useMemo((): ReadonlyArray<FilterTagData> => {
    // Category tags - using Array.from + map (immutable)
    const categoryTags = Array.from(filters.categories).map((category): FilterTagData => ({
      type: 'category',
      label: category.charAt(0).toUpperCase() + category.slice(1),
      onRemove: () => toggleCategory(category),
    }));

    // Price range tag - conditional array (immutable)
    const priceTag: ReadonlyArray<FilterTagData> = (
      filters.priceRange.min > PRICE_RANGE.min ||
      filters.priceRange.max < PRICE_RANGE.max
    ) ? [{
      type: 'price',
      label: `$${filters.priceRange.min}-$${filters.priceRange.max}`,
      onRemove: () => setPriceRange({ min: PRICE_RANGE.min, max: PRICE_RANGE.max }),
    }] : [];

    // Rating tag - conditional array (immutable)
    const ratingTag: ReadonlyArray<FilterTagData> = filters.minRating > 0 ? [{
      type: 'rating',
      label: `${filters.minRating}★ & up`,
      onRemove: () => setMinRating(0),
    }] : [];

    // Stock tag - conditional array (immutable)
    const stockTag: ReadonlyArray<FilterTagData> = filters.inStock ? [{
      type: 'stock',
      label: 'In Stock',
      onRemove: () => setInStock(false),
    }] : [];

    // Organic tag - conditional array (immutable)
    const organicTag: ReadonlyArray<FilterTagData> = filters.organic ? [{
      type: 'organic',
      label: 'Organic',
      onRemove: () => setOrganic(false),
    }] : [];

    // Combine all arrays immutably with spread
    return [
      ...categoryTags,
      ...priceTag,
      ...ratingTag,
      ...stockTag,
      ...organicTag,
    ];
  }, [filters, toggleCategory, setPriceRange, setMinRating, setInStock, setOrganic]);

  // ========== Product Sorting ==========
  const sortedProducts = React.useMemo((): ReadonlyArray<BakeryProduct> => {
    if (!products.length) return products;

    switch (sortBy) {
      case 'price-asc':
        return products.toSorted((a, b) => a.price - b.price);
      case 'price-desc':
        return products.toSorted((a, b) => b.price - a.price);
      case 'rating':
        return products.toSorted((a, b) => b.rating - a.rating);
      default:
        // 'relevance' - keep API order (already sorted by relevance score)
        return products;
    }
  }, [products, sortBy]);

  // ========== Render ==========
  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* ========== Sticky Header ========== */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm pt-4">
        <div className="px-4">
          {/* SearchBar with SearchSuggestions */}
          <div className="relative">
            <SearchBar
              value={query}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Search flours, bannetons, ovens..."
            />

            {/* SearchSuggestions - Shows while typing */}
            <SearchSuggestions
              index={index}
              products={products}
              isLoadingProducts={isLoading}
              query={query}
              debouncedQuery={debouncedQuery}
              isOpen={showSuggestions && query.length > 0}
              onSelect={handleSuggestionSelect}
              onClose={() => setShowSuggestions(false)}
              activeIndex={activeIndex}
              onSuggestionsChange={(suggestions) => {
                suggestionsRef.current = suggestions;
              }}
            />

            {/* RecentSearches - Shows when input is empty AND has focus */}
            {!query && hasFocus && searches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30">
                <RecentSearches
                  onSearchClick={handleRecentSearchClick}
                />
              </div>
            )}
          </div>

          {/* Filter Button + Active Tags */}
          <div className="flex items-center gap-2 py-3">
            {/* Filter Button with Count Badge */}
            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className={cn(
                'flex shrink-0 min-w-[84px] cursor-pointer items-center justify-center',
                'overflow-hidden rounded-full h-10 px-4',
                'bg-dough dark:bg-subtle-dark text-text-light dark:text-text-dark',
                'gap-2 text-sm font-bold',
                'transition-colors hover:bg-dough/80 dark:hover:bg-subtle-dark/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
              aria-label={`Open filters (${activeFilterCount} active)`}
            >
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </button>

            {/* Active Filter Tags - Horizontal Scroll */}
            {activeFilterTags.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar" role="list" aria-label="Active filters">
                {activeFilterTags.map((tag, index) => (
                  <div key={`${tag.type}-${index}`} role="listitem">
                    <FilterTag label={tag.label} onRemove={tag.onRemove} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========== Main Content ========== */}
      <main className="flex-1 px-4 py-2">
        {/* Result Count + Sort Dropdown */}
        <div className="flex justify-between items-center pb-4">
          {/* Result Count */}
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">
            {isLoading ? 'Loading...' : `${sortedProducts.length} products found`}
          </p>

          {/* Sort Dropdown */}
          <SortSelect value={sortBy} onValueChange={setSortBy} />
        </div>

        {/* ========== Conditional Content Rendering ========== */}
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 pb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {createSkeletonArray(8).map((skeleton, i) => (
              <div key={i}>{skeleton}</div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            message="Failed to load products. Please check your connection and try again."
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedProducts.length === 0 && (
          <EmptyState
            hasActiveFilters={activeFilterCount > 0}
            onClearFilters={clearAllFilters}
            onSearchClick={handleRecentSearchClick}
            searchQuery={debouncedQuery}
          />
        )}

        {/* Product Grid */}
        {!isLoading && !error && sortedProducts.length > 0 && (
          <ProductGrid products={sortedProducts} searchQuery={debouncedQuery} />
        )}
      </main>

      {/* ========== Filter Sheet Modal ========== */}
      <FilterSheet
        filters={filters}
        onFiltersChange={(newFilters) => {
          // Update filters through individual setter functions
          // This maintains immutability and proper state updates
          const oldCategories = filters.categories;
          const newCategories = newFilters.categories;

          // Update categories if changed - using filter + map instead of forEach
          if (oldCategories !== newCategories) {
            // Add new categories
            Array.from(newCategories)
              .filter((cat) => !oldCategories.has(cat))
              .map((cat) => toggleCategory(cat));

            // Remove old categories
            Array.from(oldCategories)
              .filter((cat) => !newCategories.has(cat))
              .map((cat) => toggleCategory(cat));
          }

          // Update other filters
          if (newFilters.priceRange !== filters.priceRange) {
            setPriceRange(newFilters.priceRange);
          }
          if (newFilters.minRating !== filters.minRating) {
            setMinRating(newFilters.minRating);
          }
          if (newFilters.inStock !== filters.inStock) {
            setInStock(newFilters.inStock);
          }
          if (newFilters.organic !== filters.organic) {
            setOrganic(newFilters.organic);
          }
        }}
        productCount={sortedProducts.length}
        isOpen={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
      />
    </div>
  );
}
