import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to automatically scroll to top when route changes
 * Supports both instant and smooth scrolling options
 * Also handles hash fragments (#section-id)
 */
export function useScrollToTop(behavior: ScrollBehavior = 'instant') {
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timeoutId = setTimeout(() => {
      // Check if there's a hash fragment
      const hash = window.location.hash;
      
      if (hash) {
        // Try to scroll to the element with the matching ID
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior });
          return;
        }
      }
      
      // Default: scroll to top when location changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, behavior]);
}

/**
 * Function to manually scroll to top
 * Can be used for buttons or other interactions
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth') {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
}