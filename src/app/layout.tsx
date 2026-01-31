import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

/**
 * Font Configuration
 * 
 * Geist Sans: Clean, modern sans-serif for UI elements
 * Geist Mono: Monospace for code/technical content
 * Playfair Display: Elegant serif for headlines
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Site Metadata
 * 
 * Optimized for SEO and social sharing.
 */
export const metadata: Metadata = {
  title: "Adaline - Iterate, Evaluate, Deploy, and Monitor AI Agents",
  description:
    "The single platform to iterate, evaluate, deploy, and monitor AI agents. Trusted by leading companies worldwide.",
  keywords: ["AI agents", "machine learning", "deployment", "monitoring", "evaluation"],
  openGraph: {
    title: "Adaline - AI Agent Platform",
    description: "The single platform to iterate, evaluate, deploy, and monitor AI agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
