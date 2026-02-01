"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useFrameSequence } from "@/hooks/useFrameSequence";

interface CanvasSequenceProps {
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Optional className for the container */
  className?: string;
  /** Callback when loading completes */
  onLoadComplete?: () => void;
  /** Callback with loading progress (0-1) */
  onLoadProgress?: (progress: number) => void;
}

/**
 * CanvasSequence Component
 * 
 * Renders a frame sequence on an HTML5 canvas based on scroll progress.
 * Handles responsive sizing, device pixel ratio, and "cover" aspect ratio behavior.
 * At the end of the sequence, shows a hero product shot with zoom-out effect.
 * 
 * @param progress - Current scroll progress (0-1) to determine which frame to show
 * @param className - Optional CSS class for styling
 * @param onLoadComplete - Callback when all frames are loaded
 * @param onLoadProgress - Callback with current loading progress
 */
export default function CanvasSequence({
  progress,
  className = "",
  onLoadComplete,
  onLoadProgress,
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastProgressRef = useRef<number>(-1);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const { frames, isLoading, loadProgress, getFrameByProgress } = useFrameSequence();

  // Load hero product shot image
  useEffect(() => {
    const heroImg = new Image();
    heroImg.src = "/images/scenic/hero-product-shot.png";
    heroImg.onload = () => {
      heroImageRef.current = heroImg;
      setHeroImageLoaded(true);
    };
    heroImg.onerror = () => {
      console.warn("Failed to load hero product shot");
    };
  }, []);

  // Notify parent of loading progress
  useEffect(() => {
    onLoadProgress?.(loadProgress);
  }, [loadProgress, onLoadProgress]);

  // Notify parent when loading completes
  useEffect(() => {
    if (!isLoading && frames.length > 0) {
      onLoadComplete?.();
    }
  }, [isLoading, frames.length, onLoadComplete]);

  /**
   * Draw a frame to the canvas with "cover" behavior
   * Centers and scales the image to cover the canvas while maintaining aspect ratio
   */
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    
    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Set canvas size accounting for device pixel ratio
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    
    // Scale canvas CSS size to container
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;

    // Scale context for retina displays
    ctx.scale(dpr, dpr);

    // Calculate "cover" dimensions
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerWidth / containerHeight;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (containerAspect > imgAspect) {
      // Container is wider than image - fit to width
      drawWidth = containerWidth;
      drawHeight = containerWidth / imgAspect;
      drawX = 0;
      drawY = (containerHeight - drawHeight) / 2;
    } else {
      // Container is taller than image - fit to height
      drawHeight = containerHeight;
      drawWidth = containerHeight * imgAspect;
      drawX = (containerWidth - drawWidth) / 2;
      drawY = 0;
    }

    // Clear and draw
    ctx.clearRect(0, 0, containerWidth, containerHeight);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  /**
   * Draw hero product shot with scaling, padding, and optional border
   * Draws ON TOP of existing canvas content (doesn't clear) for layering effect
   */
  const drawHeroWithEffects = useCallback((img: HTMLImageElement, scale: number, showBorder: boolean) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get container dimensions (canvas is already sized by drawFrame)
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // DON'T clear canvas - we're drawing on top of the background frame

    // Define padding (image won't touch edges)
    const padding = 40;
    const availableWidth = containerWidth - (padding * 2);
    const availableHeight = containerHeight - (padding * 2);

    // Calculate dimensions to fit within padded area (contain behavior)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const availableAspect = availableWidth / availableHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (availableAspect > imgAspect) {
      // Available area is wider - fit to height
      drawHeight = availableHeight * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      // Available area is taller - fit to width
      drawWidth = availableWidth * scale;
      drawHeight = drawWidth / imgAspect;
    }

    // Center the image
    const drawX = (containerWidth - drawWidth) / 2;
    const drawY = (containerHeight - drawHeight) / 2;

    // Draw border if specified (at final frames)
    if (showBorder) {
      const borderRadius = 24;
      const borderWidth = 2;
      const borderColor = '#264013';

      // Draw rounded rectangle border
      ctx.beginPath();
      ctx.roundRect(drawX - borderWidth, drawY - borderWidth, drawWidth + borderWidth * 2, drawHeight + borderWidth * 2, borderRadius);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Clip to rounded rectangle for image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawWidth, drawHeight, borderRadius);
      ctx.clip();
    }

    // Draw image on top of background
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    if (showBorder) {
      ctx.restore();
    }
  }, []);

  /**
   * Update canvas when progress changes
   * Uses requestAnimationFrame for smooth rendering
   * Shows hero image with zoom-out effect at the end (progress > 0.95)
   */
  useEffect(() => {
    // Skip if progress hasn't changed significantly
    if (Math.abs(progress - lastProgressRef.current) < 0.001) return;
    lastProgressRef.current = progress;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      // Always draw the background frame first
      const frame = getFrameByProgress(progress);
      if (frame && frame.complete && frame.naturalWidth > 0) {
        drawFrame(frame);
      }

      // Frame 230 is at index ~107/121, progress ~0.885
      // Frame 272 is at index ~116/121, progress ~0.967 (start border)
      // Frame 276 is at index ~117/121, progress ~0.975
      // Frame 280 is at index ~118/121, progress ~0.983
      // Layer hero image on top starting from frame 230 (progress 0.885)
      if (progress > 0.885 && heroImageRef.current && heroImageLoaded) {
        // Calculate hero reveal progress (0.885 to 1.0)
        const heroStartProgress = 0.885;
        const heroBorderProgress = 0.967; // Frame 272 (2 frames before 280)
        const heroProgress = (progress - heroStartProgress) / (1.0 - heroStartProgress);
        
        // Gradually scale from 0.6 to 1.0 (revealing effect)
        const scale = 0.6 + (heroProgress * 0.4);
        
        // Show border starting at frame 272 (progress >= 0.967)
        const showBorder = progress >= heroBorderProgress;
        
        // Draw hero on top of background (don't clear canvas)
        drawHeroWithEffects(heroImageRef.current, scale, showBorder);
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress, getFrameByProgress, drawFrame, drawHeroWithEffects, heroImageLoaded]);

  /**
   * Handle window resize
   * Redraws current frame at new dimensions
   */
  useEffect(() => {
    const handleResize = () => {
      const frame = getFrameByProgress(progress);
      if (frame && frame.complete && frame.naturalWidth > 0) {
        drawFrame(frame);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [progress, getFrameByProgress, drawFrame]);

  /**
   * Draw first frame once loading completes
   */
  useEffect(() => {
    if (!isLoading && frames.length > 0) {
      const firstFrame = frames[0];
      if (firstFrame && firstFrame.complete && firstFrame.naturalWidth > 0) {
        drawFrame(firstFrame);
      }
    }
  }, [isLoading, frames, drawFrame]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
      data-component="canvas-sequence"
    >
      {/* Loading indicator - shows until frames are ready */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-adaline-cream z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-2 border-adaline-dark/20 border-t-adaline-dark rounded-full animate-spin" />
            <span className="text-sm text-adaline-dark/60 font-medium">
              Loading... {Math.round(loadProgress * 100)}%
            </span>
          </div>
        </div>
      )}
      
      {/* Canvas element */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-out"
        }}
      />
    </div>
  );
}
