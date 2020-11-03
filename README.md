# react-next-keep-alive

Module for caching views in next.js (with restoring scroll position). It works almost like [react-keep-alive](https://www.npmjs.com/package/react-keep-alive) and [react-activation](https://www.npmjs.com/package/react-activation).
Does not use external dependencies.

This component is build on next.js router, so **it can be used with next.js only**. Like other similar modules, it also keeps cached view in separate hidden div.
Basic logic was taken from this [answer to github issue](https://stackoverflow.com/a/61167944/7778723) (Thanks to @GusRuss89) and more logic was added to it (usage of HOC instead of routes, etc...).

The reason for creating this was that:

- *react-keep-alive* - Crashed my app because of different dom manipulations (like trying to remove or replace dom elements which are not present).
Adding additional checks didn't solve the problem.
- *react-activation* - Client side dom structure did not match server side dom structure. In addition, it stopped working from react 17.


*If you are not using next.js, there are some modules around that use react-router, so you can try those instead.*

[![NPM](https://img.shields.io/npm/v/react-next-keep-alive.svg)](https://www.npmjs.com/package/react-next-keep-alive) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-next-keep-alive
```

## Usage

In your next.js project:

* pages/_app.tsx ([create one, if not present](https://nextjs.org/docs/advanced-features/custom-app)): <br/> *Wrap your `<Component />` with `<KeepAliveProvider />`*

```tsx
import { AppProps } from 'next/app';
import { KeepAliveProvider } from 'react-next-keep-alive';

function MyApp ({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <KeepAliveProvider router={router}>
      <Component {...pageProps} />
    </KeepAliveProvider>
  );
}

export default MyApp;
```

* pages/*.tsx: <br/> *For any component that you want to cache, wrap its export with `withKeepAlive` HOC and add **unique** name to it*

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { withKeepAlive } from 'react-next-keep-alive';

const IndexPage = () => (
  <>
     My index page
  </>
);

export default withKeepAlive(IndexPage, 'my-unique-name');
```

That's it!

## Helpers

##### keepAliveLoadFromCache(name: string, enabled: boolean)

If you want to disable loading component from cache, use this method. Pass unique name that you gave to the component and boolean value of enabled/disabled.

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { withKeepAlive } from 'react-next-keep-alive';

const IndexPage = () => {
  // Disable loading from cache
  keepAliveLoadFromCache('my-index-page', false);

  return (
    <>
       My index page
    </>
  );
};

export default withKeepAlive(IndexPage, 'my-index-page');
```

##### useKeepAliveMountEffect(name: string, effect: Function)

If you need to know, when cache component is mounted, you can use this hook.
You need to pass components unique name and effect function in order to use it.
This hook is accessible in any component, so you can use it for example in nested child component.

```tsx
  useKeepAliveMountEffect('my-index-page', () => {
    // Your code
  });
```

##### useKeepAliveUnmountEffect(name: string, effect: Function)

If you need to know, when cache component is unmounted, you can use this hook.
You need to pass components unique name and effect function in order to use it.
This hook is accessible in any component, so you can use it for example in nested child component.

```tsx
  useKeepAliveUnmountEffect('my-index-page', () => {
    // Your code
  });
```

##### Disable restoring scroll position
In order to disable restoring scroll position, add third argument to `withKeepAlive` HOC, which is boolean indicating whether you want to enable restoring scroll position.

```tsx
// Pass false as third argument if restoring scroll position needs to be disabled
export default withKeepAlive(IndexPage, 'my-index-page', false);
```

## License

MIT © [https://github.com/AlexSapoznikov/react-next-keep-alive](https://github.com/AlexSapoznikov/react-next-keep-alive)
