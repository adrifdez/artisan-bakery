/**
 * Card Component
 *
 * Container component with border, shadow, and hover effects.
 * Used for product cards, content sections, and grouped elements.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 *
 * // Product card with hover
 * <Card className="cursor-pointer">
 *   <img src="product.jpg" alt="Product" />
 *   <div className="p-4">
 *     <h3>Product Name</h3>
 *     <p>$19.99</p>
 *   </div>
 * </Card>
 *
 * // Card without hover effect
 * <Card hover={false}>
 *   Static content...
 * </Card>
 * ```
 */

'use client';

import { cn } from '@/lib/utils/cn';

interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Enable hover scale effect
   * @default true
   */
  hover?: boolean;

  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;

  /**
   * Additional Tailwind classes
   */
  className?: string;
}

export function Card({
  children,
  hover = true,
  onClick,
  className,
}: CardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base card styles from designs/skeleton.html
        'rounded-lg',
        'bg-surface-light dark:bg-surface-dark',
        'shadow-[0_0_4px_rgba(0,0,0,0.1)]',
        'dark:shadow-[0_0_8px_rgba(0,0,0,0.3)]',
        'overflow-hidden',
        // Hover effect (smooth scale up)
        hover && 'transition-transform duration-200',
        hover && 'hover:scale-[1.02]',
        // Interactive styles
        isInteractive && 'cursor-pointer',
        // Focus styles for accessibility
        isInteractive && 'focus-visible:outline-none',
        isInteractive && 'focus-visible:ring-2',
        isInteractive && 'focus-visible:ring-primary',
        isInteractive && 'focus-visible:ring-offset-2',
        // Custom classes
        className
      )}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
