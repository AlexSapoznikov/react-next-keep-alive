import React, { ReactElement, Fragment } from 'react';

type KeepAliveProps = {
  children: ReactElement,
}

const withKeepAlive = (Component, name: string, keepScrollEnabled = true) => {
  const KeepAlive = (props: KeepAliveProps) => (
    <Fragment>
      <Component {...props} />
    </Fragment>
  );

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    KeepAlive.getInitialProps = Component.getInitialProps;
  }

  KeepAlive.keepAliveName = name;
  KeepAlive.keepAliveKeepScroll = keepScrollEnabled;

  return KeepAlive;
};

export default withKeepAlive;
