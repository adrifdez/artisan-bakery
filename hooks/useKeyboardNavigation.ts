/**
 * useKeyboardNavigation Hook
 *
 * Provides keyboard navigation support for lists (suggestions, results, menus).
 * Handles ArrowUp, ArrowDown, Enter, Escape, Home, and End keys.
 *
 * @param options - Configuration options for keyboard navigation
 * @returns Object with activeIndex state and handlers
 *
 * @example
 * ```tsx
 * const { activeIndex, setActiveIndex, handleKeyDown } = useKeyboardNavigation({
 *   itemCount: suggestions.length,
 *   onSelect: (index) => selectSuggestion(suggestions[index]),
 *   onEscape: () => closeSuggestions(),
 *   isEnabled: isOpen,
 * });
 *
 * <input onKeyDown={handleKeyDown} />
 * {suggestions.map((item, i) => (
 *   <div className={i === activeIndex ? 'active' : ''}>{item}</div>
 * ))}
 * ```
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Options for keyboard navigation behavior
 */
interface UseKeyboardNavigationOptions {
  /**
   * Total number of navigable items
   */
  readonly itemCount: number;

  /**
   * Callback when Enter is pressed on the active item
   */
  readonly onSelect?: (index: number) => void;

  /**
   * Callback when Escape is pressed
   */
  readonly onEscape?: () => void;

  /**
   * Whether keyboard navigation is currently enabled
   * (e.g., false when dropdown is closed)
   */
  readonly isEnabled?: boolean;

  /**
   * Enable circular navigation (wrap around at ends)
   * @default true
   */
  readonly circular?: boolean;
}

/**
 * Return type for useKeyboardNavigation hook
 */
interface UseKeyboardNavigationReturn {
  /**
   * Current active item index (-1 if none active)
   */
  readonly activeIndex: number;

  /**
   * Function to manually set active index
   */
  setActiveIndex: (index: number) => void;

  /**
   * Keyboard event handler to attach to input or container
   */
  handleKeyDown: (event: React.KeyboardEvent) => void;

  /**
   * Reset active index to -1
   */
  reset: () => void;
}

export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions
): UseKeyboardNavigationReturn {
  const {
    itemCount,
    onSelect,
    onEscape,
    isEnabled = true,
    circular = true,
  } = options;

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const activeIndexRef = useRef<number>(activeIndex);

  // Keep ref in sync with state for event handlers
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  /**
   * Reset to no active item
   */
  const reset = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Don't handle if navigation is disabled or no items
      if (!isEnabled || itemCount === 0) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          setActiveIndex((prev) => {
            if (prev >= itemCount - 1) {
              // At end: wrap to beginning if circular, otherwise stay at end
              return circular ? 0 : itemCount - 1;
            }
            return prev + 1;
          });
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          setActiveIndex((prev) => {
            if (prev <= 0) {
              // At beginning: wrap to end if circular, otherwise stay at beginning
              return circular ? itemCount - 1 : 0;
            }
            return prev - 1;
          });
          break;
        }

        case 'Home': {
          event.preventDefault();
          setActiveIndex(0);
          break;
        }

        case 'End': {
          event.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        }

        case 'Enter': {
          // Only prevent default if we have an active item
          const currentIndex = activeIndexRef.current;
          if (currentIndex >= 0 && currentIndex < itemCount && onSelect) {
            event.preventDefault();
            onSelect(currentIndex);
          }
          break;
        }

        case 'Escape': {
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          reset();
          break;
        }

        default:
          // No action for other keys
          break;
      }
    },
    [isEnabled, itemCount, circular, onSelect, onEscape, reset]
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    reset,
  };
}
