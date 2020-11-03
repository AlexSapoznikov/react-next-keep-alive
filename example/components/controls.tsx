// eslint-disable-next-line import/prefer-default-export
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
