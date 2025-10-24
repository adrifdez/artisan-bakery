/**
 * cn() - Class Name Utility
 *
 * Combines multiple class names using clsx and tailwind-merge.
 * Resolves Tailwind class conflicts by keeping the last one.
 *
 * @param inputs - Class names to combine (strings, conditionals, arrays)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn("px-2 py-1", "text-sm") // → "px-2 py-1 text-sm"
 *
 * // Resolves conflicts (last one wins)
 * cn("px-2", "px-4") // → "px-4"
 * cn("text-red-500", "text-blue-500") // → "text-blue-500"
 *
 * // Conditional classes
 * cn("base-class", isActive && "active-class") // → "base-class active-class" if isActive
 * cn("base-class", isActive ? "active" : "inactive") // → ternary support
 *
 * // Arrays and complex conditions
 * cn(["px-4 py-2", "rounded"], { "bg-blue-500": isPrimary }) // → object syntax
 * ```
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
