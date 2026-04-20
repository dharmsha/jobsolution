import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/app/ClientLayout";

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

export const metadata = {
  metadataBase: new URL("https://www.jobsolution.in"),

  title: {
    default: "JobSolution - Find Jobs & Hire Talent",
    template: "%s | JobSolution",
  },

  description:
    "JobSolution is a career growth platform where job seekers find jobs and employers hire top talent across India.",

  keywords: [
    "jobs in india",
    "hire employees",
    "job portal",
    "career growth",
    "JobSolution",
    "latest jobs",
    "private jobs",
  ],

  authors: [{ name: "JobSolution Team", url: "https://www.jobsolution.in" }],
  creator: "JobSolution",
  publisher: "JobSolution",

  openGraph: {
    title: "JobSolution - Find Jobs & Hire Talent",
    description:
      "Discover top job opportunities and hire the best talent with JobSolution.",
    url: "https://www.jobsolution.in",
    siteName: "JobSolution",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JobSolution Career Platform",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "JobSolution - Career Growth Platform",
    description:
      "Find jobs, hire talent and grow your career with JobSolution.",
    images: ["/og-image.jpg"],
    creator: "@jobsolution", // apna twitter username
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://www.jobsolution.in",
  },

  // 👇 Social Profiles (Very Important for Google Knowledge Panel)
  other: {
    "facebook:page": "https://www.facebook.com/jobsolution",
    "instagram:profile": "https://www.instagram.com/jobsolution",
    "linkedin:profile": "https://www.linkedin.com/company/jobsolution",
    "twitter:profile": "https://twitter.com/jobsolution",
    "youtube:channel": "https://www.youtube.com/@jobsolution",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-gray-100 flex flex-col min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}