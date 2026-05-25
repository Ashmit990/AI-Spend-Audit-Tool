import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai-spend-audit-tool.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Credex | AI Spend Audit & SaaS Cost Optimization',
    template: '%s | Credex Spend Audit',
  },
  description:
    "Audit your startup's AI subscriptions in seconds. Detect redundant seats, overlapping tools, and overpriced tiers — then claim up to 50% in hidden savings with Credex.",
  keywords: [
    'AI spend audit',
    'SaaS cost optimization',
    'Cursor pricing',
    'GitHub Copilot savings',
    'Claude subscription',
    'ChatGPT team plan',
    'startup cost reduction',
    'AI tool budget',
    'software license audit',
    'Credex',
  ],
  authors: [{ name: 'Credex', url: APP_URL }],
  creator: 'Credex',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Credex Spend Audit',
    title: 'Credex | AI Spend Audit — Cut AI Subscriptions by Up to 50%',
    description:
      "Free instant audit of your startup's AI tool spend. Detect seat overlap, redundant licenses, and API double-billing in seconds.",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Credex AI Spend Audit — Cut your AI subscriptions by up to 50%',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credex | AI Spend Audit — Cut AI Subscriptions by Up to 50%',
    description:
      "Free instant audit of your startup's AI tool spend. Detect seat overlap, redundant licenses, and API double-billing.",
    images: [`${APP_URL}/og-image.png`],
    creator: '@credexhq',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
