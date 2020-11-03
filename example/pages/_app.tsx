import { AppProps } from 'next/app';
import { KeepAliveProvider } from '../components';

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <KeepAliveProvider>
      <Component {...pageProps} />
    </KeepAliveProvider>
  );
}

export default MyApp;
