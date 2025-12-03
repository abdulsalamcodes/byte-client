import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://byte.vercel.app'),
  title: {
    default: 'Byte Quiz - AI-Powered Quiz Generator',
    template: '%s | Byte Quiz',
  },
  description:
    'Generate intelligent quizzes with AI. Create custom quizzes in any language with adjustable difficulty and streaming support.',
  openGraph: {
    title: 'Byte Quiz - AI-Powered Quiz Generator',
    description:
      'Generate intelligent quizzes with AI. Create custom quizzes in any language with adjustable difficulty and streaming support.',
    url: 'https://byte.vercel.app',
    siteName: 'Byte Quiz',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Byte Quiz - AI-Powered Quiz Generator',
    description:
      'Generate intelligent quizzes with AI. Create custom quizzes in any language with adjustable difficulty and streaming support.',
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
        {children}
      </body>
    </html>
  );
}
