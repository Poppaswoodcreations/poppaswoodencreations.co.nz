import { lazy } from 'react';

// Wraps React.lazy() so that if a lazy-loaded chunk 404s (because a new
// deploy replaced it with a new hashed filename), we force one full page
// reload to pick up the fresh index.html + chunk manifest, instead of
// showing the user a broken "Something went wrong" screen.
//
// Usage: replace `const Foo = lazy(() => import('./Foo'));`
// with:  const Foo = lazyWithRetry(() => import('./Foo'));

export function lazyWithRetry<T extends { default: React.ComponentType<any> }>(
  factory: () => Promise<T>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isChunkError =
        /Failed to fetch dynamically imported module/i.test(message) ||
        /Importing a module script failed/i.test(message) ||
        /error loading dynamically imported module/i.test(message);

      const alreadyRetried = sessionStorage.getItem('chunk-reload-attempted') === 'true';

      if (isChunkError && !alreadyRetried) {
        sessionStorage.setItem('chunk-reload-attempted', 'true');
        window.location.reload();
        // Return a never-resolving promise so React doesn't try to render
        // anything further before the reload kicks in.
        return new Promise<T>(() => {});
      }

      // Either not a chunk error, or we already tried reloading once —
      // clear the flag so a future genuine deploy can retry again later,
      // then let the error propagate to the ErrorBoundary as normal.
      sessionStorage.removeItem('chunk-reload-attempted');
      throw error;
    }
  });
}
