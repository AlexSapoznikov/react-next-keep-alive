# react-next-keep-alive

Module for caching views in next.js. It works almost like [react-keep-alive](https://www.npmjs.com/package/react-keep-alive) and [react-actication](https://www.npmjs.com/package/react-activation).
<br />
This component is build on next.js router, so it can be used with next.js only.
<br/>
The reason for creating this was that:
• react-keep-alive - Crashed my app because of different dom manipulations (like trying to remove or replace dom elements which are not present).
Adding additional checks didn't solve the problem.
• react-activation - Client side dom structure did not match server side dom structure. In addition, in stopped working from react 17.


*If you are not using next.js, there are some modules around that use react-router, so you can try those instead.*

[![NPM](https://img.shields.io/npm/v/react-next-keep-alive.svg)](https://www.npmjs.com/package/react-next-keep-alive) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-next-keep-alive
```

## Usage

```tsx
    Will be there in a moment
```

## License

MIT © [https://github.com/AlexSapoznikov/react-next-keep-alive](https://github.com/AlexSapoznikov/react-next-keep-alive)
