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

export function useShare(options: UseShareOptions = {}) {
  const [isSharing, setIsSharing] = useState(false);

  const share = async (data: ShareData) => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      // Check if native sharing is available and supported
      if (navigator.share && navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data);
        toast({
          title: t('success'),
          description: options.successMessage || t('sharedSuccessfully'),
        });
      } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(data.url);
          toast({
            title: t('success'),
            description: t('linkCopied'),
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
            document.execCommand('copy');
            toast({
              title: t('success'),
              description: t('linkCopied'),
            });
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
      }
    } catch (error) {
      // Handle user cancellation or other errors
      if (error instanceof Error && error.name !== 'AbortError') {
        // AbortError means user cancelled the share dialog, which is normal
        toast({
          title: 'Error',
          description: options.errorMessage || t('shareError'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    isSharing,
  };
}