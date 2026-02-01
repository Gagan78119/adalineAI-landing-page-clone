"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

/**
 * MultilayerIcon Component - Adaline Icon System
 * 
 * DETERMINISTIC CONSTRUCTION - NOT dynamic layout
 * 
 * CONSTRUCTION PHASES:
 * 1. ANCHOR: One shape defines the coordinate system (never moves)
 * 2. STRUCTURE: Secondary shapes at FIXED percentage offsets from anchor
 * 3. ACCENTS: Plus icons added LAST as decorative overlays only
 * 
 * RULES:
 * - No flexbox/grid for positioning
 * - No auto-centering
 * - No dynamic calculations
 * - All positions are hardcoded percentage offsets
 * - Structure must be valid WITHOUT accents (visual truth test)
 * 
 * VISUAL TRUTH TEST:
 * If you hide all accent elements (plus signs), the silhouette 
 * must still look EXACTLY like the reference Adaline icon.
 */

// ============================================
// TYPES
// ============================================

type IconType = "iterate" | "evaluate" | "deploy" | "monitor";

// Shape types available
type ShapeType = 
  | "polygon-composite"   // heptagon + nonagon layered (ITERATE)
  | "circle"              // solid circle
  | "dashed-circle"       // dashed circle
  | "circle-composite"    // solid + dashed circle layered (EVALUATE structure)
  | "wheel"               // innercone/wheel shape (DEPLOY)
  | "plus";

type Role = "anchor" | "structure" | "accent";

interface ShapeDefinition {
  type: ShapeType;
  role: Role;
  size: number;      // percentage of container (0-100)
  offsetX: number;   // percentage offset from left (can be negative)
  offsetY: number;   // percentage offset from top (can be negative)
  opacity?: number;
}

// ============================================
// SVG COMPONENTS - Inline for currentColor support
// ============================================

// Composite polygon: heptagon + nonagon layered together (ITERATE signature shape)
const PolygonComposite: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    {/* Heptagon (7-sided) */}
    <path 
      fill="none" 
      stroke="currentColor" 
      d="m32 8 18.764 9.036 4.634 20.304-12.985 16.283H21.587L8.602 37.341l4.634-20.305z" 
      vectorEffect="non-scaling-stroke"
    />
    {/* Nonagon (9-sided) */}
    <path 
      fill="none" 
      stroke="currentColor" 
      d="m32 8 15.427 5.615 8.208 14.217L52.785 44 40.209 54.553H23.79L11.215 44l-2.85-16.168 8.208-14.217z" 
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

// Circle composite: solid + dashed circle layered (EVALUATE/MONITOR structure)
const CircleComposite: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    {/* Solid circle */}
    <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    {/* Dashed circle - slightly larger */}
    <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeDasharray="5 3" vectorEffect="non-scaling-stroke" />
  </svg>
);

// Wheel/innercone shape (DEPLOY)
const Wheel: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    <path 
      fill="none" 
      stroke="currentColor" 
      d="M30.803 8.03c-7.956.39-14.893 4.654-18.965 10.946L19.53 24.8l-8.893-3.75A23.9 23.9 0 0 0 8 32c0 3.945.952 7.667 2.638 10.95l8.892-3.75-7.691 5.825c4.072 6.291 11.01 10.555 18.964 10.946L32 46.4l1.198 9.57c7.954-.392 14.89-4.656 18.963-10.947l-7.69-5.823 8.89 3.749A23.9 23.9 0 0 0 56 32c0-3.944-.951-7.666-2.637-10.948L44.472 24.8l7.69-5.824C48.092 12.685 41.155 8.42 33.2 8.029l-1.198 9.572z" 
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const SVG_COMPONENTS: Record<ShapeType, React.FC<{ className?: string }>> = {
  "polygon-composite": PolygonComposite,
  "circle-composite": CircleComposite,
  wheel: Wheel,
  circle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  ),
  "dashed-circle": ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeDasharray="5 3" vectorEffect="non-scaling-stroke" />
    </svg>
  ),
  plus: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
      <path d="M28 32h8M32 28v8" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
    </svg>
  ),
};

// ============================================
// ANIMATION CONFIG BY ROLE
// ============================================

const ROLE_ANIMATION: Record<Role, { speed: number; direction: 1 | -1; hoverScale: number }> = {
  anchor: { speed: 140, direction: 1, hoverScale: 2 },      // Slow, clockwise
  structure: { speed: 80, direction: -1, hoverScale: 3 },   // Counter-rotation
  accent: { speed: 0, direction: 1, hoverScale: 0 },        // No rotation
};

// ============================================
// SIZE SYSTEM (Adaline canonical ratios)
// ============================================
// Core = 100%
// Primary support = 70%
// Secondary support = 45%
// Accent = 26-30%
// Plus icon = 14-16% (constant, subtle, secondary)
// ============================================

// ============================================
// POLAR CONSTRUCTION HELPER
// ============================================
// Convert radius + angle to x/y offsets from anchor center
// This ensures organic, directional silhouettes
function polar(radius: number, angleDeg: number, anchorX: number, anchorY: number): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: anchorX + radius * Math.cos(angleRad),
    y: anchorY + radius * Math.sin(angleRad),
  };
}

// ============================================
// ITERATE ICON - "Overlapping structure"
// LEFT-WEIGHTED - Anchor at center-right, supports orbit left
// ============================================
const ITERATE_ANCHOR = { x: 22, y: 30 }; // Anchor position (center of large polygon)

const ITERATE_COMPOSITION: ShapeDefinition[] = [
  // PHASE 1: ANCHOR - Large polygon-composite (100%) - DOMINANT
  { type: "polygon-composite", role: "anchor", size: 100, offsetX: ITERATE_ANCHOR.x, offsetY: ITERATE_ANCHOR.y },
  
  // PHASE 2: STRUCTURE - Placed on ORBITS around anchor
  // Medium polygon (70%) - upper-left orbit, radius 38, angle 140°
  { type: "polygon-composite", role: "structure", size: 70, 
    offsetX: polar(38, 140, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 35,
    offsetY: polar(38, 140, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 35 },
  // Small polygon (45%) - lower-left orbit, radius 45, angle 200°
  { type: "polygon-composite", role: "structure", size: 45, 
    offsetX: polar(45, 200, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 22,
    offsetY: polar(45, 200, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 22 },
  // Tiny accent polygon (26%) - upper-right orbit, radius 52, angle 320°
  { type: "polygon-composite", role: "structure", size: 26, 
    offsetX: polar(52, 320, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 13,
    offsetY: polar(52, 320, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 13 },
  
  // PHASE 3: ACCENTS - Plus icons on tension points (edges/intersections)
  { type: "plus", role: "accent", size: 14, offsetX: ITERATE_ANCHOR.x + 36, offsetY: ITERATE_ANCHOR.y + 36 },
  { type: "plus", role: "accent", size: 12, offsetX: polar(38, 140, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 6, offsetY: polar(38, 140, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 6 },
  { type: "plus", role: "accent", size: 10, offsetX: polar(45, 200, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 5, offsetY: polar(45, 200, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 5 },
  { type: "plus", role: "accent", size: 8, offsetX: polar(52, 320, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).x - 4, offsetY: polar(52, 320, ITERATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 4 },
];

// ============================================
// EVALUATE ICON - "Layered scope"
// Triangular - Dashed anchor right, solids orbit left
// ============================================
const EVALUATE_ANCHOR = { x: 25, y: 15 };

const EVALUATE_COMPOSITION: ShapeDefinition[] = [
  // PHASE 1: ANCHOR - Large dashed circle (100%) - RIGHT, DOMINANT
  { type: "dashed-circle", role: "anchor", size: 100, offsetX: EVALUATE_ANCHOR.x, offsetY: EVALUATE_ANCHOR.y },
  
  // PHASE 2: STRUCTURE - Solids on left-side orbit
  // Solid circle A (70%) - upper-left orbit, radius 42, angle 145°
  { type: "circle", role: "structure", size: 70, 
    offsetX: polar(42, 145, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 35,
    offsetY: polar(42, 145, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).y - 35 },
  // Solid circle B (70%) - lower-left orbit, radius 48, angle 215°
  { type: "circle", role: "structure", size: 70, 
    offsetX: polar(48, 215, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 35,
    offsetY: polar(48, 215, EVALUATE_ANCHOR.x, ITERATE_ANCHOR.y).y - 35 },
  // Small dashed accent (28%) - lower-right orbit, radius 55, angle 330°
  { type: "dashed-circle", role: "structure", size: 28, 
    offsetX: polar(55, 330, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 14,
    offsetY: polar(55, 330, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).y - 14 },
  
  // PHASE 3: ACCENTS - Plus icons at orbit extremes
  { type: "plus", role: "accent", size: 14, offsetX: EVALUATE_ANCHOR.x + 36, offsetY: EVALUATE_ANCHOR.y + 36 },
  { type: "plus", role: "accent", size: 12, offsetX: polar(42, 145, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 6, offsetY: polar(42, 145, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).y - 6 },
  { type: "plus", role: "accent", size: 12, offsetX: polar(48, 215, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 6, offsetY: polar(48, 215, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).y - 6 },
  { type: "plus", role: "accent", size: 8, offsetX: polar(55, 330, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).x - 4, offsetY: polar(55, 330, EVALUATE_ANCHOR.x, EVALUATE_ANCHOR.y).y - 4 },
];

// ============================================
// DEPLOY ICON - "Process + checkpoint"
// LEFT-WEIGHTED - Main wheel left, smaller wheels orbit right
// ============================================
const DEPLOY_ANCHOR = { x: 5, y: 18 };

const DEPLOY_COMPOSITION: ShapeDefinition[] = [
  // PHASE 1: ANCHOR - Large wheel (100%) - LEFT, DOMINANT
  { type: "wheel", role: "anchor", size: 100, offsetX: DEPLOY_ANCHOR.x, offsetY: DEPLOY_ANCHOR.y },
  
  // PHASE 2: STRUCTURE - Wheels on right-side orbits
  // Medium wheel (55%) - right orbit, radius 48, angle 25°
  { type: "wheel", role: "structure", size: 55, 
    offsetX: polar(48, 25, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 27,
    offsetY: polar(48, 25, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 27 },
  // Small wheel (38%) - upper-right orbit, radius 58, angle 340°
  { type: "wheel", role: "structure", size: 38, 
    offsetX: polar(58, 340, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 19,
    offsetY: polar(58, 340, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 19 },
  // Dashed checkpoint (26%) - lower-right orbit, radius 60, angle 50°
  { type: "dashed-circle", role: "structure", size: 26, 
    offsetX: polar(60, 50, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 13,
    offsetY: polar(60, 50, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 13 },
  
  // PHASE 3: ACCENTS - Plus icons at wheel centers and intersections
  { type: "plus", role: "accent", size: 14, offsetX: DEPLOY_ANCHOR.x + 43, offsetY: DEPLOY_ANCHOR.y + 43 },
  { type: "plus", role: "accent", size: 12, offsetX: polar(48, 25, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 6, offsetY: polar(48, 25, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 6 },
  { type: "plus", role: "accent", size: 10, offsetX: polar(58, 340, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 5, offsetY: polar(58, 340, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 5 },
  { type: "plus", role: "accent", size: 8, offsetX: polar(60, 50, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).x - 4, offsetY: polar(60, 50, DEPLOY_ANCHOR.x, DEPLOY_ANCHOR.y).y - 4 },
];

// ============================================
// MONITOR ICON - "Nested observation"
// LEFT-WEIGHTED - Nested core left, satellites orbit right
// ============================================
const MONITOR_ANCHOR = { x: 0, y: 5 };

const MONITOR_COMPOSITION: ShapeDefinition[] = [
  // PHASE 1: ANCHOR - Large dashed circle (100%) - LEFT, DOMINANT
  { type: "dashed-circle", role: "anchor", size: 100, offsetX: MONITOR_ANCHOR.x, offsetY: MONITOR_ANCHOR.y },
  
  // PHASE 2: STRUCTURE
  // Inner solid circle (68%) - nested at same center
  { type: "circle", role: "structure", size: 68, 
    offsetX: MONITOR_ANCHOR.x + 16,
    offsetY: MONITOR_ANCHOR.y + 16 },
  // Top-right satellite dashed (32%) - radius 58, angle 335°
  { type: "dashed-circle", role: "structure", size: 32, 
    offsetX: polar(58, 335, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).x - 16,
    offsetY: polar(58, 335, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).y - 16 },
  // Bottom-right satellite dashed (34%) - radius 55, angle 25°
  { type: "dashed-circle", role: "structure", size: 34, 
    offsetX: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).x - 17,
    offsetY: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).y - 17 },
  // Solid inside bottom satellite (22%)
  { type: "circle", role: "structure", size: 22, 
    offsetX: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).x - 11,
    offsetY: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).y - 11 },
  
  // PHASE 3: ACCENTS - Plus icons at centers
  { type: "plus", role: "accent", size: 14, offsetX: MONITOR_ANCHOR.x + 43, offsetY: MONITOR_ANCHOR.y + 43 },
  { type: "plus", role: "accent", size: 10, offsetX: polar(58, 335, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).x - 5, offsetY: polar(58, 335, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).y - 5 },
  { type: "plus", role: "accent", size: 10, offsetX: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).x - 5, offsetY: polar(55, 25, MONITOR_ANCHOR.x, MONITOR_ANCHOR.y).y - 5 },
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
  const timelinesRef = useRef<gsap.core.Tween[]>([]);

  // Initialize role-based animations on mount
  useEffect(() => {
    const timelines: gsap.core.Tween[] = [];

    composition.forEach((item, i) => {
      const el = layerRefs.current[i];
      if (!el) return;

      const roleAnim = ROLE_ANIMATION[item.role];
      
      // Only anchor and structure rotate; accents don't
      if (roleAnim.speed > 0) {
        const tl = gsap.to(el, {
          rotation: `${roleAnim.direction === 1 ? "+=" : "-="}360`,
          duration: roleAnim.speed,
          repeat: -1,
          ease: "none",
        });
        timelines.push(tl);
      }
    });

    timelinesRef.current = timelines;

    return () => {
      timelines.forEach(tl => tl.kill());
    };
  }, [composition]);

  // Hover IN: Modulate based on role (accents/plus icons do NOT animate)
  const handleMouseEnter = useCallback(() => {
    let timelineIndex = 0;
    
    composition.forEach((item, i) => {
      const el = layerRefs.current[i];
      if (!el) return;

      const roleAnim = ROLE_ANIMATION[item.role];

      // Only anchor and structure speed up - accents stay static
      if (item.role !== "accent") {
        const tl = timelinesRef.current[timelineIndex];
        if (tl) {
          gsap.to(tl, {
            timeScale: roleAnim.hoverScale,
            duration: 0.4,
            ease: "power2.out",
          });
        }
        timelineIndex++;
      }
    });
  }, [composition]);

  // Hover OUT: Restore idle state
  const handleMouseLeave = useCallback(() => {
    // Restore all timelines to normal speed
    timelinesRef.current.forEach(tl => {
      gsap.to(tl, {
        timeScale: 1,
        duration: 0.6,
        ease: "power2.inOut",
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        DETERMINISTIC RENDERING ORDER:
        1. Anchor shapes first (defines coordinate system)
        2. Structure shapes second (fixed offsets)
        3. Accent shapes last (decorative only)
      */}
      {composition.map((item, i) => {
        const SvgComponent = SVG_COMPONENTS[item.type];
        return (
          <div
            key={`${type}-${item.role}-${i}`}
            ref={(el) => { layerRefs.current[i] = el; }}
            className="absolute text-adaline-dark"
            style={{
              // FIXED PERCENTAGE POSITIONING - Relative to container
              // Using % ensures structure scales with container size
              width: `${item.size}%`,
              height: `${item.size}%`,
              left: `${item.offsetX}%`,
              top: `${item.offsetY}%`,
              opacity: item.opacity ?? 1,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <SvgComponent className="w-full h-full" />
          </div>
        );
      })}

      {/* Number badge - positioned to the right, avoiding overlap with tiny polygon */}
      <span 
        className="absolute w-6 h-6 rounded-full bg-[#d4e4c9] flex items-center justify-center text-xs font-medium text-adaline-dark z-10"
        style={{ right: -12, top: 0 }}
      >
        {number}
      </span>
    </div>
  );
}
