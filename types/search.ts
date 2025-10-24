/**
 * Search Type System
 *
 * This module defines types for the search system,
 * including search state management, result scoring, and search options.
 */

import type { BakeryProduct } from './product';

/**
 * Discriminated union for search state
 * This pattern ensures type-safe state handling with proper error states
 */
export type SearchState =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
      query: string;
    }
  | {
      status: 'success';
      query: string;
      results: ReadonlyArray<BakeryProduct>;
      resultCount: number;
    }
  | {
      status: 'error';
      query: string;
      error: Error;
    };

/**
 * Search result with relevance scoring and highlighting
 */
export interface SearchResult {
  /**
   * The product that matched the search
   */
  readonly product: BakeryProduct;

  /**
   * Relevance score (0-100)
   * Higher scores indicate better matches
   */
  readonly score: number;

  /**
   * Fields that matched the search query
   * Used for highlighting in the UI
   */
  readonly matches: ReadonlyArray<{
    readonly field: string;
    readonly value: string;
    readonly indices: ReadonlyArray<[number, number]>; // start/end positions for highlighting
  }>;
}

/**
 * Configuration options for search behavior
 */
export interface SearchOptions {
  /**
   * Minimum score threshold for results (0-100)
   * Results below this score will be filtered out
   */
  readonly minScore?: number;

  /**
   * Maximum number of results to return
   */
  readonly limit?: number;

  /**
   * Enable fuzzy matching for typo tolerance
   */
  readonly fuzzy?: boolean;

  /**
   * Maximum Levenshtein distance for fuzzy matching (1-3)
   */
  readonly maxDistance?: number;

  /**
   * Fields to search in (undefined = all fields)
   */
  readonly searchFields?: ReadonlyArray<keyof BakeryProduct>;
}

/**
 * Default search options
 */
export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  minScore: 30,
  limit: 100,
  fuzzy: true,
  maxDistance: 2,
} as const;

/**
 * Search suggestion type for autocomplete
 */
export interface SearchSuggestion {
  /**
   * The suggested search term
   */
  readonly text: string;

  /**
   * Category of the suggestion (if applicable)
   */
  readonly category?: string;

  /**
   * Number of products that match this suggestion
   */
  readonly count?: number;

  /**
   * Type of suggestion
   */
  readonly type: 'product' | 'category' | 'recent' | 'popular';
}

/**
 * Recent search entry
 */
export interface RecentSearch {
  /**
   * The search query
   */
  readonly query: string;

  /**
   * Timestamp when the search was performed
   */
  readonly timestamp: number;

  /**
   * Number of results found (for display)
   */
  readonly resultCount?: number;
}
