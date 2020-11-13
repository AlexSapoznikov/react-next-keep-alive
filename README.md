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

#### pages/_app.tsx ([create one, if not present](https://nextjs.org/docs/advanced-features/custom-app)):

Wrap your `<Component />` with `<KeepAliveProvider />`

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

#### pages/*.tsx:

For any component that you want to cache, wrap its export with `withKeepAlive` HOC and add **unique** name to it

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

## withKeepAlive options

There are some additional options available for `withKeepAlive` HOC:

```
withKeepAlive(Component, name: string | (({props, router}) => string), opts: Object)
```

#### name

Name is a string or function that returns a string.
<br/>
`props` and nextjs `router` is passed to that function to help apply some more specific name, which might be needed for having multiple caches for the same component.

#### opts

| Key  | type | default | Description |
| :--- | :--- | :--- | :--- |
| keepScrollEnabled | *boolean* | true | Setting this to false will disable scroll restoration. By default it is true and scroll position is restored. |
| applyNewProps  | *boolean* or *(cachedProps, newProps) => Object* | false | Default value of *false* mounts cached view with cached props. Setting this to *true* will apply new props to cached view. You can use a function here to decide which props to mount the component with - it gets cached props and new props as arguments and outputs combined props. |


## Helpers

#### props

There are some props passed to component that is cached with `withKeepAlive` HOC.

| prop  | type | Description |
| :--- | :--- | :--- |
| isHiddenByKeepAlive | *boolean* | Is `true` if component is currently cached and hidden in dom tree. <br />Is `false` if component is currently active |

```tsx
import React, { useState } from 'react';
import { withKeepAlive } from 'react-next-keep-alive';

const Example = (props) => {
  const {
    isHiddenByKeepAlive // This is true if component is currently hidden
  } = props;

  return (
    <>
      My index page
    </>
  );
};

export default withKeepAlive(Example, 'my-unique-name');
```

#### keepAliveLoadFromCache(name: string, enabled: boolean)

If you want to disable loading component from cache, use this method. Pass unique name that you gave to the component and boolean value of enabled/disabled.

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { withKeepAlive, keepAliveLoadFromCache } from 'react-next-keep-alive';

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

#### keepAliveDropCache(name?: string, scrollToTop: boolean)

You can remove component from cache and scroll window to top with this function.

Pass in components unique name to remove it from cache.

Do not pass in components unique name if you want to clear all cached components.

You can import it like this: `import { keepAliveDropCache } from 'react-next-keep-alive'`

#### useKeepAliveMountEffect(name: string, effect: Function)

If you need to know, when cache component is mounted, you can use this hook.

You need to pass components unique name and effect function in order to use it.

This hook is accessible in any component, so you can use it for example in nested child component.

```tsx
  import { useKeepAliveMountEffect } from 'react-next-keep-alive'

  useKeepAliveMountEffect('my-index-page', () => {
    // Your code
  });
```

#### useKeepAliveUnmountEffect(name: string, effect: Function)

If you need to know, when cache component is unmounted, you can use this hook.

You need to pass components unique name and effect function in order to use it.

This hook is accessible in any component, so you can use it for example in nested child component.

```tsx
  import { useKeepAliveUnmountEffect } from 'react-next-keep-alive'

  useKeepAliveUnmountEffect('my-index-page', () => {
    // Your code
  });
```

## Changelog

- **Version 1.0.5** - Has a breaking change for `withKeepAlive` HOC. It now takes object as third argument instead of boolean. See more above.
- **Version 1.0.6** - Add *keepAliveDropCache*.
- **Version 1.0.7** - Add identifiers to container and hidden components inside it.
- **Version 1.0.8** - Change order - put keep-alive container as last in dom tree, so non-cached elements will be selected first when using querySelectors.
- **Version 1.0.8** - Add component type in `withKeepAlive` HOC first argument, pass `isHiddenByKeepAlive` property to component so user knows if this component is currently cached and hidden if needed.

## License

MIT © [https://github.com/AlexSapoznikov/react-next-keep-alive](https://github.com/AlexSapoznikov/react-next-keep-alive)
