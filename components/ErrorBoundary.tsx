/**
 * ErrorBoundary Component
 *
 * React Error Boundary class component that catches JavaScript errors
 * anywhere in the component tree and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * Features:
 * - Catches runtime errors in child components
 * - Displays user-friendly error message
 * - Provides reset button to recover
 * - Logs errors in development mode
 * - Full accessibility support
 *
 * Note: Error boundaries do NOT catch errors in:
 * - Event handlers (use try-catch instead)
 * - Asynchronous code (setTimeout, promises)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 */

'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * ErrorBoundary - Class component for catching React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Log error details (in development mode)
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // In development, log full error details
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you could send to error tracking service (Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset error boundary state
   */
  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark p-6">
          <div className="flex max-w-md flex-col items-center text-center">
            {/* Error Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>

            {/* Error Message */}
            <h1 className="mb-3 font-heading text-2xl font-bold text-crust dark:text-text-dark">
              Oops! Something went wrong
            </h1>

            <p className="mb-2 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 w-full rounded-lg bg-subtle-light dark:bg-subtle-dark p-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-text-light dark:text-text-dark">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 overflow-x-auto text-xs text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}

            {/* Reset Button */}
            <button
              onClick={this.handleReset}
              className={cn(
                'flex w-full max-w-xs items-center justify-center gap-2',
                'rounded-lg bg-primary px-6 py-3',
                'text-sm font-bold text-white',
                'transition-colors hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
              )}
              aria-label="Try again"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Try again</span>
            </button>

            {/* Help Text */}
            <p className="mt-4 text-xs text-text-muted-light dark:text-text-muted-dark">
              If this problem persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    // No error, render children
    return this.props.children;
  }
}
