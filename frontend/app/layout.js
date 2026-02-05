
import '@/styles/globals.css';
import Background from '@/components/Background';
import RootProviders from '@/components/RootProviders';
import Nav from '@/components/nav/Nav';

export const metadata = {
  metadataBase: new URL('https://leximind-aj2c.onrender.com'),
  title: 'LexiMind — Master Your Vocabulary',
  description:
    'LexiMind is a card-based vocabulary-building app that helps you memorize words faster with curated collections and practice.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'LexiMind — Master Your Vocabulary',
    description:
      'Card-based vocabulary-building app to help you learn words faster with curated collections and practice.',
    url: '/',
    siteName: 'LexiMind',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexiMind — Master Your Vocabulary',
    description:
      'Card-based vocabulary-building app to help you learn words faster with curated collections and practice.',
  },
  verification: {
    google: 'L3gzhonZRXeXKy5XGepLSxV-HzxpSJqxuuahrEzKc2I',
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Background />
        <RootProviders>
          <div className="p-2.5 sm:p-4">
            <Nav />
            {children}
          </div>
        </RootProviders>
      </body>
    </html>
  );
};

export default RootLayout;