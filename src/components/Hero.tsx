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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 text-center">
        {/* Main Headline */}
        <h1 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-serif font-normal text-adaline-dark leading-[1.2] tracking-[-0.01em]">
          {headline}
        </h1>

        {/* Optional Subheadline */}
        {subheadline && (
          <p className="mt-6 text-lg sm:text-xl text-adaline-dark/70 max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
      </div>
    </section>
  );
}
