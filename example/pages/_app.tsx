import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { KeepAliveProvider } from '../components';

function MyApp ({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <KeepAliveProvider router={router}>
      <Component {...pageProps} />
    </KeepAliveProvider>
  );
}

export default MyApp;
