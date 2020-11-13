import React, { ReactElement, Fragment, ComponentType } from 'react';
import { NextComponentType } from 'next'; // eslint-disable-line import/no-extraneous-dependencies
import { KeepAliveName, KeepAliveOptsProps } from './provider';

type KeepAliveProps = {
  children: ReactElement,
}

const defaultOpts: KeepAliveOptsProps = {
  keepScrollEnabled: true,
  applyNewProps: false
};

const withKeepAlive = (Component: ComponentType & NextComponentType, name: KeepAliveName, opts: KeepAliveOptsProps = defaultOpts) => {
  const KeepAlive = (props: KeepAliveProps) => (
    // eslint-disable-next-line react/jsx-fragments
    <Fragment>
      <Component {...props} />
    </Fragment>
  );

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    KeepAlive.getInitialProps = Component.getInitialProps;
  }

  const { keepScrollEnabled, applyNewProps } = opts || {};

  KeepAlive.keepAlive = {
    name,
    keepScrollEnabled,
    applyNewProps
  };

  return KeepAlive;
};

export default withKeepAlive;
