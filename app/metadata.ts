import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jobsolution.com"),
  title: {
    default: "JobSolution | Find Your Dream Job & Build Your Career",
    template: "%s | JobSolution",
  },
  description: "India's leading job portal connecting talented professionals with top companies. Search thousands of jobs, get career advice, and find your perfect role today.",
  keywords: [
    "jobs", "career", "job search", "employment", "job portal", 
    "career platform", "job openings", "hiring", "recruitment", "India jobs"
  ],
  authors: [{ name: "JobSolution Team" }],
  creator: "JobSolution",
  publisher: "JobSolution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jobsolution.com",
    siteName: "JobSolution",
    title: "JobSolution | Find Your Dream Job",
    description: "India's leading job portal connecting talented professionals with top companies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JobSolution - Find Your Dream Job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobSolution | Find Your Dream Job",
    description: "India's leading job portal connecting talented professionals with top companies.",
    images: ["/twitter-image.jpg"],
    creator: "@jobsolution",
    site: "@jobsolution",
  },
  alternates: {
    canonical: "https://jobsolution.com",
    languages: {
      "en-US": "https://jobsolution.com/en",
      "hi-IN": "https://jobsolution.com/hi",
    },
  },
  category: "jobs",
  classification: "Job Portal, Career Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};