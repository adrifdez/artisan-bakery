/**
 * Filter Type System
 *
 * This module defines types for the advanced filtering system,
 * including OR/AND logic modes and immutable filter state management.
 */

import type { ProductCategory } from './product';
import { PRICE_RANGE } from '@/lib/data/helpers';

/**
 * Filter logic mode for multi-select filters
 * - AND: Match products that satisfy ALL selected filters
 * - OR: Match products that satisfy ANY selected filter
 */
export type FilterLogic = 'AND' | 'OR';

/**
 * Immutable filter state using ReadonlySet for O(1) lookups
 */
export interface FilterState {
  /**
   * Selected product categories (flour, banneton, oven)
   */
  readonly categories: ReadonlySet<ProductCategory>;

  /**
   * Price range filter
   */
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };

  /**
   * Minimum rating filter (0-5 stars)
   */
  readonly minRating: number;

  /**
   * Stock availability filter
   * - undefined: show all products
   * - true: show only in-stock products
   * - false: show only out-of-stock products
   */
  readonly inStock: boolean | undefined;

  /**
   * Organic filter (only applicable to flour products)
   * - undefined: show all products
   * - true: show only organic
   * - false: show only non-organic
   */
  readonly organic: boolean | undefined;

  /**
   * Logic mode for combining multiple category filters
   */
  readonly logicMode: FilterLogic;
}

/**
 * Empty filter state (no filters applied)
 * Uses dynamically calculated price range from product data
 */
export const EMPTY_FILTER_STATE: FilterState = {
  categories: new Set<ProductCategory>(),
  priceRange: {
    min: PRICE_RANGE.min,
    max: PRICE_RANGE.max,
  },
  minRating: 0,
  inStock: undefined,
  organic: undefined,
  logicMode: 'AND',
};

/**
 * Discriminated union for filter actions
 * This pattern ensures type-safe filter updates
 */
export type FilterAction =
  | {
      type: 'SET_CATEGORIES';
      payload: ReadonlySet<ProductCategory>;
    }
  | {
      type: 'ADD_CATEGORY';
      payload: ProductCategory;
    }
  | {
      type: 'REMOVE_CATEGORY';
      payload: ProductCategory;
    }
  | {
      type: 'TOGGLE_CATEGORY';
      payload: ProductCategory;
    }
  | {
      type: 'SET_PRICE_RANGE';
      payload: { min: number; max: number };
    }
  | {
      type: 'SET_MIN_RATING';
      payload: number;
    }
  | {
      type: 'SET_IN_STOCK';
      payload: boolean | undefined;
    }
  | {
      type: 'SET_ORGANIC';
      payload: boolean | undefined;
    }
  | {
      type: 'SET_LOGIC_MODE';
      payload: FilterLogic;
    }
  | {
      type: 'CLEAR_ALL';
    };

/**
 * Helper type to extract active filter count
 */
export interface ActiveFilters {
  readonly categoryCount: number;
  readonly hasPriceFilter: boolean;
  readonly hasRatingFilter: boolean;
  readonly hasStockFilter: boolean;
  readonly hasOrganicFilter: boolean;
  readonly total: number;
}

/**
 * Calculates the number of active filters
 * Uses dynamic price range from product data to determine if price filter is active
 */
export function getActiveFilterCount(state: FilterState): ActiveFilters {
  const categoryCount = state.categories.size;
  const hasPriceFilter =
    state.priceRange.min > PRICE_RANGE.min ||
    state.priceRange.max < PRICE_RANGE.max;
  const hasRatingFilter = state.minRating > 0;
  const hasStockFilter = state.inStock !== undefined;
  const hasOrganicFilter = state.organic !== undefined;

  return {
    categoryCount,
    hasPriceFilter,
    hasRatingFilter,
    hasStockFilter,
    hasOrganicFilter,
    total:
      categoryCount +
      (hasPriceFilter ? 1 : 0) +
      (hasRatingFilter ? 1 : 0) +
      (hasStockFilter ? 1 : 0) +
      (hasOrganicFilter ? 1 : 0),
  };
}

/**
 * Checks if any filters are active
 */
export function hasActiveFilters(state: FilterState): boolean {
  return getActiveFilterCount(state).total > 0;
}
