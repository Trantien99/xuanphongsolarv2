import { useEffect } from 'react';

interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

interface MetaManagerProps {
  data: MetaData;
}

export function MetaManager({ data }: MetaManagerProps) {
  useEffect(() => {
    // Update document title
    if (data.title) {
      document.title = data.title;
      const titleElement = document.getElementById('page-title');
      if (titleElement) {
        titleElement.setAttribute('content', data.title);
      }
    }

    // Update meta description
    if (data.description) {
      updateMetaTag('name', 'description', data.description);
    }

    // Update meta keywords
    if (data.keywords) {
      updateMetaTag('name', 'keywords', data.keywords);
    }

    // Update Open Graph tags
    if (data.ogTitle) {
      updateMetaTag('property', 'og:title', data.ogTitle);
    }
    if (data.ogDescription) {
      updateMetaTag('property', 'og:description', data.ogDescription);
    }
    if (data.ogImage) {
      updateMetaTag('property', 'og:image', data.ogImage);
    }
    if (data.ogUrl) {
      updateMetaTag('property', 'og:url', data.ogUrl);
    }

    // Update Twitter tags
    if (data.twitterTitle) {
      updateMetaTag('property', 'twitter:title', data.twitterTitle);
    }
    if (data.twitterDescription) {
      updateMetaTag('property', 'twitter:description', data.twitterDescription);
    }
    if (data.twitterImage) {
      updateMetaTag('property', 'twitter:image', data.twitterImage);
    }

    // Update canonical URL
    if (data.canonical) {
      updateCanonical(data.canonical);
    }
  }, [data]);

  return null; // This component doesn't render anything
}

function updateMetaTag(attribute: string, value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

function updateCanonical(url: string) {
  let element = document.querySelector('link[rel="canonical"]');
  
  if (element) {
    element.setAttribute('href', url);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
    document.head.appendChild(element);
  }
}

// Hook for easy meta management in pages
export function useMeta(data: MetaData) {
  useEffect(() => {
    const metaManager = document.createElement('div');
    document.body.appendChild(metaManager);
    
    // Apply meta data
    if (data.title) {
      document.title = data.title;
    }
    if (data.description) {
      updateMetaTag('name', 'description', data.description);
    }
    if (data.keywords) {
      updateMetaTag('name', 'keywords', data.keywords);
    }
    if (data.ogTitle) {
      updateMetaTag('property', 'og:title', data.ogTitle);
    }
    if (data.ogDescription) {
      updateMetaTag('property', 'og:description', data.ogDescription);
    }
    if (data.ogImage) {
      updateMetaTag('property', 'og:image', data.ogImage);
    }
    if (data.ogUrl) {
      updateMetaTag('property', 'og:url', data.ogUrl);
    }
    if (data.canonical) {
      updateCanonical(data.canonical);
    }

    return () => {
      document.body.removeChild(metaManager);
    };
  }, [data]);
}