"use client";

import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import MultilayerIcon from "./MultilayerIcon";

/**
 * ProductsDropdown Component - Adaline Style Mega Menu
 * 
 * VERSION 2 - EXACT RECONSTRUCTION
 * - Split layout: Icons Top / Text Bottom
 * - Double dotted lines
 * - Bigger sizes (180px icons, 38px headings)
 * - Gear overlap logic
 */

interface ProductLink {
  label: string;
  href: string;
  external?: boolean;
}

interface Product {
  id: string;
  title: string;
  heading: string;
  iconType: "iterate" | "evaluate" | "deploy" | "monitor";
  number: string;
  links: ProductLink[];
}

const products: Product[] = [
  {
    id: "iterate",
    title: "ITERATE",
    heading: "Sketch, test\nand refine",
    iconType: "iterate",
    number: "1",
    links: [
      { label: "Editor", href: "/iterate/editor" },
      { label: "Playground", href: "/iterate/playground" },
      { label: "Datasets", href: "/iterate/datasets" },
    ],
  },
  {
    id: "evaluate",
    title: "EVALUATE",
    heading: "Reflect\nand measure",
    iconType: "evaluate",
    number: "2",
    links: [
      { label: "Evaluations", href: "/evaluate/evaluations" },
      { label: "Datasets", href: "/evaluate/datasets" },
    ],
  },
  {
    id: "deploy",
    title: "DEPLOY",
    heading: "From draft\nto live",
    iconType: "deploy",
    number: "3",
    links: [
      { label: "Deployments", href: "/deploy/deployments" },
      { label: "Analytics", href: "/deploy/analytics" },
      { label: "Gateway", href: "/deploy/gateway", external: true },
    ],
  },
  {
    id: "monitor",
    title: "MONITOR",
    heading: "Insights\nin real time",
    iconType: "monitor",
    number: "4",
    links: [
      { label: "Logs", href: "/monitor/logs" },
      { label: "Analytics", href: "/monitor/analytics" },
    ],
  },
];

interface ProductsDropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DottedLine = ({ className = "" }: { className?: string }) => (
  <div className={`absolute left-0 right-0 h-[2px] overflow-hidden pointer-events-none ${className}`}>
    <svg 
      className="absolute left-1/2 -translate-x-1/2 w-[200vw] min-w-[4000px]" 
      height="2" 
      viewBox="0 0 4000 2" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ opacity: 0.2 }}
    >
      <path 
        d="M0 1 H4000" 
        stroke="#264013" 
        strokeWidth="1" 
        strokeDasharray="4 4" 
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </div>
);

export default function ProductsDropdown({ isOpen, onOpen, onClose }: ProductsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  // Animation constants
  const DURATION = 0.4;
  const STAGGER = 0.05;

  const openDropdown = useCallback(() => {
    if (!dropdownRef.current) return;
    
    onOpen();
    const dropdown = dropdownRef.current;
    const icons = iconRefs.current.filter(Boolean);
    const texts = textRefs.current.filter(Boolean);

    gsap.killTweensOf([dropdown, ...icons, ...texts]);

    const tl = gsap.timeline();

    // Panel Slide
    tl.fromTo(dropdown, 
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: DURATION, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
    );

    // Icons Stagger
    tl.fromTo(icons,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: STAGGER, ease: "power2.out" },
      "-=0.25"
    );

    // Text Stagger (slightly delayed after icons)
    tl.fromTo(texts,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: STAGGER, ease: "power2.out" },
      "-=0.3"
    );

    if (chevronRef.current) {
      gsap.to(chevronRef.current, { rotation: 180, duration: 0.3 });
    }
  }, [onOpen]);

  const closeDropdown = useCallback(() => {
    if (!dropdownRef.current) return;
    
    const dropdown = dropdownRef.current;
    
    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to(dropdown, {
      y: -10,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    });

    if (chevronRef.current) {
      gsap.to(chevronRef.current, { rotation: 0, duration: 0.3 });
    }
  }, [onClose]);

  // Hover Intent
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isOpen) openDropdown();
    }, 100);
  }, [isOpen, openDropdown]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (isOpen) closeDropdown();
    }, 80);
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-2 font-mono text-base tracking-wider text-adaline-dark hover:text-adaline-dark/70 transition-colors duration-200 uppercase">
        PRODUCTS
        <svg
          ref={chevronRef}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="text-adaline-dark/60"
          style={{ transformOrigin: "center" }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      <div
        ref={dropdownRef}
        className={`fixed left-0 right-0 top-[80px] bg-[#FAF8F5] border-b border-[rgba(0,0,0,0.05)] ${
          isOpen ? "pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* TOP DOTTED LINE */}
        <DottedLine className="top-0" />

        <div className="max-w-[1500px] mx-auto px-20 py-20">
          {/* ICONS ROW */}
          <div className="grid grid-cols-4 gap-[60px] mb-12">
            {products.map((product, i) => (
              <div 
                key={`icon-${product.id}`} 
                ref={el => { iconRefs.current[i] = el; }}
                className="flex flex-col items-start pl-4" // slight pl to center visually
              >
                <MultilayerIcon 
                  type={product.iconType}
                  number={product.number}
                  className="w-[180px] h-[180px]" // Exact requested size
                />
              </div>
            ))}
          </div>

          {/* MIDDLE DOTTED LINE */}
          <div className="relative w-full h-[2px] mb-12">
             <DottedLine />
          </div>

          {/* TEXT CONTENT ROW */}
          <div className="grid grid-cols-4 gap-[60px]">
            {products.map((product, i) => (
              <div 
                key={`text-${product.id}`}
                ref={el => { textRefs.current[i] = el; }}
                className="flex flex-col pl-4"
              >
                <span className="text-[13px] font-semibold tracking-[0.15em] text-[#2d4a1f] uppercase mb-5">
                  {product.title}
                </span>
                
                <h3 
                  className="text-[38px] font-normal leading-[1.2] mb-7 text-black whitespace-pre-line"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {product.heading}
                </h3>
                
                <div className="flex flex-col gap-[14px]">
                  {product.links.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[17px] text-[#4a4a4a] hover:text-black transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.external && <span className="text-[12px] opacity-70">↗</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
