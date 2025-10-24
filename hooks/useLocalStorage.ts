/**
 * useLocalStorage Hook
 *
 * SSR-safe hook for managing localStorage with JSON serialization.
 * Handles errors gracefully and provides type-safe storage operations.
 *
 * @template T - The type of the value to store
 * @param key - The localStorage key
 * @param initialValue - Initial value if no stored value exists
 * @returns Tuple of [value, setValue, clearValue]
 *
 * @example
 * ```tsx
 * interface UserPreferences {
 *   theme: 'light' | 'dark';
 *   language: string;
 * }
 *
 * const [prefs, setPrefs, clearPrefs] = useLocalStorage<UserPreferences>(
 *   'user-preferences',
 *   { theme: 'light', language: 'en' }
 * );
 * ```
 */

'use client';

import { useState, useCallback } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;
type ClearValue = () => void;

/**
 * Type guard to check if a value is of type T
 * This is a basic check - for production, you might want more sophisticated validation
 */
function isValidType<T>(value: unknown): value is T {
  return value !== null && value !== undefined;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, ClearValue] {
  // Lazy state initialization to avoid SSR issues
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR safety check: localStorage only exists in browser
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      // If no stored value, return initial value
      if (item === null) {
        return initialValue;
      }

      // Parse stored JSON
      const parsed = JSON.parse(item) as unknown;

      // Basic type validation
      return isValidType<T>(parsed) ? parsed : initialValue;
    } catch (error) {
      // If error (invalid JSON, storage full, etc.), return initial value
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * setValue with functional update support and error handling
   */
  const setValue: SetValue<T> = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow functional updates like setState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to localStorage (browser only)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Clear value from both state and localStorage
   */
  const clearValue: ClearValue = useCallback(() => {
    try {
      // Reset to initial value
      setStoredValue(initialValue);

      // Remove from localStorage (browser only)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}
