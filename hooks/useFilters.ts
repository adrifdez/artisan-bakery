/**
 * useFilters Hook
 *
 * Custom hook for managing filter state with immutable updates.
 * Uses reducer pattern with discriminated unions for type-safe actions.
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   toggleCategory,
 *   setPriceRange,
 *   setMinRating,
 *   setInStock,
 *   setOrganic,
 *   setLogicMode,
 *   clearAllFilters,
 *   activeFilterCount
 * } = useFilters();
 *
 * // Toggle a category
 * toggleCategory('flour');
 *
 * // Update price range
 * setPriceRange({ min: 10, max: 50 });
 *
 * // Clear all filters
 * clearAllFilters();
 * ```
 */

'use client';

import { useReducer, useCallback, useMemo } from 'react';
import type { FilterState, FilterAction } from '@/types/filters';
import { EMPTY_FILTER_STATE, getActiveFilterCount } from '@/types/filters';
import type { ProductCategory } from '@/types/product';

/**
 * Filter reducer - handles all filter state updates immutably
 */
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };

    case 'ADD_CATEGORY': {
      const newCategories = new Set(state.categories);
      newCategories.add(action.payload);
      return {
        ...state,
        categories: newCategories,
      };
    }

    case 'REMOVE_CATEGORY': {
      const newCategories = new Set(state.categories);
      newCategories.delete(action.payload);
      return {
        ...state,
        categories: newCategories,
      };
    }

    case 'TOGGLE_CATEGORY': {
      const newCategories = new Set(state.categories);
      if (newCategories.has(action.payload)) {
        newCategories.delete(action.payload);
      } else {
        newCategories.add(action.payload);
      }
      return {
        ...state,
        categories: newCategories,
      };
    }

    case 'SET_PRICE_RANGE':
      return {
        ...state,
        priceRange: action.payload,
      };

    case 'SET_MIN_RATING':
      return {
        ...state,
        minRating: action.payload,
      };

    case 'SET_IN_STOCK':
      return {
        ...state,
        inStock: action.payload,
      };

    case 'SET_ORGANIC':
      return {
        ...state,
        organic: action.payload,
      };

    case 'SET_LOGIC_MODE':
      return {
        ...state,
        logicMode: action.payload,
      };

    case 'CLEAR_ALL':
      return EMPTY_FILTER_STATE;

    default:
      return state;
  }
}

/**
 * Return type for useFilters hook
 */
export interface UseFiltersReturn {
  /**
   * Current filter state
   */
  readonly filters: FilterState;

  /**
   * Toggle a category filter (add if not present, remove if present)
   */
  readonly toggleCategory: (category: ProductCategory) => void;

  /**
   * Set multiple categories at once
   */
  readonly setCategories: (categories: ReadonlySet<ProductCategory>) => void;

  /**
   * Update price range filter
   */
  readonly setPriceRange: (range: { min: number; max: number }) => void;

  /**
   * Update minimum rating filter
   */
  readonly setMinRating: (rating: number) => void;

  /**
   * Update stock availability filter
   */
  readonly setInStock: (inStock: boolean | undefined) => void;

  /**
   * Update organic filter
   */
  readonly setOrganic: (organic: boolean | undefined) => void;

  /**
   * Update filter logic mode (AND/OR)
   */
  readonly setLogicMode: (mode: 'AND' | 'OR') => void;

  /**
   * Clear all active filters
   */
  readonly clearAllFilters: () => void;

  /**
   * Number of active filters
   */
  readonly activeFilterCount: number;

  /**
   * Check if any filters are active
   */
  readonly hasActiveFilters: boolean;
}

/**
 * Custom hook for managing filter state
 */
export function useFilters(): UseFiltersReturn {
  const [filters, dispatch] = useReducer(filterReducer, EMPTY_FILTER_STATE);

  // Toggle category (add/remove based on current state)
  const toggleCategory = useCallback((category: ProductCategory) => {
    dispatch({
      type: 'TOGGLE_CATEGORY',
      payload: category,
    });
  }, []); // No dependencies - dispatch is stable

  // Set categories directly
  const setCategories = useCallback((categories: ReadonlySet<ProductCategory>) => {
    dispatch({
      type: 'SET_CATEGORIES',
      payload: categories,
    });
  }, []);

  // Update price range
  const setPriceRange = useCallback((range: { min: number; max: number }) => {
    dispatch({
      type: 'SET_PRICE_RANGE',
      payload: range,
    });
  }, []);

  // Update minimum rating
  const setMinRating = useCallback((rating: number) => {
    dispatch({
      type: 'SET_MIN_RATING',
      payload: rating,
    });
  }, []);

  // Update stock filter
  const setInStock = useCallback((inStock: boolean | undefined) => {
    dispatch({
      type: 'SET_IN_STOCK',
      payload: inStock,
    });
  }, []);

  // Update organic filter
  const setOrganic = useCallback((organic: boolean | undefined) => {
    dispatch({
      type: 'SET_ORGANIC',
      payload: organic,
    });
  }, []);

  // Update logic mode
  const setLogicMode = useCallback((mode: 'AND' | 'OR') => {
    dispatch({
      type: 'SET_LOGIC_MODE',
      payload: mode,
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Calculate active filter count (memoized for performance)
  const activeFilters = useMemo(() => getActiveFilterCount(filters), [filters]);

  return {
    filters,
    toggleCategory,
    setCategories,
    setPriceRange,
    setMinRating,
    setInStock,
    setOrganic,
    setLogicMode,
    clearAllFilters,
    activeFilterCount: activeFilters.total,
    hasActiveFilters: activeFilters.total > 0,
  };
}
