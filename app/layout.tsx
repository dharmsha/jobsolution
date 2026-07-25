import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/app/ClientLayout";
import { AuthProvider } from "@/app/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import PWAInstallPrompt from "@/app/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = 'https://www.jobsolution.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JobSolution - India's Leading Job Portal | Find Jobs & Hire Talent",
    template: "%s | JobSolution",
  },
  description: "JobSolution - India's No.1 job portal. Search 100,000+ jobs, post free job listings, hire top talent.",
  keywords: ["jobs in india", "job portal", "hire employees", "career growth", "JobSolution"],
  authors: [{ name: "JobSolution Team", url: BASE_URL }],
  creator: "JobSolution",
  publisher: "JobSolution Pvt Ltd",
  openGraph: {
    type: 'website',
    url: BASE_URL,
    title: "JobSolution - India's Leading Job Portal",
    description: "Search 100,000+ jobs, post free job listings, hire top talent.",
    siteName: 'JobSolution',
    images: [{
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'JobSolution - India\'s Leading Job Portal',
      type: 'image/jpeg',
    }],
    locale: 'en_IN',
    alternateLocale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JobSolution - India's No.1 Job Portal",
    description: "Search jobs, company reviews, salary information for Indian companies",
    images: [`${BASE_URL}/twitter-image.jpg`],
    creator: '@jobsolution_in',
    site: '@jobsolution_in',
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
    canonical: BASE_URL,
    languages: {
      'en-IN': BASE_URL,
      'hi-IN': `${BASE_URL}/hi`,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  category: 'jobs, career, employment, recruitment',
  other: {
    'facebook:page': 'https://www.facebook.com/jobsolution',
    'instagram:profile': 'https://www.instagram.com/jobsolution',
    'linkedin:profile': 'https://www.linkedin.com/company/jobsolution',
    'twitter:profile': 'https://twitter.com/jobsolution',
    'youtube:channel': 'https://www.youtube.com/@jobsolution',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD schemas...
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JobSolution - India Job Portal',
    url: BASE_URL,
    description: 'Find jobs in India with company reviews and salary information',
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JobSolution',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'India\'s leading job portal with company reviews and salary insights',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi',
      postalCode: '110001',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    sameAs: [
      'https://twitter.com/jobsolution',
      'https://www.linkedin.com/company/jobsolution',
      'https://www.facebook.com/jobsolution',
      'https://www.instagram.com/jobsolution',
      'https://www.youtube.com/@jobsolution',
    ],
  };

  const jobPortalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JobSolution',
    url: BASE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'Job search and company review application',
    featureList: [
      'Job Search',
      'Company Reviews',
      'Salary Insights',
      'Career Advice',
      'Post Jobs',
      'Resume Builder',
    ],
    browserRequirements: 'Requires JavaScript',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: `${BASE_URL}/jobs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Companies',
        item: `${BASE_URL}/companies`,
      },
    ],
  };

  return (
    <html
      lang="en-IN"
      prefix="og: https://ogp.me/ns#"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        
        <meta httpEquiv="content-language" content="en-IN, hi-IN" />
        <meta name="language" content="English, Hindi" />
        
        <meta name="application-name" content="JobSolution" />
        <meta name="apple-mobile-web-app-title" content="JobSolution" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {[57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => (
          <link
            key={size}
            rel="apple-touch-icon"
            sizes={`${size}x${size}`}
            href={`/icons/apple-icon-${size}x${size}.png`}
          />
        ))}
        
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          key="website-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          key="organization-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPortalJsonLd) }}
          key="jobportal-schema"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          key="breadcrumb-schema"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('✅ JobSolution SW registered:', reg.scope);
                    })
                    .catch(function(err) {
                      console.log('❌ JobSolution SW registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </head>

      <body className="bg-gray-100 flex flex-col min-h-screen">
        <AuthProvider>
          {/* 👇 ClientLayout mein Navbar aur Footer hai, toh yahan se hata do */}
          <ClientLayout>
            <main className="flex-grow">{children}</main>
          </ClientLayout>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}