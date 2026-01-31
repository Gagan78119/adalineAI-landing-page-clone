"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CanvasSequence from "./CanvasSequence";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScenicSection Component - Canvas Frame Animation
 * 
 * Implements a cinematic scroll experience using canvas-based frame animation:
 * 1. Pinned container during scroll animation
 * 2. 129-frame image sequence rendered to canvas based on scroll progress
 * 3. Content overlay (Navbar, Hero, TrustedBy) visible from the start
 * 
 * Animation Approach:
 * - Uses GSAP ScrollTrigger to track scroll progress (0-1)
 * - Passes progress to CanvasSequence which renders appropriate frame
 * - Smooth scrubbing for buttery scroll-linked animation
 */
export default function ScenicSection({
  children
}: {
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for canvas frame animation
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle frame loading complete
  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Set content visible from start
    gsap.set(content, { opacity: 1 });

    // Create ScrollTrigger for progress tracking
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=250%", // Extended scroll distance for smooth animation
      pin: true,
      scrub: 0.5, // Faster scrub for more responsive frame updates
      anticipatePin: 1,
      onUpdate: (self) => {
        // Update progress state to drive canvas frame rendering
        setScrollProgress(self.progress);
      },
    });

    // Cleanup
    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden"
      data-scene="canvas-frame-animation"
    >
      {/* Background color fallback */}
      <div className="absolute inset-0 bg-adaline-cream" />

      {/* Canvas Frame Animation Layer */}
      <div className="absolute inset-0 z-0">
        <CanvasSequence 
          progress={scrollProgress}
          onLoadComplete={handleLoadComplete}
        />
      </div>

      {/* Content Overlay - Visible from the start */}
      <div 
        ref={contentRef} 
        className="absolute inset-0 z-30"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease-out" }}
      >
        <div className="relative w-full h-full">
          {children}
        </div>
      </div>
    </section>
  );
}
