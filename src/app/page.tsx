"use client";

import { Navbar, Hero, TrustedBy, ScenicSection, Footer } from "@/components";

/**
 * Landing Page - Cinematic Scroll Animation
 * 
 * Layout Strategy:
 * 1. ScenicSection acts as the main "stage" with pinned scroll animation
 * 2. Content (Navbar, Hero, TrustedBy) is passed as children to ScenicSection
 * 3. ScenicSection handles:
 *    - Pinning the viewport during the scroll sequence
 *    - Animating the parallax image layers
 *    - Fading in the content overlay
 * 4. Footer appears after the pinned section unpins
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-adaline-cream relative">
      {/* 
        Cinematic Scenic Section
        Contains all the animated content that reveals during scroll
      */}
      <ScenicSection>
        {/* Content overlay - positioned over the scenic imagery */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navbar - Fixed at top */}
          <Navbar />
          
          {/* Main content area - centered vertically */}
          <div className="flex-1 flex flex-col justify-center">
            <Hero />
            <TrustedBy />
          </div>
        </div>
      </ScenicSection>

      {/* Footer - Appears after scroll animation completes */}
      <Footer />
    </main>
  );
}
