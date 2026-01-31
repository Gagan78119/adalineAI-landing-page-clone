/**
 * Hero Component
 * 
 * Main hero section with headline, description, and CTA buttons.
 * Centered layout with responsive typography.
 * 
 * Architecture Notes:
 * - Uses semantic HTML for accessibility
 * - Designed to blend seamlessly with the ScenicSection below
 * - No transforms that would interfere with future GSAP animations
 * - Proper vertical centering to match Adaline.ai
 */

interface HeroProps {
  headline?: string;
  subheadline?: string;
}

export default function Hero({
  headline = "The single platform to iterate, evaluate, deploy, and monitor AI agents",
  subheadline,
}: HeroProps) {
  return (
    <section
      className="relative w-full bg-transparent"
      data-component="hero"
    >
      {/* Content positioned at top, not vertically centered */}
      <div className="pt-8 sm:pt-12 lg:pt-16 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Main Headline - Matching Adaline's typography */}
          <h1 
            className="font-sans font-normal text-adaline-dark leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.25rem, 3.75vw, 3.75rem)" }}
          >
            {headline}
          </h1>

          {/* Optional Subheadline */}
          {subheadline && (
            <p className="mt-8 text-lg sm:text-xl text-adaline-dark/70 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
