import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/src/components/AuthProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://byte.vercel.app'),
  title: {
    default: 'Byte Lab - Coding Practice Studio',
    template: '%s | Byte Lab',
  },
  description:
    'A focused coding practice studio for building and taking custom quizzes.',
  openGraph: {
    title: 'Byte Lab - Coding Practice Studio',
    description:
      'A focused coding practice studio for building and taking custom quizzes.',
    url: 'https://byte.vercel.app',
    siteName: 'Byte Lab',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Byte Lab - Coding Practice Studio',
    description:
      'A focused coding practice studio for building and taking custom quizzes.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
