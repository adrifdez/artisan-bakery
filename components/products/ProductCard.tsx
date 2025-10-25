/**
 * ProductCard Component
 *
 * Displays a single product with image, details, rating, price, and stock status.
 * Wrapped in React.memo for performance optimization (rendered in lists).
 *
 * Design Reference: designs/searchResults.html lines 120-220
 *
 * Stock Badge Logic:
 * - Out of Stock (red): !inStock OR stockQuantity === 0 OR stockQuantity === undefined
 * - Low Stock (amber): stockQuantity > 0 AND stockQuantity < 10
 * - In Stock (green): stockQuantity >= 10
 *
 * @example
 * ```tsx
 * <ProductCard product={bakeryProduct} />
 * ```
 */

'use client';

import * as React from 'react';
import { Star, Package, Hourglass, XCircle } from 'lucide-react';
import type { BakeryProduct } from '@/types/product';
import { cn } from '@/lib/utils/cn';
import { SearchHighlight } from '@/components/search/SearchHighlight';

interface ProductCardProps {
  readonly product: BakeryProduct;
  readonly searchQuery?: string;
}

/**
 * Determines stock badge variant based on product stock quantity
 */
function getStockBadge(product: BakeryProduct): {
  readonly label: string;
  readonly icon: React.ElementType;
  readonly className: string;
} {
  // Out of stock: product not in stock OR stockQuantity is 0/undefined
  if (!product.inStock || !product.stockQuantity || product.stockQuantity === 0) {
    return {
      label: 'Out of Stock',
      icon: XCircle,
      className: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    };
  }

  // Low stock: stockQuantity between 1-9
  if (product.stockQuantity < 10) {
    return {
      label: 'Low Stock',
      icon: Hourglass,
      className: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
    };
  }

  // In stock: stockQuantity >= 10
  return {
    label: 'In Stock',
    icon: Package,
    className: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
  };
}

/**
 * Renders star rating with filled/empty stars
 */
const StarRating = React.memo<{ readonly rating: number }>(({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-wheat" aria-label={`Rating: ${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
      ))}
      {hasHalfStar && <Star key="half" className="h-4 w-4 fill-current opacity-50" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

/**
 * ProductCard - Main Component
 */
export const ProductCard = React.memo<ProductCardProps>(({ product, searchQuery }) => {
  const stockBadge = getStockBadge(product);
  const StockIcon = stockBadge.icon;

  return (
    <article
      className={cn(
        // Base styles
        'flex flex-col overflow-hidden rounded-lg',
        'bg-surface-light dark:bg-surface-dark',
        'shadow-subtle',
        // Hover animation
        'transition-transform duration-300 hover:-translate-y-1',
        // Accessibility
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
      )}
      aria-label={`${product.name} by ${product.brand}`}
    >
      {/* Product Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-subtle-light dark:bg-subtle-dark">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 p-4">
        {/* Brand */}
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="font-heading text-lg font-bold text-crust dark:text-text-dark">
          <SearchHighlight text={product.name} query={searchQuery || ''} />
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price & Stock Badge */}
        <div className="flex items-center justify-between pt-2">
          {/* Price */}
          <p className="text-lg font-bold text-crust dark:text-text-dark" aria-label={`Price: ${product.price.toFixed(2)} dollars`}>
            ${product.price.toFixed(2)}
          </p>

          {/* Stock Badge */}
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium',
              stockBadge.className
            )}
            aria-label={`Stock status: ${stockBadge.label}`}
          >
            <StockIcon className="h-4 w-4" aria-hidden="true" />
            <span>{stockBadge.label}</span>
          </div>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
