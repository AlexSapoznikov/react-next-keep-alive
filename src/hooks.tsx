import { useEffect } from 'react';

/**
 * Hook for handling mount event
 * @param name
 * @param effect
 */
export const useKeepAliveMountEffect = (name: string, effect: Function) => {
  // Trigger mount
  const handleMountedEvent = (e: any) => {
    if (e?.detail === name && typeof effect === 'function') {
      effect();
    }
  };

  useEffect(() => {
    window.addEventListener('onKeepAliveMount', handleMountedEvent);

    return () => {
      window.removeEventListener('onKeepAliveMount', handleMountedEvent);
    };
  }, []);
};

/**
 * Hook for handling unmount event
 * @param name
 * @param effect
 */
export const useKeepAliveUnmountEffect = (name: string, effect: Function) => {
  // Trigger mount
  const handleUnmountedEvent = (e: any) => {
    if (e?.detail === name && typeof effect === 'function') {
      effect();
    }
  };

  useEffect(() => {
    window.addEventListener('onKeepAliveUnmount', handleUnmountedEvent);

    return () => {
      window.removeEventListener('onKeepAliveUnmount', handleUnmountedEvent);
    };
  }, []);
};
