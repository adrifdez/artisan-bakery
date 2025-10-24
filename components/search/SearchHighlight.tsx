/**
 * SearchHighlight Component
 *
 * Highlights matching text within a string based on a search query.
 * Used to emphasize search matches in product names, descriptions, etc.
 *
 * @example
 * ```tsx
 * // Highlight "bread" in "Artisan Bread Flour"
 * <SearchHighlight text="Artisan Bread Flour" query="bread" />
 * // Output: Artisan <mark>Bread</mark> Flour
 *
 * // No match
 * <SearchHighlight text="Banneton Basket" query="flour" />
 * // Output: Banneton Basket (no highlighting)
 *
 * // Case-insensitive
 * <SearchHighlight text="WHOLE WHEAT FLOUR" query="wheat" />
 * // Output: WHOLE <mark>WHEAT</mark> FLOUR
 * ```
 */

'use client';

import { cn } from '@/lib/utils/cn';

interface SearchHighlightProps {
  /**
   * The text to search within
   */
  text: string;

  /**
   * The search query to highlight
   */
  query: string;

  /**
   * Additional classes for the <mark> element
   */
  highlightClassName?: string;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds all matches of query in text (case-insensitive)
 * Returns array of [startIndex, endIndex] tuples
 */
function findMatches(text: string, query: string): Array<[number, number]> {
  if (!query.trim()) {
    return [];
  }

  const escapedQuery = escapeRegExp(query.trim());
  const regex = new RegExp(escapedQuery, 'gi');

  // Use Array.from with matchAll (functional approach)
  return Array.from(text.matchAll(regex), (match) => [
    match.index ?? 0,
    (match.index ?? 0) + match[0].length,
  ]);
}

/**
 * Splits text into segments with highlighting info
 */
interface TextSegment {
  text: string;
  isHighlighted: boolean;
}

function splitTextWithMatches(
  text: string,
  matches: Array<[number, number]>
): Array<TextSegment> {
  if (matches.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  // Use reduce for immutable array building with spread operators only
  const { segments, lastIndex } = matches.reduce<{
    segments: TextSegment[];
    lastIndex: number;
  }>(
    (acc, [start, end]) => {
      // Build array of new segments to add (without mutation)
      const beforeSegment = start > acc.lastIndex
        ? [{ text: text.slice(acc.lastIndex, start), isHighlighted: false }]
        : [];

      const highlightSegment = { text: text.slice(start, end), isHighlighted: true };

      return {
        segments: [...acc.segments, ...beforeSegment, highlightSegment],
        lastIndex: end,
      };
    },
    { segments: [], lastIndex: 0 }
  );

  // Add remaining non-highlighted text
  if (lastIndex < text.length) {
    return [
      ...segments,
      {
        text: text.slice(lastIndex),
        isHighlighted: false,
      },
    ];
  }

  return segments;
}

export function SearchHighlight({
  text,
  query,
  highlightClassName,
}: SearchHighlightProps) {
  const matches = findMatches(text, query);
  const segments = splitTextWithMatches(text, matches);

  return (
    <>
      {segments.map((segment, index) =>
        segment.isHighlighted ? (
          <mark
            key={index}
            className={cn(
              // Base highlight styles
              'bg-primary/20 dark:bg-primary/30',
              'text-text-crust dark:text-text-dark',
              'rounded-sm',
              'px-0.5',
              'font-medium',
              // Custom classes
              highlightClassName
            )}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}
