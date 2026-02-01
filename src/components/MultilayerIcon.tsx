"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * MultilayerIcon Component - Adaline Icon System
 * 
 * ASSET-BASED RECONSTRUCTION (V2 REFINED - SCALED DOWN)
 * - Shapes reduced by ~20% to prevent overflow.
 * - Tighter packing for better structure.
 * - Strict 4-element clusters.
 * - DOUBLED Plus Icon Sizes (~50%).
 */

// ============================================
// TYPES
// ============================================

type IconType = "iterate" | "evaluate" | "deploy" | "monitor";

type ShapeType = 
  | "nonagon"       // public/images/icons/nonagon-icon.svg
  | "heptagon"      // public/images/icons/heptagon-icon.svg
  | "circle"        // public/images/icons/circle-icon.svg
  | "dotted-circle" // public/images/icons/dottedcircle-icon.svg
  | "innercone"     // public/images/icons/innercone-circle-icon.svg
  | "plus";         // public/images/icons/plus-icon.svg

type Role = "anchor" | "structure" | "accent";

interface ShapeDefinition {
  type: ShapeType;
  role: Role;
  size: number;      // percentage
  x: number;         // percentage left
  y: number;         // percentage top
  opacity?: number;
  rotation?: number; 
  animate?: boolean;
  speed?: number;    
  direction?: 1 | -1;
  hasPlus?: boolean;
  plusSize?: number; // percentage relative to THIS shape
}

// ============================================
// ASSET MAPPING
// ============================================

const ASSETS: Record<ShapeType, string> = {
  "nonagon": "/images/icons/nonagon-icon.svg",
  "heptagon": "/images/icons/heptagon-icon.svg",
  "circle": "/images/icons/circle-icon.svg",
  "dotted-circle": "/images/icons/dottedcircle-icon.svg",
  "innercone": "/images/icons/innercone-circle-icon.svg",
  "plus": "/images/icons/plus-icon.svg",
};

// ============================================
// COMPOSITIONS (SCALED DOWN ~20%, PLUS DOUBLED)
// ============================================

const ITERATE_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Exact positioning from original images
  // Top polygon (medium)
  { type: "nonagon", role: "anchor", size: 48, x: 12, y: 8, animate: true, speed: 120, hasPlus: false },
  { type: "heptagon", role: "anchor", size: 48, x: 12, y: 8, animate: true, speed: 115, direction: -1, hasPlus: true, plusSize: 140 },
  
  // Bottom-right polygon (largest)
  { type: "nonagon", role: "structure", size: 54, x: 28, y: 44, animate: true, speed: 100, direction: -1, hasPlus: false },
  { type: "heptagon", role: "structure", size: 54, x: 28, y: 44, animate: true, speed: 95, hasPlus: true, plusSize: 140 },
  
  // Left polygon (medium)
  { type: "nonagon", role: "structure", size: 44, x: -4, y: 38, animate: true, speed: 90, hasPlus: false },
  { type: "heptagon", role: "structure", size: 44, x: -4, y: 38, animate: true, speed: 85, direction: -1, hasPlus: true, plusSize: 150 },
  
  // Top-right satellite (small)
  { type: "nonagon", role: "accent", size: 20, x: 70, y: 18, animate: true, speed: 70, direction: -1, hasPlus: false },
  { type: "heptagon", role: "accent", size: 20, x: 70, y: 18, animate: true, speed: 65, hasPlus: true, plusSize: 150 },
];

const EVALUATE_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Exact positioning from original images
  // Top-center circle
  { type: "dotted-circle", role: "anchor", size: 54, x: 22, y: 8, animate: true, speed: 110, hasPlus: true, plusSize: 140 },
  
  // Bottom-left circle
  { type: "dotted-circle", role: "structure", size: 52, x: 4, y: 46, animate: true, speed: 95, direction: -1, hasPlus: true, plusSize: 140 },
  
  // Bottom-right circle
  { type: "dotted-circle", role: "structure", size: 48, x: 38, y: 50, animate: true, speed: 100, hasPlus: true, plusSize: 140 },
  
  // Right satellite
  { type: "dotted-circle", role: "accent", size: 22, x: 76, y: 32, animate: true, speed: 80, direction: -1, hasPlus: true, plusSize: 150 },
];

const DEPLOY_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Exact positioning from original images
  // Large gear (bottom-left)
  { type: "innercone", role: "anchor", size: 72, x: 8, y: 38, animate: true, speed: 140, hasPlus: true, plusSize: 140 },
  
  // Medium gear (top-right)
  { type: "innercone", role: "structure", size: 50, x: 46, y: 10, animate: true, speed: 100, direction: -1, hasPlus: true, plusSize: 140 },
  
  // Small gear (top-center)
  { type: "innercone", role: "structure", size: 32, x: 30, y: 2, animate: true, speed: 80, hasPlus: true, plusSize: 150 },
  
  // Tiny gear (bottom-right)
  { type: "innercone", role: "accent", size: 26, x: 64, y: 68, animate: true, speed: 60, direction: -1, hasPlus: true, plusSize: 150 },
];

const MONITOR_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Exact positioning from original images
  // Large concentric (top-left)
  { type: "dotted-circle", role: "anchor", size: 62, x: 10, y: 10, animate: true, speed: 120 },
  { type: "circle", role: "structure", size: 42, x: 20, y: 20, animate: false, hasPlus: true, plusSize: 140 },
  
  // Medium concentric (bottom-right)
  { type: "dotted-circle", role: "structure", size: 52, x: 46, y: 52, animate: true, speed: 100, direction: -1 },
  { type: "circle", role: "structure", size: 36, x: 54, y: 60, animate: false, hasPlus: true, plusSize: 140 },

  // Small concentric (bottom-left)
  { type: "dotted-circle", role: "structure", size: 42, x: 4, y: 62, animate: true, speed: 80 },
  { type: "circle", role: "structure", size: 30, x: 10, y: 68, animate: false, hasPlus: true, plusSize: 150 },

  // Tiny satellite (top-right)
  { type: "dotted-circle", role: "accent", size: 24, x: 76, y: 16, animate: true, speed: 70, direction: -1, hasPlus: true, plusSize: 150 },
];

const ICON_COMPOSITIONS: Record<IconType, ShapeDefinition[]> = {
  iterate: ITERATE_COMPOSITION,
  evaluate: EVALUATE_COMPOSITION,
  deploy: DEPLOY_COMPOSITION,
  monitor: MONITOR_COMPOSITION,
};

// ============================================
// COMPONENT
// ============================================

interface MultilayerIconProps {
  type: IconType;
  number: string;
  className?: string; // e.g. w-[180px] h-[180px]
}

export default function MultilayerIcon({ type, number, className = "" }: MultilayerIconProps) {
  const composition = ICON_COMPOSITIONS[type];
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plusRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Init Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      composition.forEach((item, i) => {
        const el = layerRefs.current[i];
        const plusEl = plusRefs.current[i];
        if (!el || !item.animate) return;

        const duration = item.speed || 100;
        const direction = item.direction || 1;

        // Rotate the shape
        gsap.to(el, {
          rotation: direction === 1 ? "+=360" : "-=360",
          duration: duration,
          repeat: -1,
          ease: "none",
        });

        // Counter-rotate the plus icon to keep it straight
        if (plusEl && item.hasPlus) {
          gsap.to(plusEl, {
            rotation: direction === 1 ? "-=360" : "+=360",
            duration: duration,
            repeat: -1,
            ease: "none",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [composition]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {composition.map((item, i) => (
        <div
          key={`${type}-${i}`}
          ref={(el) => { layerRefs.current[i] = el; }}
          className="absolute"
          style={{
            width: `${item.size}%`,
            height: `${item.size}%`,
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity ?? 1,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {/* Main Shape Mask */}
          <div 
            className="w-full h-full bg-[#264013]" 
            style={{
              maskImage: `url(${ASSETS[item.type]})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url(${ASSETS[item.type]})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />

          {/* Plus Icon Mask - Larger and kept straight (no rotation) */}
          {item.hasPlus && (
            <div 
              ref={(el) => { plusRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d4a1f] opacity-80"
              style={{
                width: `${item.plusSize || 20}%`,
                height: `${item.plusSize || 20}%`,
                transformOrigin: "center center",
                maskImage: `url(${ASSETS.plus})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskImage: `url(${ASSETS.plus})`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
              }}
            />
          )}
        </div>
      ))}

      {/* Number Badge - positioned close to the right of icon */}
      <span 
        className="absolute w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 border border-[#2d4a1f]/20 text-[#2d4a1f] text-[14px]"
        style={{ 
          left: 'calc(100% + 8px)',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#ddeabd',
        }}
      >
        {number}
      </span>

      {/* Text Label - positioned close after number */}
      <span 
        className="absolute font-semibold tracking-wide z-10 text-[#2d4a1f] uppercase"
        style={{ 
          left: 'calc(100% + 44px)',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '14px',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap',
        }}
      >
        {type}
      </span>
    </div>
  );
}
