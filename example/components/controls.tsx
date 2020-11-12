export function keepAliveLoadFromCache (name: string, enabled: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('keepAliveControls_LoadFromCache', {
        detail: {
          name,
          enabled
        }
      })
    );
  }
}

export function keepAliveDropCache (name?: string, scrollToTop?: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('keepAliveControls_DropCache', {
        detail: {
          name,
          scrollToTop
        }
      })
    );
  }
}
