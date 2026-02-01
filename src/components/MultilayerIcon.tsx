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
  // PRECISE REFERENCE MATCH: 3 main overlapping + 1 satellite
  // Cluster 1: Top-Left (Nonagon + Heptagon overlap)
  { type: "nonagon", role: "anchor", size: 48, x: 12, y: 8, animate: true, speed: 120, hasPlus: false },
  { type: "heptagon", role: "anchor", size: 48, x: 12, y: 8, animate: true, speed: 115, direction: -1, hasPlus: true, plusSize: 50 },
  
  // Cluster 2: Bottom-Right (Nonagon + Heptagon overlap, larger)
  { type: "nonagon", role: "structure", size: 52, x: 35, y: 42, animate: true, speed: 100, direction: -1, hasPlus: false },
  { type: "heptagon", role: "structure", size: 52, x: 35, y: 42, animate: true, speed: 95, hasPlus: true, plusSize: 50 },
  
  // Cluster 3: Left (Nonagon + Heptagon overlap, medium)
  { type: "nonagon", role: "structure", size: 38, x: 0, y: 42, animate: true, speed: 90, hasPlus: false },
  { type: "heptagon", role: "structure", size: 38, x: 0, y: 42, animate: true, speed: 85, direction: -1, hasPlus: true, plusSize: 55 },
  
  // Cluster 4: Top-Right Satellite (Nonagon + Heptagon overlap, small)
  { type: "nonagon", role: "accent", size: 22, x: 68, y: 18, animate: true, speed: 70, direction: -1, hasPlus: false },
  { type: "heptagon", role: "accent", size: 22, x: 68, y: 18, animate: true, speed: 65, hasPlus: true, plusSize: 55 },
];

const EVALUATE_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Large top + 2 bottom overlapping + 1 right satellite
  // 1. Large Dotted (Top-Center)
  { type: "dotted-circle", role: "anchor", size: 55, x: 20, y: 8, animate: true, speed: 110, hasPlus: true, plusSize: 50 },
  // 2. Medium Dotted (Bottom-Left)
  { type: "dotted-circle", role: "structure", size: 50, x: 5, y: 48, animate: true, speed: 95, direction: -1, hasPlus: true, plusSize: 50 },
  // 3. Medium Dotted (Bottom-Center, overlapping #2)
  { type: "dotted-circle", role: "structure", size: 45, x: 35, y: 55, animate: true, speed: 100, hasPlus: true, plusSize: 50 },
  // 4. Small Dotted (Right Satellite)
  { type: "dotted-circle", role: "accent", size: 28, x: 70, y: 30, animate: true, speed: 80, direction: -1, hasPlus: true, plusSize: 55 },
];

const DEPLOY_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: Large bottom-left + medium center-top + 2 small
  // 1. Large Gear (Bottom-Left)
  { type: "innercone", role: "anchor", size: 72, x: 5, y: 38, animate: true, speed: 140, hasPlus: true, plusSize: 50 },
  // 2. Medium Gear (Top-Center/Right)
  { type: "innercone", role: "structure", size: 48, x: 45, y: 15, animate: true, speed: 100, direction: -1, hasPlus: true, plusSize: 50 },
  // 3. Small Gear (Top-Left/Center)
  { type: "innercone", role: "structure", size: 35, x: 30, y: 5, animate: true, speed: 80, hasPlus: true, plusSize: 55 },
  // 4. Tiny Gear (Bottom-Right)
  { type: "innercone", role: "accent", size: 28, x: 62, y: 68, animate: true, speed: 60, direction: -1, hasPlus: true, plusSize: 55 },
];

const MONITOR_COMPOSITION: ShapeDefinition[] = [
  // PRECISE REFERENCE MATCH: 3 concentric pairs + 1 top-right satellite
  // Pair 1: Large Concentric (Top-Left)
  { type: "dotted-circle", role: "anchor", size: 60, x: 10, y: 10, animate: true, speed: 120 },
  { type: "circle", role: "structure", size: 44, x: 18, y: 18, animate: false, hasPlus: true, plusSize: 50 },
  
  // Pair 2: Medium Concentric (Bottom-Right)
  { type: "dotted-circle", role: "structure", size: 50, x: 45, y: 50, animate: true, speed: 100, direction: -1 },
  { type: "circle", role: "structure", size: 36, x: 52, y: 57, animate: false, hasPlus: true, plusSize: 50 },

  // Pair 3: Small Concentric (Bottom-Left)
  { type: "dotted-circle", role: "structure", size: 38, x: 8, y: 62, animate: true, speed: 80 },
  { type: "circle", role: "structure", size: 28, x: 13, y: 67, animate: false, hasPlus: true, plusSize: 55 },

  // Satellite: Tiny (Top-Right)
  { type: "dotted-circle", role: "accent", size: 26, x: 70, y: 15, animate: true, speed: 70, direction: -1, hasPlus: true, plusSize: 55 },
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

          {/* Plus Icon Mask - Scaled relative to the shape */}
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
