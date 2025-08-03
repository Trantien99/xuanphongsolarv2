import { useRef, useCallback } from 'react';
import { scrollToElement } from '@/lib/utils';

interface UsePaginationScrollOptions {
  headerOffset?: number;
  delay?: number;
}

export function usePaginationScroll(options?: UsePaginationScrollOptions) {
  const containerRef = useRef<HTMLElement>(null);
  
  const scrollToContainer = useCallback(() => {
    scrollToElement(containerRef.current, {
      headerOffset: options?.headerOffset,
      delay: options?.delay,
    });
  }, [options?.headerOffset, options?.delay]);

  const handlePageChange = useCallback((
    page: number,
    setCurrentPage: (page: number) => void,
    updateURL?: (params: { page: number }) => void
  ) => {
    setCurrentPage(page);
    if (updateURL) {
      updateURL({ page });
    }
    scrollToContainer();
  }, [scrollToContainer]);

  return {
    containerRef,
    scrollToContainer,
    handlePageChange,
  };
}