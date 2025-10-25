/**
 * ErrorState Component
 *
 * Displays when an error occurs during product loading/search.
 * Provides a retry action to attempt loading again.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   message="Failed to load products. Please check your connection."
 *   onRetry={() => refetch()}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

/**
 * ErrorState - Displays when an error occurs
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center py-16 px-6 text-center animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <AlertCircle
        className="h-16 w-16 text-red-500 dark:text-red-400"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mt-6 flex max-w-md flex-col items-center gap-2">
        {/* Heading */}
        <h2 className="font-heading text-2xl font-semibold text-crust dark:text-text-dark">
          Oops! Something went wrong
        </h2>

        {/* Error Message */}
        <p className="text-sm font-normal leading-relaxed text-text-muted-light dark:text-text-muted-dark">
          {message}
        </p>
      </div>

      {/* Retry Button */}
      <Button
        variant="primary"
        onClick={onRetry}
        className="mt-8 w-full max-w-xs gap-2"
        aria-label="Try loading products again"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        <span>Try again</span>
      </Button>
    </div>
  );
}
