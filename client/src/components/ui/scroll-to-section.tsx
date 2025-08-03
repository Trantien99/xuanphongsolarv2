import { ReactNode } from 'react';

interface ScrollToSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  offset?: number; // Offset from top (useful for fixed headers)
}

/**
 * Component to create scrollable sections
 * Useful for creating anchor points in the page
 */
export function ScrollToSection({ 
  id, 
  children, 
  className = '', 
  offset = 0 
}: ScrollToSectionProps) {
  return (
    <section 
      id={id} 
      className={className}
      style={{ scrollMarginTop: `${offset}px` }}
    >
      {children}
    </section>
  );
}

/**
 * Function to smoothly scroll to a specific section
 */
export function scrollToSection(sectionId: string, offset: number = 0) {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}