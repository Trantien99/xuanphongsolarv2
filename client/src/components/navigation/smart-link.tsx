import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRoutePreloader } from '@/lib/route-preloader';

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
  preload?: boolean;
  className?: string;
}

export function SmartLink({ 
  href, 
  children, 
  preload = true, 
  className
}: SmartLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { preloadOnHover } = useRoutePreloader();

  useEffect(() => {
    if (preload && linkRef.current) {
      const cleanup = preloadOnHover(linkRef.current, href);
      return cleanup;
    }
  }, [href, preload, preloadOnHover]);

  return (
    <Link to={href} ref={linkRef} className={className}>
      {children}
    </Link>
  );
}

// Hook for programmatic navigation with preloading
export function useSmartNavigation() {
  const { preloadRoute } = useRoutePreloader();

  const navigateWithPreload = async (href: string) => {
    // Preload the route first
    await preloadRoute(href);
    
    // Then navigate using React Router's navigate function
    // This will be handled by the component using this hook
    return href;
  };

  return { navigateWithPreload };
}