// Route preloader for better SPA performance
class RoutePreloader {
  private preloadedRoutes = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();

  // Define route imports
  private routeImports: Record<string, () => Promise<any>> = {
    '/': () => import('@/pages/home'),
    '/products': () => import('@/pages/products'),
    '/products/:slug': () => import('@/pages/product-detail'),
    '/cart': () => import('@/pages/cart'),
    '/checkout': () => import('@/pages/checkout'),
    '/news': () => import('@/pages/news'),
    '/news/:slug': () => import('@/pages/news-detail'),
    '/solar-energy': () => import('@/pages/solar-energy'),
    '404': () => import('@/pages/not-found'),
  };

  // Preload a specific route
  async preloadRoute(path: string): Promise<void> {
    if (this.preloadedRoutes.has(path)) {
      return;
    }

    // Find matching route pattern
    const routeKey = this.findRouteKey(path);
    if (!routeKey || !this.routeImports[routeKey]) {
      return;
    }

    // Check if already preloading
    if (this.preloadPromises.has(routeKey)) {
      await this.preloadPromises.get(routeKey);
      return;
    }

    // Start preloading
    const preloadPromise = this.routeImports[routeKey]()
      .then(() => {
        this.preloadedRoutes.add(path);
        this.preloadPromises.delete(routeKey);
      })
      .catch((error) => {
        console.warn(`Failed to preload route ${path}:`, error);
        this.preloadPromises.delete(routeKey);
      });

    this.preloadPromises.set(routeKey, preloadPromise);
    await preloadPromise;
  }

  // Preload multiple routes
  async preloadRoutes(paths: string[]): Promise<void> {
    const promises = paths.map(path => this.preloadRoute(path));
    await Promise.allSettled(promises);
  }

  // Preload critical routes (commonly visited)
  async preloadCriticalRoutes(): Promise<void> {
    const criticalRoutes = [
      '/',
      '/products',
      '/cart',
      '/news'
    ];
    
    await this.preloadRoutes(criticalRoutes);
  }

  // Preload route on hover (for links)
  preloadOnHover(element: HTMLElement, path: string): (() => void) {
    let timeoutId: NodeJS.Timeout;

    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        this.preloadRoute(path);
      }, 100); // Small delay to avoid unnecessary preloads
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }

  // Find matching route key for a given path
  private findRouteKey(path: string): string | null {
    // Exact match first
    if (this.routeImports[path]) {
      return path;
    }

    // Pattern matching for dynamic routes
    for (const routeKey of Object.keys(this.routeImports)) {
      if (this.matchesPattern(path, routeKey)) {
        return routeKey;
      }
    }

    return null;
  }

  // Check if path matches route pattern
  private matchesPattern(path: string, pattern: string): boolean {
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');

      if (patternParts.length !== pathParts.length) {
        return false;
      }

      return patternParts.every((part, index) => {
        return part.startsWith(':') || part === pathParts[index];
      });
    }

    return path === pattern;
  }

  // Get preload status
  isPreloaded(path: string): boolean {
    return this.preloadedRoutes.has(path);
  }

  // Clear preload cache
  clearCache(): void {
    this.preloadedRoutes.clear();
    this.preloadPromises.clear();
  }
}

// Export singleton instance
export const routePreloader = new RoutePreloader();

// React hook for route preloading
export function useRoutePreloader() {
  return {
    preloadRoute: (path: string) => routePreloader.preloadRoute(path),
    preloadRoutes: (paths: string[]) => routePreloader.preloadRoutes(paths),
    preloadCriticalRoutes: () => routePreloader.preloadCriticalRoutes(),
    preloadOnHover: (element: HTMLElement, path: string) => 
      routePreloader.preloadOnHover(element, path),
    isPreloaded: (path: string) => routePreloader.isPreloaded(path),
  };
}