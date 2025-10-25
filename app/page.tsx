/**
 * Home Page
 *
 * Main landing page for the Artisan Bakery Supply Store.
 * Displays the search interface with products, filters, and search functionality.
 *
 * Server Component that renders client components (SearchInterface, ErrorBoundary).
 */

import { SearchInterface } from '@/components/SearchInterface';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <SearchInterface />
    </ErrorBoundary>
  );
}
