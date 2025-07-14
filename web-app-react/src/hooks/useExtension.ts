import { useState, useEffect, useCallback } from 'react';

interface ExtensionStatus {
  isInstalled: boolean;
  isEnabled: boolean;
  version?: string;
}

export const useExtension = () => {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>({
    isInstalled: false,
    isEnabled: false,
  });

  const checkExtensionStatus = useCallback(async () => {
    try {
      // Check if the extension is installed by looking for a specific element
      // or by trying to communicate with it
      const extensionElement = document.getElementById('go-links-extension-check');
      
      if (extensionElement) {
        setExtensionStatus({
          isInstalled: true,
          isEnabled: true,
          version: extensionElement.getAttribute('data-version') || undefined,
        });
      } else {
        // Alternative method: try to post a message to the extension
        const checkMessage = { type: 'CHECK_EXTENSION', timestamp: Date.now() };
        
        // Listen for response
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'EXTENSION_AVAILABLE') {
            setExtensionStatus({
              isInstalled: true,
              isEnabled: true,
              version: event.data.version,
            });
            window.removeEventListener('message', handleMessage);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Send check message
        window.postMessage(checkMessage, '*');
        
        // Remove listener after timeout
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          if (!extensionStatus.isInstalled) {
            setExtensionStatus({
              isInstalled: false,
              isEnabled: false,
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking extension status:', error);
      setExtensionStatus({
        isInstalled: false,
        isEnabled: false,
      });
    }
  }, [extensionStatus.isInstalled]);

  const syncWithExtension = useCallback((data: any) => {
    try {
      // Send data to extension via localStorage
      localStorage.setItem('go_links_sync_data', JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }));

      // Also dispatch custom event
      window.dispatchEvent(new CustomEvent('go_links_sync', { detail: data }));
    } catch (error) {
      console.error('Error syncing with extension:', error);
    }
  }, []);

  const openExtensionOptions = useCallback(() => {
    // Try to open extension options page
    if (window.chrome && window.chrome.runtime) {
      window.chrome.runtime.openOptionsPage?.();
    } else {
      // Fallback: open Chrome extensions page
      window.open('chrome://extensions/', '_blank');
    }
  }, []);

  useEffect(() => {
    checkExtensionStatus();
    
    // Check status periodically
    const interval = setInterval(checkExtensionStatus, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [checkExtensionStatus]);

  return {
    extensionStatus,
    checkExtensionStatus,
    syncWithExtension,
    openExtensionOptions,
    isInstalled: extensionStatus.isInstalled,
    isEnabled: extensionStatus.isEnabled,
    version: extensionStatus.version,
  };
};