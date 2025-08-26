import { AppProps } from 'next/app';
// import '../styles/globals.css';
import dotenv from 'dotenv';

dotenv.config();

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

