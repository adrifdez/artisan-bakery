/**
 * Input Component
 *
 * Form input with focus styles and ref support.
 * Extends native HTML input element with custom styling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input type="text" placeholder="Enter text..." />
 *
 * // With ref for focus management
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} placeholder="Search..." />
 * useEffect(() => {
 *   inputRef.current?.focus();
 * }, []);
 *
 * // Email input with validation
 * <Input
 *   type="email"
 *   placeholder="your@email.com"
 *   required
 *   pattern="[^@]+@[^@]+\.[^@]+"
 * />
 *
 * // Controlled input
 * const [value, setValue] = useState('');
 * <Input
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Input props extending native HTML input attributes
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Additional Tailwind classes
   */
  className?: string;
}

/**
 * Input component with forwardRef support
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base input styles from designs/searchResults.html
          'flex w-full',
          'rounded-md',
          'border-none',
          'bg-surface-subtle-light dark:bg-surface-subtle-dark',
          'px-3 py-2',
          // Text styles
          'text-base font-normal leading-normal',
          'text-text-light dark:text-text-dark',
          // Placeholder styles
          'placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
          // Focus styles (no ring by default, but can be added via className)
          'focus:outline-none',
          'focus-visible:outline-none',
          // Disabled styles
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
          // Transition for smooth interactions
          'transition-colors duration-200',
          // Custom classes
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Display name for React DevTools
Input.displayName = 'Input';
