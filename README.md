# Artisan Bakery Supply Store

A modern, real-time product search interface for professional bakers, built with Next.js 14, TypeScript, and Tailwind CSS. This application showcases advanced search capabilities, intelligent filtering, and a delightful user experience for browsing premium flours, proofing baskets (bannetons), and professional ovens.

## Live Demo

**[View Live Demo →](https://artisan-bakery-vercel.vercel.app/)**

![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Bundle Size](https://img.shields.io/badge/bundle-170kB-success)

## Features

### Real-Time Search
- **Instant search** with 300ms debouncing for optimal performance
- **Search suggestions/autocomplete** that appear as you type
- **Keyboard navigation** (Arrow keys, Enter, Escape)
- **Recent searches** tracking (last 5 searches, stored in localStorage)
- **Search result highlighting** for better visibility
- **Fuzzy search** with Levenshtein distance algorithm for typo tolerance
- Edge case handling (empty queries, special characters, long queries)

### Advanced Filter System
- **Multiple filter types**: Category, price range, rating, stock status, organic certification
- **Active filter tags** with individual removal capability
- **"Clear all filters" functionality**
- **Seamless integration** with search functionality

### Code Quality
- **TypeScript strict mode** - Zero `any` types throughout the codebase
- **Immutability patterns** - No direct mutations, using spread operators and immutable array methods
- **Modern ES2023 array methods** - `.toSorted()`, `.toReversed()`, `.toSpliced()`
- **O(n) algorithmic complexity** - Using `Set` and `Map` for efficient lookups
- **React.memo** optimization for list items
- **Accessibility** - Full ARIA labels, keyboard navigation, WCAG AA compliance

### UI/UX
- **Responsive design** - Mobile-first approach (320px to 1440px+)
- **Skeleton loading states** - Smooth shimmer animations instead of spinners
- **Empty states** - Helpful messages when no results found
- **Error handling** - User-friendly error messages with retry buttons
- **Warm artisan theme** - Custom bakery color palette with bread crust tones

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI (headless/unstyled only)
- **Icons**: lucide-react
- **State Management**: Custom React hooks (no Redux/Zustand)
- **Data Fetching**: SWR for caching and revalidation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/adrifdez/artisan-bakery.git
cd artisan-bakery

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start

# Type check
npx tsc --noEmit
```

## Project Structure

```
artisan-bakery/
├── app/
│   ├── api/
│   │   └── products/         # API route handlers
│   ├── layout.tsx            # Root layout with fonts
│   └── page.tsx              # Home page (server component)
├── components/
│   ├── SearchInterface.tsx   # Main orchestrator component
│   ├── filters/              # Filter components
│   ├── products/             # Product display components
│   └── search/               # Search components
├── hooks/
│   ├── useSearchAPI.ts       # Server-side search with SWR
│   ├── useDebounce.ts        # Generic debounce hook
│   ├── useLocalStorage.ts    # SSR-safe localStorage
│   ├── useRecentSearches.ts  # Recent searches management
│   └── useKeyboardNavigation.ts
├── lib/
│   ├── data/                 # Mock data (60+ products)
│   └── utils/                # Utility functions
├── types/
│   ├── product.ts            # Product types with discriminated unions
│   ├── filters.ts            # Filter state types
│   └── search.ts             # Search state types
└── designs/                  # HTML mockups (reference)
```

## AI-Assisted Development Documentation

**This section documents the use of AI tools in developing this project, as required by the technical assessment.**

### AI Tools Used

- **Claude (Anthropic)** - Used for initial research, requirements analysis, and planning
- **Claude Code** - Used for pair programming, code generation, and iterative development
- **Google Stitch (Beta)** - Used for UI/UX design generation and creating design mockups

### Specific Use Cases

#### 1. Initial Research & Requirements Analysis
Used Claude to analyze the technical challenge requirements and create comprehensive project documentation:
- Generated detailed requirements document from the challenge brief
- Created technical implementation plan with 16+ phases
- Researched best practices for TypeScript strict mode and immutability patterns
- Designed the type system architecture with discriminated unions

**Example Prompt:**
```
"Analyze this technical assessment for a bakery product search interface.
Help me create a comprehensive requirements document that breaks down:
- Core features (search, filters, TypeScript requirements)
- UI/UX specifications
- Performance targets
- Technology stack recommendations
Then create a detailed implementation plan with phases and time estimates."
```

#### 2. Code Generation & Implementation
Used Claude Code for task-by-task development with continuous refinement:
- Generated type-safe TypeScript interfaces and discriminated unions
- Created custom React hooks following modern patterns
- Implemented search algorithm with scoring and fuzzy matching
- Built UI components matching design specifications exactly
- Implemented accessibility features (ARIA labels, keyboard navigation)

**Example Prompt:**
```
"Implement a useSearchAPI hook that:
- Uses SWR for data fetching and caching
- Handles debounced search queries
- Combines search with filter state
- Returns loading/error states as discriminated unions
- Follows TypeScript strict mode (no 'any' types)
- Uses immutable patterns throughout"
```

#### 3. UI/UX Design Generation with Google Stitch
Used Google Stitch (Beta) to generate the visual design system and UI mockups:
- Created the warm artisan bakery color palette (crust, dough, accent tones)
- Generated responsive layout structures for all breakpoints (320px to 1440px+)
- Designed the search interface with suggestions dropdown
- Created filter panel layouts (desktop sidebar and mobile modal)
- Generated product card designs with loading skeletons
- Produced empty state and error state designs

**Example Prompt:**
```
"Generate a modern artisan bakery e-commerce design system with:
- Warm color palette inspired by bread crust and dough tones
- Professional yet inviting aesthetic for bakers
- Search-first layout with prominent search bar
- Filter sidebar for desktop, modal for mobile
- Product grid that scales from 1 to 4 columns responsively
- Loading skeletons with shimmer animations
- Export as HTML mockups with Tailwind CSS classes"
```

Google Stitch generated pixel-perfect HTML mockups that served as the source of truth for all component implementation, ensuring design consistency across the entire application.

#### 4. Code Review & Optimization
Used Claude Code to review and refine implementation at each step:
- Identified O(n²) complexity issues and replaced with O(n) solutions using `Set`
- Converted mutating array methods (`.sort()`, `.push()`) to immutable alternatives (`.toSorted()`, spread)
- Removed `any` types and implemented proper type guards
- Optimized React components with `React.memo` and minimal dependencies
- Ensured all code matched design mockups pixel-perfectly

**Example Prompt:**
```
"Review this filter logic implementation. Check for:
- Any use of 'any' types or type assertions
- Direct mutations (array.push, array.sort)
- O(n²) complexity with nested loops or .includes()
- Missing immutability patterns
- Opportunities to use Set/Map for better performance
Suggest improvements following the project's strict code quality rules."
```

### Validation Process

All AI-generated code was validated through:

1. **TypeScript Type Checking**
   - Ran `npx tsc --noEmit` after each implementation phase
   - Ensured zero TypeScript errors
   - Verified no `any` types in codebase using grep

2. **Code Quality Reviews**
   - Checked for immutability patterns and modern array methods
   - Verified algorithmic complexity (O(n) or better)

3. **Design Mockup Comparison**
   - Ensured pixel-perfect implementation of layouts
   - Verified responsive behavior at all breakpoints

4. **Manual Testing**
   - Tested search functionality with various queries
   - Verified filter combinations work correctly
   - Tested keyboard navigation thoroughly
   - Validated localStorage persistence
   - Checked accessibility with screen readers

5. **Production Build Verification**
   - Ensured successful production build
   - Verified bundle size under target (170 kB < 500 kB)
   - Checked that all console.logs are development-only

### Learnings About Effective AI Pair Programming

#### What Worked Well

1. **Design-First Approach with Google Stitch**
   - Using Google Stitch (Beta) to generate visual designs before coding prevented design inconsistencies
   - Having HTML mockups as reference made implementation faster and more accurate
   - The AI-generated designs captured the artisan bakery aesthetic perfectly
   - Exporting designs as HTML with Tailwind classes provided a clear implementation roadmap

2. **Iterative, Task-by-Task Development**
   - Breaking the project into small, focused tasks (16 phases) allowed Claude Code to generate higher-quality code
   - Each phase built upon the previous one, maintaining consistency
   - Regular checkpoints prevented accumulation of technical debt

3. **Providing Clear Context**
   - Creating detailed documentation files helped the AI understand project-specific rules
   - Referencing design mockups ensured UI accuracy
   - Explicit rejection of certain patterns (e.g., "NEVER use `any` types") was extremely effective

4. **Using AI for Research First, Then Implementation**
   - Starting with Claude for research and planning, then moving to Claude Code for implementation worked exceptionally well
   - The planning phase caught potential issues early (e.g., choosing immutable patterns from the start)
   - Having a clear plan made the implementation phase smoother

5. **Continuous Code Review**
   - Asking the AI to review its own code after each phase caught subtle issues
   - Prompting for specific quality checks (complexity, immutability, types) improved code quality
   - The AI was excellent at identifying anti-patterns when prompted

#### Challenges & Solutions

1. **Challenge**: AI sometimes suggested mutating array methods
   - **Solution**: Created explicit rules that listed forbidden patterns and their immutable alternatives

2. **Challenge**: Initial implementations sometimes used generic patterns instead of project-specific ones
   - **Solution**: Provided concrete examples in documentation of the exact patterns expected

3. **Challenge**: Ensuring the AI understood the complete context across multiple files
   - **Solution**: Used phase summaries and progress documents to maintain context between sessions

#### Best Practices Developed

1. **Start with Visual Design**: Use Google Stitch or similar AI design tools to generate mockups before writing code
2. **Document Everything**: Maintain project-specific guidelines that override default AI behaviors
3. **Be Explicit**: Use phrases like "NEVER", "ALWAYS", "CRITICAL" for important rules
4. **Provide Examples**: Show both wrong (❌) and correct (✅) code patterns
5. **Review Incrementally**: Don't generate large amounts of code without reviewing
6. **Validate Continuously**: Run type checks and builds frequently, not just at the end
7. **Reference Visual Designs**: Point AI to mockups/designs for UI implementation accuracy
8. **Export Design Artifacts**: Keep AI-generated HTML/CSS mockups as source of truth for implementation

The design-first approach with Google Stitch saved significant time by:
- Eliminating design iteration cycles during development
- Providing clear visual specifications from the start
- Reducing UI/UX decision-making overhead
- Ensuring pixel-perfect implementation on first attempt

## Theme Selection

### Why Artisan Bakery Supply Store?

I chose the **Artisan Bakery Supply Store** theme because it offers a unique and engaging context that differs from typical e-commerce examples, while still covering all the technical requirements from the challenge. 

## Architecture & Technical Decisions

### Core Technology Choices

#### TypeScript Strict Mode with Zero `any` Types
**Decision**: Enforced `strict: true` in tsconfig.json and banned all `any` types
**Rationale**:
- Catches errors at compile-time, not runtime
- Better IDE autocomplete and refactoring support
- Forces thoughtful type design with discriminated unions

#### Custom Hooks Over State Management Libraries
**Decision**: No Redux, Zustand, or Jotai - only custom React hooks
**Rationale**:
- Search/filter state is local to the search interface
- No global state needs (no cart, auth, multi-page state)
- Lighter bundle size (0 KB vs 3-5 KB for state libraries)

#### SWR for Data Fetching
**Decision**: Used SWR instead of React Query or raw fetch
**Rationale**:
- Built-in cache with stale-while-revalidate strategy
- Automatic request deduplication
- Focus on cache management, not just fetching

### Data & State Architecture

#### Discriminated Unions for Type Safety
**Decision**: Used discriminated unions for search/filter states
```typescript
type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; results: ReadonlyArray<BakeryProduct> }
  | { status: 'error'; error: Error };
```

**Rationale**:
- Exhaustive pattern matching ensures all states handled
- Impossible to have `error` without `status: 'error'`
- TypeScript narrows types automatically in conditionals
- Prevents invalid state combinations

#### Immutable Data Structures with Sets
**Decision**: Used `Set<string>` for multi-select filters, `ReadonlyArray<T>` for lists
**Rationale**:
- `Set.has()` is O(1), `Array.includes()` is O(n)
- Immutable updates prevent accidental mutations
- Modern ES2023 array methods (`.toSorted()`, `.toReversed()`)
- Functional programming patterns improve predictability

#### Server-Side Search with Scoring Algorithm
**Decision**: Implemented search on server (API route), not client
**Rationale**:
- Keeps search logic testable and separate from UI
- Simulates real-world API architecture
- Scoring algorithm (exact: 100pts, starts-with: 80pts, contains: 60pts)

### Performance Optimizations Implemented

1. **React.memo for Product Cards**
   - Only re-renders if product data or selection state changes
   - Reduces render time for 60+ product lists

2. **Set/Map for O(1) Lookups**
   - Converted all filter checks from `Array.includes()` to `Set.has()`
   - Reduced search algorithm complexity from O(n²) to O(n)
   - Measurable improvement with 60+ products and multiple filters

3. **SWR Cache with Revalidation**
   - Caches search results by query+filter hash
   - Instant results for repeated searches
   - Background revalidation keeps data fresh

4. **Bundle Size Optimization**
   - Tree-shaking with ES modules
   - Lazy loading for filter panel on mobile
   - Only import used Radix components
   - Final bundle: 170 KB gzipped (target: <500 KB)

## Future Improvements

Given more time, here are the enhancements I would prioritize:

1. **Virtualized Scrolling**
2. **Comprehensive Testing Suite**
3. **Search Analytics Dashboard**
4. **Backend & Database Integration**
5. **Advanced Search Features**
6. **Enhanced Filter UX**
7. **Performance Monitoring**
8. **Accessibility Improvements**

## Performance Metrics

- **Search Performance**: <50ms (after 300ms debounce)
- **Page Load**: <3 seconds
- **Bundle Size**: 170 kB (gzipped, well under 500 KB target)
- **Build Time**: ~4 seconds
- **TypeScript Errors**: 0

## Testing Checklist

- [x] TypeScript strict mode with zero errors
- [x] No `any` types in codebase
- [x] Production build succeeds
- [x] Search debounces at 300ms
- [x] Keyboard navigation (arrows, enter, escape)
- [x] Recent searches persist in localStorage
- [x] All filter types work correctly
- [x] Filters combine with search
- [x] Loading skeletons appear
- [x] Empty state shows helpful message
- [x] Error state has retry button
- [x] Responsive on all breakpoints
- [x] WCAG AA accessibility compliance
- [x] UI matches design mockups

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Acknowledgments

- Design inspiration from artisan bakery aesthetics
- Design system generated with Google Stitch (Beta)
- TypeScript patterns from Modern TypeScript 2025 best practices
- UI components built with Radix UI primitives
- Development accelerated with Claude AI assistance
