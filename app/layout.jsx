import './globals.css';
import { LanguageProvider } from './LanguageContext';
import Head from 'next/head';

export const metadata = {
  title: 'ERTH | إرث',
  description: 'National Retirement Experience Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
