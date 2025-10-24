/**
 * Button Component
 *
 * Interactive button with multiple variants and sizes.
 * Supports forwardRef for advanced use cases.
 *
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button>Click Me</Button>
 * <Button variant="primary">Primary Action</Button>
 *
 * // Secondary variant
 * <Button variant="secondary">Secondary Action</Button>
 *
 * // Ghost variant (transparent)
 * <Button variant="ghost">Cancel</Button>
 *
 * // Danger variant (destructive actions)
 * <Button variant="danger">Delete</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium (default)</Button>
 * <Button size="lg">Large</Button>
 *
 * // Disabled state
 * <Button disabled>Disabled</Button>
 *
 * // With ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button ref={buttonRef}>Focus Me</Button>
 *
 * // With icon
 * <Button>
 *   <SearchIcon />
 *   <span>Search</span>
 * </Button>
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Button size types
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props extending native HTML button attributes
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Additional Tailwind classes
   */
  className?: string;

  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Variant styles mapping
 * Extracted from designs/searchResults.html and designs/FiltersModal.html
 */
const variantStyles: Record<ButtonVariant, string> = {
  // Primary - main call to action (dough color from designs)
  primary:
    'bg-accent-dough dark:bg-surface-subtle-dark text-text-crust dark:text-text-dark hover:bg-accent-dough/90 dark:hover:bg-surface-subtle-dark/90',

  // Secondary - less prominent actions (primary color with transparency)
  secondary:
    'bg-primary/20 dark:bg-primary/30 text-text-crust dark:text-text-dark hover:bg-primary/30 dark:hover:bg-primary/40',

  // Ghost - minimal visual weight
  ghost:
    'bg-transparent text-text-light dark:text-text-dark hover:bg-surface-subtle-light dark:hover:bg-surface-subtle-dark',

  // Danger - destructive actions
  danger:
    'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Button component with forwardRef support
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        type={type}
        className={cn(
          // Base button styles
          'inline-flex items-center justify-center',
          'rounded-full',
          'font-bold',
          'gap-2',
          // Smooth transitions
          'transition-all duration-200',
          // Focus styles for accessibility
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary',
          'focus-visible:ring-offset-2',
          // Active state (pressed)
          'active:scale-95',
          // Disabled styles
          'disabled:pointer-events-none',
          'disabled:opacity-50',
          // Variant-specific styles
          variantStyles[variant],
          // Size-specific styles
          sizeStyles[size],
          // Custom classes
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Display name for React DevTools
Button.displayName = 'Button';
