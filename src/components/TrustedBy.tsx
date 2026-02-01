"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * TrustedBy Component
 * 
 * Displays a horizontal scrolling marquee of company logos.
 * Uses CSS animation for smooth infinite scroll effect.
 * Fades out smoothly as user scrolls down.
 * 
 * Architecture Notes:
 * - Uses actual SVG logo files from public/images/logos
 * - Logos are duplicated to create seamless loop
 * - CSS mask-image used for fade edges instead of manual gradient divs
 * - GSAP ScrollTrigger for fade-out effect
 */

// Company logos configuration - matching Adaline's displayed logos
const companies = [
  { name: "Salesforce", logo: "/images/logos/salesforce.svg", width: 120 },
  { name: "Coframe", logo: "/images/logos/coframe.svg", width: 110 },
  { name: "Daybreak", logo: "/images/logos/daybreak.svg", width: 110 },
  { name: "HubSpot", logo: "/images/logos/hubspot.svg", width: 100 },
  { name: "Statflo", logo: "/images/logos/statflo.svg", width: 90 },
  { name: "Serif", logo: "/images/logos/serif.svg", width: 70 },
  { name: "Jusbrasil", logo: "/images/logos/jusbrasil.svg", width: 110 },
];

function LogoItem({ company }: { company: typeof companies[0] }) {
  return (
    <div className="shrink-0 flex items-center justify-center px-8 sm:px-12 h-12">
      <Image
        src={company.logo}
        alt={company.name}
        width={company.width}
        height={32}
        className="h-6 sm:h-7 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
        draggable={false}
      />
    </div>
  );
}

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Fade out as user scrolls down
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top center",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (sectionRef.current) {
          const progress = self.progress;
          const opacity = 1 - progress; // Fade to completely transparent
          
          gsap.set(sectionRef.current, {
            opacity: opacity,
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-5xl mx-auto bg-transparent py-4 overflow-hidden"
      data-component="trusted-by"
    >
      <div>
        {/* Section Label */}
        <p className="text-center text-[10px] font-semibold tracking-[0.2em] text-adaline-dark/40 uppercase mb-6">
          Trusted By
        </p>

        {/* Marquee Container */}
        <div 
          className="relative w-full overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
          }}
        >
          {/* Scrolling Track */}
          <div className="flex animate-marquee w-max items-center">
            {/* First set of logos */}
            <div className="flex items-center shrink-0">
              {companies.map((company) => (
                <LogoItem key={company.name} company={company} />
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center shrink-0">
              {companies.map((company) => (
                <LogoItem key={`${company.name}-dup`} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
