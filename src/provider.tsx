/**
 * Keep alive component
 * https://stackoverflow.com/questions/59124463/nextjs-how-to-not-unmount-previous-page-when-going-to-next-page-to-keep-state
 *
 * Tried following libraries before implementing this one:
 * - react-keep-alive: has a lot of dom manipulation bugs and crashes our app
 * - react-activation: does not handle SSR correctly
 * - there are some others but they are built on react-router, which next.js doesn't use
 *
 * Basic Usage:
 * 1) Wrap nextjs <Component /> with <KeepAliveProvider> in _app.tsx
 * 2) Wrap components export with "withKeepAlive" and provide unique name like this: export default withKeepAlive(IndexPage, 'index');
 */
import React, { useRef, memo, useEffect, ReactElement, cloneElement, Fragment } from 'react';
import { NextRouter } from 'next/router';

type KeepAliveCacheType = {
  [name: string]: {
    Component: any,
    scrollPos?: number,
    name?: string,
    enabled?: boolean
  }
};

type ExtendChildrenType = {
  type: {
    keepAliveName?: string
  }
};

type KeepAliveProviderProps = {
  children: ReactElement & ExtendChildrenType,
  router: NextRouter
};

const defaultEnabled = true;

const KeepAliveProvider = (props: KeepAliveProviderProps) => {
  const { children, router } = props;

  const pageProps = children?.props;
  const componentData = cloneElement(children);
  const CurrentComponent = componentData?.type;

  const keepAliveCache = useRef<KeepAliveCacheType>({});

  // @ts-ignore
  const isKeptAlive = !!componentData?.type?.keepAliveName;
  // @ts-ignore
  const keepScroll = !!componentData?.type?.keepAliveKeepScroll;
  // @ts-ignore
  const name = componentData?.type?.keepAliveName;

  const isEnabled = keepAliveCache?.current?.[name]?.enabled !== undefined
    ? !!keepAliveCache?.current?.[name]?.enabled
    : defaultEnabled;

  // Add Component to retainedComponents if we haven't got it already
  if (isKeptAlive && !keepAliveCache.current[name]) {
    const Component: any = componentData?.type;
    const MemoComponent = memo(Component);
    keepAliveCache.current[name] = {
      Component: MemoComponent,
      scrollPos: 0,
      name,
      enabled: defaultEnabled
    };
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = () => {
    if (isKeptAlive) {
      keepAliveCache.current[name].scrollPos = window.scrollY;
    }
  };

  // Restore the scroll position of cached page
  const handleRouteChangeComplete = () => {
    if (isKeptAlive && isEnabled && keepScroll) {
      setTimeout(() => {
        window.scrollTo(0, keepAliveCache.current[name]?.scrollPos || 0);
      }, 0);
    }
  };

  // Enable/disable loading from cache
  const handleControls = (event) => {
    const { name: controlsName, enabled: controlsEnabled } = event?.detail || {};
    keepAliveCache.current[controlsName].enabled = controlsEnabled;
  };

  // Handle scroll position caching - requires an up-to-date router.asPath
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.asPath]);

  // Emit mounting events
  // @ts-ignore
  useEffect(() => {
    if (isKeptAlive) {
      window.dispatchEvent(
        new CustomEvent('onKeepAliveMount', {
          detail: name
        })
      );

      return () => {
        window.dispatchEvent(
          new CustomEvent('onKeepAliveUnmount', {
            detail: name
          })
        );
      };
    }
  }, [CurrentComponent, pageProps]);

  /**
   * Listen to changes (enabled/disabled)
   */
  useEffect(() => {
    window.addEventListener('keepAliveControls_LoadFromCache', handleControls);

    return () => {
      window.removeEventListener('keepAliveControls_LoadFromCache', handleControls);
    };
  }, []);

  return (
    <Fragment>
      <div style={{ display: (isKeptAlive && isEnabled) ? 'block' : 'none' }}>
        {
          Object.entries(keepAliveCache.current).map(([n, { Component }]: any) => (
            <div
              key={n}
              style={{ display: name === n ? 'block' : 'none' }}
            >
              <Component {...pageProps} />
            </div>
          ))
        }
      </div>

      { (!isKeptAlive || !isEnabled) && children }
    </Fragment>
  );
};

export default KeepAliveProvider;
