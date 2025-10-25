/**
 * Product Type System
 *
 * This module defines the complete type hierarchy for bakery products,
 * including branded types for IDs, discriminated unions for product categories,
 * and type guards for runtime validation.
 */

/**
 * Branded type for Product IDs to prevent mixing with regular strings
 */
export type ProductId = string & { readonly __brand: 'ProductId' };

/**
 * Product categories available in the store
 */
export type ProductCategory = 'flour' | 'banneton' | 'oven';

/**
 * Types of flour available (11 variants)
 */
export type FlourType =
  | 'bread-flour'
  | 'all-purpose'
  | 'whole-wheat'
  | 'rye'
  | 'spelt'
  | 'tipo-00'
  | 'tipo-0'
  | 'semolina'
  | 'durum'
  | 'einkorn'
  | 'kamut';

/**
 * Shape options for bannetons/proofing baskets
 */
export type BannetonShape = 'round' | 'oval' | 'rectangular' | 'baguette' | 'batard';

/**
 * Material options for bannetons
 */
export type BannetonMaterial = 'rattan' | 'cane' | 'wood-pulp' | 'plastic';

/**
 * Oven types available
 */
export type OvenType = 'deck' | 'convection' | 'combi' | 'countertop' | 'pizza';

/**
 * Features available in professional ovens (10 variants)
 */
export type OvenFeature =
  | 'steam-injection'
  | 'stone-deck'
  | 'convection-fan'
  | 'dual-heating'
  | 'programmable-controls'
  | 'multiple-racks'
  | 'glass-door'
  | 'temperature-probe'
  | 'rapid-preheat'
  | 'energy-efficient';

/**
 * Base product interface shared by all product types
 */
export interface BaseProduct {
  readonly id: ProductId;
  readonly name: string;
  readonly brand: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly inStock: boolean;
  readonly stockQuantity?: number; // undefined or 0 = out of stock, 1-9 = low stock, 10+ = in stock
  readonly rating: number; // 0-5 stars
  readonly reviewCount: number;
  readonly tags: ReadonlyArray<string>;
}

/**
 * Flour product with specific attributes
 */
export interface FlourProduct extends BaseProduct {
  readonly category: 'flour';
  readonly flourType: FlourType;
  readonly proteinContent: number; // percentage (8-15%)
  readonly weight: number; // in kg
  readonly origin: string; // country/region
  readonly organic: boolean;
}

/**
 * Banneton/Proofing basket product
 */
export interface BannetonProduct extends BaseProduct {
  readonly category: 'banneton';
  readonly shape: BannetonShape;
  readonly material: BannetonMaterial;
  readonly dimensions: {
    readonly diameter?: number; // cm (for round)
    readonly length?: number; // cm (for oval/rectangular)
    readonly width?: number; // cm (for rectangular)
    readonly height: number; // cm
  };
  readonly capacity: number; // grams of dough
  readonly linerIncluded: boolean;
}

/**
 * Professional oven product
 */
export interface OvenProduct extends BaseProduct {
  readonly category: 'oven';
  readonly ovenType: OvenType;
  readonly features: ReadonlyArray<OvenFeature>;
  readonly dimensions: {
    readonly width: number; // cm
    readonly depth: number; // cm
    readonly height: number; // cm
  };
  readonly powerRequirement: string; // e.g., "220V" or "Gas"
  readonly capacity: string; // description like "4 trays" or "2 decks"
  readonly maxTemperature: number; // Celsius
}

/**
 * Union type representing any bakery product
 * This is a discriminated union using the 'category' field
 */
export type BakeryProduct = FlourProduct | BannetonProduct | OvenProduct;

/**
 * Creates a branded ProductId from a string
 */
export function createProductId(id: string): ProductId {
  return id as ProductId;
}

/**
 * Type guard to check if a product is a FlourProduct
 */
export function isFlourProduct(product: BakeryProduct): product is FlourProduct {
  return product.category === 'flour';
}

/**
 * Type guard to check if a product is a BannetonProduct
 */
export function isBannetonProduct(product: BakeryProduct): product is BannetonProduct {
  return product.category === 'banneton';
}

/**
 * Type guard to check if a product is an OvenProduct
 */
export function isOvenProduct(product: BakeryProduct): product is OvenProduct {
  return product.category === 'oven';
}

/**
 * Validates if an unknown object is a valid BakeryProduct
 * Uses type guards to safely check structure
 */
export function isBakeryProduct(obj: unknown): obj is BakeryProduct {
  if (typeof obj !== 'object' || obj === null) return false;

  const product = obj as Record<string, unknown>;

  // Check base product fields
  if (
    typeof product.id !== 'string' ||
    typeof product.name !== 'string' ||
    typeof product.brand !== 'string' ||
    typeof product.price !== 'number' ||
    typeof product.description !== 'string' ||
    typeof product.imageUrl !== 'string' ||
    typeof product.inStock !== 'boolean' ||
    typeof product.rating !== 'number' ||
    typeof product.reviewCount !== 'number' ||
    !Array.isArray(product.tags)
  ) {
    return false;
  }

  // Check category-specific fields
  const category = product.category;
  if (category !== 'flour' && category !== 'banneton' && category !== 'oven') {
    return false;
  }

  return true;
}
