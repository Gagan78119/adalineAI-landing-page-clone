"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero Component
 * 
 * Main hero section with headline, description, and CTA buttons.
 * Centered layout with responsive typography.
 * 
 * Architecture Notes:
 * - Uses semantic HTML for accessibility
 * - Designed to blend seamlessly with the ScenicSection below
 * - Fades in when specific frame comes into viewport
 * - GSAP ScrollTrigger for smooth scroll-based animations
 */

interface HeroProps {
  headline?: string;
  subheadline?: string;
}

export default function Hero({
  headline = "The single platform to iterate, evaluate, deploy, and monitor AI agents",
  subheadline,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Fade out as user scrolls down
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (heroRef.current) {
          const progress = self.progress;
          const opacity = 1 - progress;
          const y = progress * 50;
          
          gsap.set(heroRef.current, {
            opacity: opacity,
            y: y,
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === heroRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-transparent"
      data-component="hero"
    >
      {/* Content positioned at top, not vertically centered */}
      <div className="pt-8 sm:pt-12 lg:pt-16 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Main Headline - Matching Adaline's typography */}
          <h1 
            className="font-sans font-normal text-adaline-dark leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.25rem, 3.75vw, 3.75rem)" }}
          >
            {headline}
          </h1>

          {/* Optional Subheadline */}
          {subheadline && (
            <p className="mt-8 text-lg sm:text-xl text-adaline-dark/70 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
