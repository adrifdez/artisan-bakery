/**
 * SearchBar Component
 *
 * Main search input with search icon and clear button.
 * Implements controlled input pattern with debouncing support.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 *
 * <SearchBar
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery('')}
 *   placeholder="Search flours, bannetons..."
 *   autoFocus
 * />
 * ```
 */

'use client';

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

export interface SearchBarProps {
  /**
   * Current search query value (controlled)
   */
  value: string;

  /**
   * Change handler for input
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Clear handler (optional, if not provided clear button won't show)
   */
  onClear?: () => void;

  /**
   * Placeholder text
   * @default 'Search products...'
   */
  placeholder?: string;

  /**
   * Auto-focus the input on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Additional classes for the container
   */
  className?: string;

  /**
   * Keyboard event handler (for integrating with suggestions)
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search products...',
  autoFocus = false,
  className,
  onKeyDown,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle clear button click
   * Clears the input and refocuses it
   */
  const handleClear = () => {
    onClear?.();
    // Return focus to input after clearing
    inputRef.current?.focus();
  };

  const showClearButton = value.length > 0 && onClear;

  return (
    <div
      className={cn(
        // Container styles from designs/searchResults.html
        'flex w-full items-stretch',
        'rounded-full h-12',
        'bg-surface-subtle-light dark:bg-surface-subtle-dark',
        className
      )}
    >
      {/* Search Icon */}
      <div className="flex items-center justify-center pl-4">
        <Search
          className="text-2xl text-text-muted-light dark:text-text-muted-dark"
          size={24}
          aria-hidden="true"
        />
      </div>

      {/* Search Input */}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          // Override Input component styles for seamless integration
          'flex-1',
          'border-none',
          'bg-transparent',
          'rounded-none',
          'px-2',
          'focus:ring-0',
          'h-full'
        )}
        aria-label="Search products"
        role="searchbox"
        autoComplete="off"
      />

      {/* Clear Button (conditional) */}
      {showClearButton && (
        <div className="flex items-center justify-center pr-4">
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'flex items-center justify-center',
              'rounded-full',
              'p-1',
              'bg-transparent',
              'text-text-muted-light dark:text-text-muted-dark',
              'hover:text-text-light dark:hover:text-text-dark',
              'transition-all duration-200',
              // Scale-in animation
              'animate-in zoom-in-50',
              'cursor-pointer'
            )}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
