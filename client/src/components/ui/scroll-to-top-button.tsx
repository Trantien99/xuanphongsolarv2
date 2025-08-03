import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrollToTop } from '@/hooks/use-scroll-to-top';

interface ScrollToTopButtonProps {
  showAfter?: number; // Show button after scrolling this many pixels
  className?: string;
}

export function ScrollToTopButton({ 
  showAfter = 400, 
  className = '' 
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  const handleClick = () => {
    scrollToTop('smooth');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      className={`
        fixed bottom-20 right-4 z-50 rounded-full p-3 shadow-lg
        bg-primary hover:bg-primary/90 text-primary-foreground
        transition-all duration-300 ease-in-out
        md:bottom-4
        ${className}
      `}
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}