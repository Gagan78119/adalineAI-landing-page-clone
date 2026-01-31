"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Navbar Component
 * 
 * Sticky navigation bar with logo, nav links, and CTA buttons.
 * Designed to be GSAP-compatible - no transforms applied that would interfere
 * with future ScrollTrigger pinning behavior.
 */

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
}

function NavLink({ href, children, hasDropdown = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-sm font-medium text-adaline-dark hover:text-adaline-primary transition-colors"
    >
      {children}
      {hasDropdown && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-transparent"
      data-component="navbar"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Desktop Navigation - Left */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/products" hasDropdown>
              PRODUCTS
            </NavLink>
            <NavLink href="/pricing">PRICING</NavLink>
            <NavLink href="/blog">BLOG</NavLink>
          </div>

          {/* Logo - Center (using official Adaline SVG) */}
          <Link href="/" className="flex items-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 84 15" className="text-adaline-primary h-5">
              <path d="M9.15.003.451 12.124v1.733h1.74l8.698-6.928V.003zM10.89 11.777H8.801v2.078h2.087zM39.034.67v5.113h-.036C38.52 5.034 37.472 4.5 36.301 4.5c-2.413 0-4.099 1.906-4.099 4.81 0 2.601 1.562 4.775 4.135 4.775 1.029 0 2.218-.517 2.697-1.425h.035l.089 1.193h1.349V.67zM36.46 12.73c-1.739 0-2.715-1.497-2.715-3.439 0-1.977.976-3.474 2.715-3.474 1.757 0 2.59 1.515 2.59 3.474 0 1.925-.887 3.439-2.59 3.439m13.396-.196V7.742c0-.516-.088-1.015-.283-1.443-.409-.98-1.491-1.8-3.248-1.8-1.916 0-3.584 1.052-3.655 2.887h1.473c.089-1.122 1.1-1.639 2.182-1.639 1.225 0 2.023.606 2.023 1.853v.66l-2.821.195c-2.395.16-3.265 1.568-3.265 2.94 0 1.265.976 2.69 3.159 2.69 1.348 0 2.43-.588 2.98-1.497h.036l.16 1.265h2.218v-1.318zm-1.508-2.53c0 1.586-1.082 2.762-2.697 2.762-1.295 0-1.828-.73-1.828-1.515 0-1.122.994-1.568 1.988-1.639l2.537-.178zM70.263 4.5c-1.1 0-2.414.57-2.857 1.621h-.036l-.106-1.39h-1.33v9.122h1.525v-4.24c0-.766.035-1.657.337-2.334.408-.82 1.189-1.39 2.094-1.39C71.31 5.89 72 6.78 72 8.189v5.665h1.509V7.974c0-2.174-1.225-3.474-3.248-3.474m13.236 5.22c0-.018.036-.25.036-.57 0-2.459-1.384-4.65-4.117-4.65-2.715 0-4.258 2.298-4.258 4.828 0 2.298 1.366 4.757 4.223 4.757 2.058 0 3.637-1.23 3.921-2.975h-1.526c-.302 1.104-1.136 1.621-2.342 1.621-1.721 0-2.715-1.514-2.715-2.922V9.72zM79.4 5.8c1.668 0 2.467 1.283 2.502 2.637h-5.128C76.81 7.101 77.857 5.8 79.4 5.8m-23.74 6.735V.669h-3.301v1.265h1.74v10.601h-1.882v1.318h5.359v-1.318zm6.813 0V4.732h-3.282V6.05h1.72v6.485H58.96v1.318h5.483v-1.318zM64.407.669h-1.934v1.907h1.934zM26.134 8.847l.107-.16h2.714V3.128L21.361 13.89h-1.916v-.036L28.885.67h1.738v13.22h-1.668V9.987h-2.82z"></path>
            </svg>
          </Link>

          {/* CTA Buttons - Right */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider text-adaline-primary border border-adaline-dark/20 rounded-full hover:border-adaline-dark/40 transition-colors bg-white"
            >
              <span className="w-5 h-5 rounded-full border border-adaline-dark/20 flex items-center justify-center">
                <svg className="w-2 h-2 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              WATCH DEMO
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 text-xs font-semibold tracking-wider text-white bg-adaline-primary rounded-full hover:bg-adaline-primary/90 transition-colors"
            >
              START FOR FREE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-adaline-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-adaline-dark/10">
            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-sm font-medium text-adaline-dark"
              >
                PRODUCTS
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-adaline-dark"
              >
                PRICING
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-adaline-dark"
              >
                BLOG
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-adaline-dark border border-adaline-dark/20 rounded-full"
                >
                  WATCH DEMO
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-adaline-primary rounded-full text-center"
                >
                  START FOR FREE
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
