// app/layout.tsx
// SEO-optimized root layout with schema markup

import './globals.css'

// SEO Metadata
export const metadata = {
  metadataBase: new URL('https://dialleap.com'),
  title: {
    default: 'DialLeap - Cheap International Calls From Your Browser | Skype Alternative',
    template: '%s | DialLeap',
  },
  description: 'Make cheap international calls from your browser. No apps, no subscriptions. Per-second billing from $0.019/min to US. The best Skype alternative with SMS support and callback queue.',
  keywords: [
    'international calls',
    'cheap international calling',
    'Skype alternative',
    'browser calling',
    'VoIP',
    'call from browser',
    'international phone calls',
    'cheap calls to USA',
    'cheap calls to UK',
    'call abroad cheap',
    'internet calling',
    'web phone',
    'online phone calls',
    'voip calling app',
    'international calling app',
  ],
  authors: [{ name: 'DialLeap' }],
  creator: 'DialLeap',
  publisher: 'DialLeap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dialleap.com',
    siteName: 'DialLeap',
    title: 'DialLeap - Cheap International Calls From Your Browser',
    description: 'Make cheap international calls from your browser. No apps, no subscriptions. Per-second billing from $0.019/min. The best Skype alternative.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DialLeap - International Calls From Your Browser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DialLeap - Cheap International Calls From Your Browser',
    description: 'Make cheap international calls from your browser. No apps, no subscriptions. Per-second billing from $0.019/min.',
    images: ['/og-image.png'],
    creator: '@dialleap',
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
  alternates: {
    canonical: 'https://dialleap.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// JSON-LD Schema for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://dialleap.com/#website',
      url: 'https://dialleap.com',
      name: 'DialLeap',
      description: 'Cheap international calls from your browser',
      publisher: {
        '@id': 'https://dialleap.com/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://dialleap.com/#organization',
      name: 'DialLeap',
      url: 'https://dialleap.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dialleap.com/logo.png',
      },
      sameAs: [
        'https://twitter.com/dialleap',
        'https://linkedin.com/company/dialleap',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'DialLeap',
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does DialLeap work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DialLeap lets you make phone calls directly from your web browser. No app downloads, no SIM cards needed. Just open your browser, dial a number, and talk. We use VoIP technology to route your call over the internet at a fraction of traditional phone costs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is DialLeap a good Skype alternative?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! DialLeap was built specifically to replace Skype for international calling. Unlike Skype, we offer per-second billing, SMS support, and innovative features like callback queue for long hold times.',
          },
        },
        {
          '@type': 'Question',
          name: 'What countries can I call with DialLeap?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'DialLeap supports calls to 180+ countries including the United States, Canada, UK, Germany, France, Australia, India, Japan, Mexico, Brazil, and many more.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to download an app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. DialLeap works entirely in your web browser. Just visit dialleap.com, sign up in 30 seconds, and start calling.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is billing calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unlike competitors who round up to the nearest minute, DialLeap bills per second. A 1 minute 15 second call is charged for exactly 75 seconds, not 2 minutes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do my credits expire?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Never. Your DialLeap credits never expire. Buy $5 today and use it over the next 5 years if you want. No subscriptions, no monthly fees.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
