import { useState } from 'react';
import { toast } from './use-toast';
import { t } from '@/lib/i18n';

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

interface UseShareOptions {
  successMessage?: string;
  errorMessage?: string;
}

// Helper function to detect if we're on a mobile device
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         ('ontouchstart' in window) ||
         (window.innerWidth <= 768);
}

// Helper function to check if Web Share API is available and functional
function isWebShareAvailable(): boolean {
  return 'share' in navigator && 'canShare' in navigator;
}

export function useShare(options: UseShareOptions = {}) {
  const [isSharing, setIsSharing] = useState(false);

  const share = async (data: ShareData) => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const isMobile = isMobileDevice();
      const hasWebShare = isWebShareAvailable();
      
      // On mobile devices, prioritize Web Share API for native app picker
      if (isMobile && hasWebShare) {
        // Validate share data before attempting to share
        if (navigator.canShare(data)) {
          try {
            await navigator.share(data);
            toast({
              title: t('success'),
              description: options.successMessage || t('sharedSuccessfully'),
            });
            return;
          } catch (shareError) {
            // If user didn't cancel, fall back to clipboard
            if (shareError instanceof Error && shareError.name === 'AbortError') {
              // User cancelled share dialog - this is normal behavior
              return;
            }
            // Continue to fallback methods if sharing failed
            console.warn('Web Share API failed:', shareError);
          }
        }
      } else if (hasWebShare && navigator.canShare(data)) {
        // Desktop or other devices with Web Share API support
        try {
          await navigator.share(data);
          toast({
            title: t('success'),
            description: options.successMessage || t('sharedSuccessfully'),
          });
          return;
        } catch (shareError) {
          if (shareError instanceof Error && shareError.name === 'AbortError') {
            return;
          }
          console.warn('Web Share API failed:', shareError);
        }
      }

      // Fallback: copy to clipboard with enhanced feedback for mobile
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(data.url);
        toast({
          title: t('success'),
          description: isMobile ? 
            t('linkCopied') + ' Bạn có thể dán vào ứng dụng khác để chia sẻ.' : 
            t('linkCopied'),
        });
      } else {
        // Manual fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = data.url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast({
              title: t('success'),
              description: isMobile ? 
                t('linkCopied') + ' Bạn có thể dán vào ứng dụng khác để chia sẻ.' : 
                t('linkCopied'),
            });
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: options.errorMessage || t('shareError'),
            variant: 'destructive',
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Share operation failed:', error);
      toast({
        title: 'Error',
        description: options.errorMessage || t('shareError'),
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    isSharing,
    isMobileDevice: isMobileDevice(),
    hasWebShareSupport: isWebShareAvailable(),
  };
}