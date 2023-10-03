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
import React, { useRef, memo, useEffect, ReactElement, cloneElement, Fragment, useState, EffectCallback } from 'react';
import { NextRouter } from 'next/router'; // eslint-disable-line import/no-extraneous-dependencies

type KeepAliveCacheType = {
  [name: string]: {
    Component: any,
    pageProps: any,
    scrollPos?: number,
    name?: string,
    enabled?: boolean
  }
};

type KeepAliveNameFnArgs = {
  props: any,
  router: NextRouter
}

export type KeepAliveName = string | ((nameArgs: KeepAliveNameFnArgs) => string)

export type KeepAliveOptsProps = {
  keepScrollEnabled?: boolean,
  applyNewProps?: boolean | ((cachedProps: any, newProps: any) => Object)
}

type KeepAliveData = {
  name: KeepAliveName
} & KeepAliveOptsProps;

type ExtendChildrenType = {
  type: {
    keepAlive: KeepAliveData
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
  const [, forceUpdate] = useState<any>();

  const {
    name: keepAliveName,
    keepScrollEnabled,
    applyNewProps
    // @ts-ignore
  } = componentData?.type?.keepAlive || {};

  // KeepAlive name
  const name = typeof keepAliveName === 'function'
    ? keepAliveName({ props: pageProps, router })
    : keepAliveName;
  const isEnabled = () => keepAliveCache?.current?.[name]?.enabled;
  const isKeptAlive = !!name;
  const keepScroll = !!keepScrollEnabled;

  // Add Component to retainedComponents if we haven't got it already
  if (isKeptAlive && !keepAliveCache.current[name]) {
    const Component: any = componentData?.type;
    const MemoComponent = memo(Component);
    keepAliveCache.current[name] = {
      Component: MemoComponent,
      pageProps,
      scrollPos: 0,
      name,
      enabled: defaultEnabled
    };
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = () => {
    if (isKeptAlive && keepAliveCache?.current?.[name]) {
      keepAliveCache.current[name].scrollPos = window.scrollY;
    }
  };

  // Restore the scroll position of cached page
  const handleRouteChangeComplete = () => {
    if (isKeptAlive && isEnabled() && keepScroll) {
      window.scrollTo(0, keepAliveCache.current[name]?.scrollPos || 0);
      // Just in case try again in next event loop
      setTimeout(() => {
        window.scrollTo(0, keepAliveCache.current[name]?.scrollPos || 0);
      }, 0);
    }
  };

  // Enable/disable loading from cache
  const handleLoadFromCache = (event: any) => {
    const { name: controlsName, enabled: controlsEnabled } = event?.detail || {};

    if (keepAliveCache.current[controlsName]) {
      keepAliveCache.current[controlsName].enabled = controlsEnabled;
    }
  };

  // Drop cache
  const handleDropCache = (event: any) => {
    const { name: dropKeepAliveName, scrollToTop } = event?.detail || {};

    // If no name, drop all cache
    if (!dropKeepAliveName) {
      keepAliveCache.current = {};
    } else if (typeof dropKeepAliveName === 'string') {
      delete keepAliveCache.current?.[dropKeepAliveName];
    } else if (typeof dropKeepAliveName === 'function') {
      const caches = dropKeepAliveName?.(Object.keys(keepAliveCache.current));
      const cachesToRemove: string[] = Array.isArray(caches) ? caches : [caches];

      // eslint-disable-next-line no-unused-expressions
      cachesToRemove
        ?.filter(exists => exists)
        ?.forEach(cacheName => delete keepAliveCache.current?.[cacheName]);
    }

    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    forceUpdate({});
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
    window.addEventListener('keepAliveControls_LoadFromCache', handleLoadFromCache);
    window.addEventListener('keepAliveControls_DropCache', handleDropCache);

    return () => {
      window.removeEventListener('keepAliveControls_LoadFromCache', handleLoadFromCache);
      window.removeEventListener('keepAliveControls_DropCache', handleDropCache);
    };
  }, []);

  const getCachedViewProps = (cachedProps: Object) => {
    // Apply new props
    if (applyNewProps === true) {
      return pageProps;
    }

    // Apply combination of old and new props
    if (typeof applyNewProps === 'function') {
      return applyNewProps(cachedProps, pageProps);
    }

    // Apply cached props
    return cachedProps;
  };

  /**
   * Custom useEffect which runs only when component alive.
   */
  const getKeepAliveEffect = (isHidden: boolean) => {
    const useKeepAliveEffect = (effect: EffectCallback, deps?: any[]) => useEffect(() => {
      if (!isHidden) {
        return effect();
      }
    }, deps);

    return useKeepAliveEffect;
  };

  return (
    // eslint-disable-next-line react/jsx-fragments
    <Fragment>
      { (!isKeptAlive || !isEnabled()) && children }

      <div style={{ display: (isKeptAlive && isEnabled()) ? 'block' : 'none' }}
           id="keep-alive-container"
           data-keepalivecontainer={true}
      >
        {
          Object.entries(keepAliveCache.current).map(([cacheName, { Component, pageProps: cachedProps }]: any) => (
            <div
              key={cacheName}
              style={{ display: name === cacheName ? 'block' : 'none' }}
              data-keepalive={cacheName}
              data-keepalive-hidden={name !== cacheName}
            >
              <Component isHiddenByKeepAlive={name !== cacheName}
                         useEffect={getKeepAliveEffect(name !== cacheName)}
                         {...getCachedViewProps(cachedProps)}
              />
            </div>
          ))
        }
      </div>
    </Fragment>
  );
};

export default KeepAliveProvider;
