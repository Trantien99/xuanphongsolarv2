import { useRef, useEffect } from 'react';
import { Link, LinkProps } from 'wouter';
import { useRoutePreloader } from '@/lib/route-preloader';

interface SmartLinkProps extends LinkProps {
  href: string;
  children: React.ReactNode;
  preload?: boolean;
  className?: string;
}

export function SmartLink({ 
  href, 
  children, 
  preload = true, 
  className,
  ...props 
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
    <Link href={href} {...props}>
      <a ref={linkRef} className={className}>
        {children}
      </a>
    </Link>
  );
}

// Hook for programmatic navigation with preloading
export function useSmartNavigation() {
  const { preloadRoute } = useRoutePreloader();

  const navigateWithPreload = async (href: string) => {
    // Preload the route first
    await preloadRoute(href);
    
    // Then navigate
    window.history.pushState(null, '', href);
    
    // Trigger popstate event to update wouter
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return { navigateWithPreload };
}