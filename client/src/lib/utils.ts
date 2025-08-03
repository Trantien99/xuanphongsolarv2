import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for smooth scrolling with mobile optimization
export function scrollToElement(element: HTMLElement | null, options?: {
  headerOffset?: number;
  delay?: number;
  behavior?: 'smooth' | 'instant';
  mobileHeaderOffset?: number;
}) {
  const {
    headerOffset = 80, // Default offset for sticky header
    mobileHeaderOffset, // Additional offset for mobile if needed
    delay = 100, // Default delay to ensure content is rendered
    behavior = 'smooth'
  } = options || {};

  if (!element) return;

  setTimeout(() => {
    // Double-check element still exists and is visible
    if (!element || !element.offsetParent) return;
    
    const elementTop = element.offsetTop;
    
    // Use mobile-specific offset if provided and on mobile
    const isMobile = window.innerWidth < 768; // md breakpoint
    const actualOffset = isMobile && mobileHeaderOffset !== undefined 
      ? mobileHeaderOffset 
      : headerOffset;
    
    const scrollPosition = Math.max(0, elementTop - actualOffset);
    
    // Use smooth scroll with fallback for better mobile compatibility
    if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers/devices or instant scroll
      window.scrollTo(0, scrollPosition);
    }
  }, delay);
}

// Utility to detect if device is mobile
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth < 768;
}
