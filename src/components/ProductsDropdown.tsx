"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

/**
 * ProductsDropdown Component - Adaline Style Mega Menu
 * 
 * Premium full-width dropdown with:
 * - Hover intent delay (~100ms)
 * - GSAP-powered smooth animations
 * - Staggered content animation
 * - Icon wrapper animations on hover
 * - Soft background highlights
 */

// Products configuration with icons and sub-links
const products = [
  {
    id: "iterate",
    title: "ITERATE",
    heading: "Sketch, test\nand refine",
    icon: "/images/icons/heptagon-icon.svg",
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
    icon: "/images/icons/dottedcircle-icon.svg",
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
    icon: "/images/icons/nonagon-icon.svg",
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
    icon: "/images/icons/circle-icon.svg",
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

export default function ProductsDropdown({ isOpen, onOpen, onClose }: ProductsDropdownProps) {
  // Refs for GSAP animations
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentColumnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);
  const chevronRef = useRef<SVGSVGElement>(null);

  // Set card ref
  const setIconCardRef = useCallback((el: HTMLDivElement | null, index: number) => {
    iconCardsRef.current[index] = el;
  }, []);

  // Set column ref
  const setColumnRef = useCallback((el: HTMLDivElement | null, index: number) => {
    contentColumnsRef.current[index] = el;
  }, []);

  // Open dropdown with GSAP animation
  const openDropdown = useCallback(() => {
    if (isAnimatingRef.current || !dropdownRef.current) return;
    
    isAnimatingRef.current = true;
    onOpen();

    const dropdown = dropdownRef.current;
    const iconCards = iconCardsRef.current.filter(Boolean);
    const columns = contentColumnsRef.current.filter(Boolean);
    const divider = dividerRef.current;

    // Kill any existing animations
    gsap.killTweensOf([dropdown, ...iconCards, ...columns, divider]);

    // Create GSAP timeline for orchestrated animation
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Phase 1: Container reveal
    tl.fromTo(
      dropdown,
      {
        opacity: 0,
        y: -12,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      }
    );

    // Phase 2: Icon cards stagger animation
    tl.fromTo(
      iconCards,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.out",
      },
      "-=0.15"
    );

    // Phase 3: Divider line
    if (divider) {
      tl.fromTo(
        divider,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    // Phase 4: Content columns stagger
    tl.fromTo(
      columns,
      {
        opacity: 0,
        y: 8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.out",
      },
      "-=0.15"
    );

    // Animate chevron rotation
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [onOpen]);

  // Close dropdown with GSAP animation
  const closeDropdown = useCallback(() => {
    if (isAnimatingRef.current || !dropdownRef.current) return;
    
    isAnimatingRef.current = true;

    const dropdown = dropdownRef.current;
    const iconCards = iconCardsRef.current.filter(Boolean);
    const columns = contentColumnsRef.current.filter(Boolean);

    // Create GSAP timeline for smooth exit
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        isAnimatingRef.current = false;
      },
    });

    // Fade out content first
    tl.to([...columns.reverse(), ...iconCards.reverse()], {
      opacity: 0,
      y: -6,
      duration: 0.15,
      stagger: 0.02,
      ease: "power2.in",
    });

    // Then fade out container
    tl.to(
      dropdown,
      {
        opacity: 0,
        y: -12,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );

    // Animate chevron rotation back
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [onClose]);

  // Hover intent handlers
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Hover intent delay (~100ms)
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isOpen) {
        openDropdown();
      }
    }, 100);
  }, [isOpen, openDropdown]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Small delay before closing
    hoverTimeoutRef.current = setTimeout(() => {
      if (isOpen) {
        closeDropdown();
      }
    }, 80);
  }, [isOpen, closeDropdown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Icon card hover animation
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const iconWrapper = card.querySelector(".icon-wrapper");
    
    if (iconWrapper) {
      gsap.to(iconWrapper, {
        scale: 1.05,
        y: -2,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const iconWrapper = card.querySelector(".icon-wrapper");
    
    if (iconWrapper) {
      gsap.to(iconWrapper, {
        scale: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  // Link hover animation
  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      x: 3,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
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
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {/* Full-Width Mega Menu Dropdown */}
      <div
        ref={dropdownRef}
        className={`fixed left-0 right-0 top-[80px] bg-adaline-cream border-t border-b border-black/5 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        style={{
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12">
          {/* Top Section - Icon Cards */}
          <div className="grid grid-cols-4 gap-8 mb-10">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => setIconCardRef(el, index)}
                className="flex flex-col items-start cursor-pointer group"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                style={{ willChange: "transform, opacity" }}
              >
                {/* Icon with number badge */}
                <div className="icon-wrapper relative w-24 h-24 mb-3">
                  <div className="w-full h-full text-adaline-dark/80">
                    <Image
                      src={product.icon}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* Number badge */}
                  <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#d4e4c9] flex items-center justify-center text-xs font-medium text-adaline-dark">
                    {product.number}
                  </span>
                </div>
                {/* Product title */}
                <span className="text-sm font-medium tracking-wider text-adaline-dark uppercase">
                  {product.title}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="h-px bg-adaline-dark/10 mb-10 origin-left"
            style={{ willChange: "transform, opacity" }}
          />

          {/* Bottom Section - Content Columns */}
          <div className="grid grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={`content-${product.id}`}
                ref={(el) => setColumnRef(el, index)}
                className="flex flex-col"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Category label */}
                <span className="text-xs font-medium tracking-wider text-adaline-dark/60 uppercase mb-3">
                  {product.title}
                </span>
                
                {/* Main heading */}
                <h3 className="text-2xl font-serif text-adaline-dark leading-tight mb-5 whitespace-pre-line">
                  {product.heading}
                </h3>
                
                {/* Links */}
                <div className="flex flex-col gap-2">
                  {product.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-adaline-dark/70 hover:text-adaline-dark transition-colors duration-200 flex items-center gap-1"
                      onMouseEnter={handleLinkMouseEnter}
                      onMouseLeave={handleLinkMouseLeave}
                    >
                      {link.label}
                      {link.external && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="ml-0.5"
                        >
                          <path
                            d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
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
