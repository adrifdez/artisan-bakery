/**
 * Type System Entry Point
 *
 * Centralized exports for all type definitions
 */

// Product types
export type {
  ProductId,
  ProductCategory,
  FlourType,
  BannetonShape,
  BannetonMaterial,
  OvenType,
  OvenFeature,
  BaseProduct,
  FlourProduct,
  BannetonProduct,
  OvenProduct,
  BakeryProduct,
} from './product';

export {
  createProductId,
  isFlourProduct,
  isBannetonProduct,
  isOvenProduct,
  isBakeryProduct,
} from './product';

// Filter types
export type {
  FilterLogic,
  FilterState,
  FilterAction,
  ActiveFilters,
} from './filters';

export {
  EMPTY_FILTER_STATE,
  getActiveFilterCount,
  hasActiveFilters,
} from './filters';

// Search types
export type {
  SearchState,
  SearchResult,
  SearchOptions,
  SearchSuggestion,
  RecentSearch,
} from './search';

export { DEFAULT_SEARCH_OPTIONS } from './search';
