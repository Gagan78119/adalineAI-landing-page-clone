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
// COMPOSITIONS (SCALED DOWN ~20%)
// ============================================

const ITERATE_COMPOSITION: ShapeDefinition[] = [
  // 1. Large Nonagon (Bottom/Center) - Scaled 105 -> 84
  { type: "nonagon", role: "anchor", size: 84, x: 8, y: 16, animate: true, speed: 120, hasPlus: true, plusSize: 24 },
  // 2. Medium Heptagon (Top Left) - Scaled 85 -> 68
  { type: "heptagon", role: "structure", size: 68, x: 0, y: 0, animate: true, speed: 90, direction: -1, hasPlus: true, plusSize: 20 },
  // 3. Medium Nonagon (Right Overlap) - Scaled 90 -> 72
  { type: "nonagon", role: "structure", size: 72, x: 45, y: 35, animate: true, speed: 100, hasPlus: true, plusSize: 20 },
  // 4. Small Heptagon (Top Right Satellite) - Scaled 45 -> 36
  { type: "heptagon", role: "accent", size: 36, x: 65, y: 5, animate: true, speed: 70, direction: -1, hasPlus: true, plusSize: 18 },
];

const EVALUATE_COMPOSITION: ShapeDefinition[] = [
  // 1. Large Dotted Anchor (Top/Center) - Scaled 100 -> 80
  { type: "dotted-circle", role: "anchor", size: 80, x: 10, y: 5, animate: true, speed: 110, hasPlus: true, plusSize: 26 },
  // 2. Medium Dotted (Bottom Left) - Scaled 85 -> 68
  { type: "dotted-circle", role: "structure", size: 68, x: -2, y: 50, animate: true, speed: 95, direction: -1, hasPlus: true, plusSize: 22 },
  // 3. Medium Dotted (Bottom Right) - Scaled 85 -> 68
  { type: "dotted-circle", role: "structure", size: 68, x: 48, y: 55, animate: true, speed: 100, hasPlus: true, plusSize: 22 },
  // 4. Small Dotted (Right Satellite) - Scaled 45 -> 36
  { type: "dotted-circle", role: "accent", size: 36, x: 72, y: 32, animate: true, speed: 80, direction: -1, hasPlus: true, plusSize: 18 },
];

const DEPLOY_COMPOSITION: ShapeDefinition[] = [
  // 1. Large Wheel (Bottom Left) - Scaled 110 -> 88
  { type: "innercone", role: "anchor", size: 88, x: 5, y: 25, animate: true, speed: 140, hasPlus: true, plusSize: 26 },
  // 2. Medium Wheel (Center Right) - Scaled 80 -> 64
  { type: "innercone", role: "structure", size: 64, x: 50, y: 15, animate: true, speed: 100, direction: -1, hasPlus: true, plusSize: 20 },
  // 3. Small Wheel (Top Center) - Scaled 50 -> 40
  { type: "innercone", role: "structure", size: 40, x: 35, y: -5, animate: true, speed: 80, hasPlus: true, plusSize: 16 },
  // 4. Tiny Wheel (Bottom Center overlap) - Scaled 40 -> 32
  { type: "innercone", role: "accent", size: 32, x: 55, y: 65, animate: true, speed: 60, direction: -1, hasPlus: true, plusSize: 14 },
];

const MONITOR_COMPOSITION: ShapeDefinition[] = [
  // 1. Large Concentric (Top Left) - Scaled 105 -> 84
  { type: "dotted-circle", role: "anchor", size: 84, x: 8, y: 8, animate: true, speed: 120 },
  { type: "circle", role: "structure", size: 62, x: 19, y: 19, animate: false, hasPlus: true, plusSize: 28 }, // Inner relative pos adjusted
  
  // 2. Medium Concentric (Bottom Right) - Scaled 80 -> 64
  { type: "dotted-circle", role: "structure", size: 64, x: 45, y: 50, animate: true, speed: 100, direction: -1 },
  { type: "circle", role: "structure", size: 44, x: 55, y: 60, animate: false, hasPlus: true, plusSize: 22 },

  // 3. Small Concentric (Bottom Left) - Scaled 55 -> 44
  { type: "dotted-circle", role: "structure", size: 44, x: 8, y: 65, animate: true, speed: 80 },
  { type: "circle", role: "structure", size: 30, x: 15, y: 72, animate: false, hasPlus: true, plusSize: 18 },

  // 4. Small Satellite (Top Right) - Scaled 40 -> 32
  { type: "dotted-circle", role: "accent", size: 32, x: 68, y: 8, animate: true, speed: 70, direction: -1, hasPlus: true, plusSize: 16 },
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
  className?: string;
}

export default function MultilayerIcon({ type, number, className = "" }: MultilayerIconProps) {
  const composition = ICON_COMPOSITIONS[type];
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Init Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      composition.forEach((item, i) => {
        const el = layerRefs.current[i];
        if (!el || !item.animate) return;

        const duration = item.speed || 100;
        const direction = item.direction || 1;

        gsap.to(el, {
          rotation: direction === 1 ? "+=360" : "-=360",
          duration: duration,
          repeat: -1,
          ease: "none",
        });
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

          {/* Plus Icon Mask */}
          {item.hasPlus && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d4a1f] opacity-80"
              style={{
                width: `${item.plusSize || 20}%`,
                height: `${item.plusSize || 20}%`,
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

      {/* Number Badge */}
      <span 
        className="absolute w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 bg-[#e8f5e9] border border-[#2d4a1f]/20 text-[#2d4a1f] text-[15px]"
        style={{ 
          right: -10,
          top: -10,
        }}
      >
        {number}
      </span>
    </div>
  );
}
