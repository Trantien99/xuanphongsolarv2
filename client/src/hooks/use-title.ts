import { useEffect } from 'react';
import { t } from '@/lib/i18n';

export const useTitle = (titleKey: string, suffix?: string) => {
  useEffect(() => {
    const title = t(titleKey);
    const fullTitle = suffix ? `${title} - ${suffix}` : title;
    document.title = fullTitle;
    
    // Update meta tags
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', fullTitle);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }
    
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle);
    }
  }, [titleKey, suffix]);
};

export const useMetaDescription = (descriptionKey: string) => {
  useEffect(() => {
    const description = t(descriptionKey);
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
  }, [descriptionKey]);
};