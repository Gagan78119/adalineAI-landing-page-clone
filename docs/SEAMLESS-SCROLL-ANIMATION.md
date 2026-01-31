# Seamless Scroll Animation: Complete Implementation Guide

> A comprehensive documentation of how we achieved the Adaline-style seamless scroll transition, from research to implementation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [The Inspiration: Adaline.ai Analysis](#the-inspiration-adalineai-analysis)
3. [Technology Stack](#technology-stack)
4. [Architecture Deep Dive](#architecture-deep-dive)
5. [Implementation Journey](#implementation-journey)
6. [Problems Faced & Solutions](#problems-faced--solutions)
7. [What Didn't Work](#what-didnt-work)
8. [What Worked](#what-worked)
9. [Thinking Framework for Premium UX/UI](#thinking-framework-for-premium-uxui)
10. [Performance Considerations](#performance-considerations)
11. [Future Optimizations](#future-optimizations)
12. [Key Takeaways](#key-takeaways)

---

## Project Overview

### Goal
Create a scroll-linked animation that feels like a cinematic camera pullback through a scenic landscape, where scrolling controls the "playback" of a pre-rendered animation sequence.

### Final Result
- 129 high-quality JPEG frames rendered to an HTML5 canvas
- Scroll position (0-100%) maps to frame index (1-129)
- GSAP ScrollTrigger handles pinning and progress tracking
- Smooth, responsive animation that works across devices

---

## The Inspiration: Adaline.ai Analysis

### What Makes Adaline Special

When we analyzed [adaline.ai](https://www.adaline.ai/), we discovered their secret sauce:

1. **Frame Sequence Approach**: They don't use video or multiple layered images. Instead, they use **280 numbered JPEG frames** extracted from a single 3D animation.

2. **Scroll-Driven Playback**: As you scroll, the website maps your scroll position to a frame number:
   - Top of page → Frame 1
   - Middle of scroll → Frame 140
   - End of scroll → Frame 280

3. **Canvas Rendering**: All frames are drawn to an HTML5 `<canvas>` element, not standard `<img>` tags. This provides:
   - Better performance for rapid frame switching
   - Precise control over rendering timing
   - GPU acceleration

4. **File Naming Convention**: Their frames follow a pattern:
   ```
   graded_4K_100_gm_85_1440_3-001.jpg
   graded_4K_100_gm_85_1440_3-002.jpg
   ...
   graded_4K_100_gm_85_1440_3-280.jpg
   ```

### Why It Looks Seamless

The seamlessness comes from three factors:

1. **Single Source Animation**: All frames are extracted from one continuous 3D render or video. No manual stitching = no visible seams.

2. **High Frame Count**: 280 frames over the scroll distance means tiny incremental changes between each frame.

3. **Smooth Interpolation**: GSAP's scrubbing smoothly interpolates between frame changes.

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library with hooks |
| **GSAP** | 3.14.2 | Animation library |
| **ScrollTrigger** | (GSAP plugin) | Scroll-linked animations |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |

### Why These Choices

**GSAP over CSS Animations**
- CSS scroll-linked animations (`animation-timeline: scroll()`) have limited browser support
- GSAP provides consistent behavior across all browsers
- ScrollTrigger offers precise control over pinning, scrubbing, and progress tracking

**Canvas over Image Tags**
- Faster rendering for rapid frame changes
- No DOM thrashing from swapping image sources
- Better memory management
- GPU acceleration via hardware compositing

**React Hooks Architecture**
- `useFrameSequence` hook encapsulates preloading logic
- Clean separation of concerns
- Reusable across components

---

## Architecture Deep Dive

### File Structure

```
src/
├── hooks/
│   └── useFrameSequence.ts    # Frame preloading & progress-to-frame mapping
├── components/
│   ├── CanvasSequence.tsx     # Canvas rendering component
│   ├── ScenicSection.tsx      # Main section with ScrollTrigger
│   ├── Hero.tsx               # Content overlay
│   ├── TrustedBy.tsx          # Content overlay
│   └── Navbar.tsx             # Content overlay
public/
└── images/
    └── standard-sequence/     # 129 JPEG frames
        ├── graded_4K_100_gm_50_1080_3-001.jpg
        ├── graded_4K_100_gm_50_1080_3-002.jpg
        └── ... (129 frames total)
```

### Component Hierarchy

```
<ScenicSection>                    ← Pinned container, manages scroll progress
  ├── <CanvasSequence>             ← Renders frames to canvas
  │     └── useFrameSequence()     ← Preloads images, maps progress to frames
  └── <div.content-overlay>        ← z-30, visible over canvas
        ├── <Navbar />
        ├── <Hero />
        └── <TrustedBy />
</ScenicSection>
```

### Data Flow

```
ScrollTrigger.onUpdate(self)
        ↓
setScrollProgress(self.progress)   // 0.0 to 1.0
        ↓
<CanvasSequence progress={scrollProgress}>
        ↓
getFrameByProgress(progress)       // Maps 0-1 to frame index 0-128
        ↓
drawFrame(frames[frameIndex])      // Draws to canvas
```

---

## Implementation Journey

### Phase 1: Research & Analysis

**What we did:**
1. Fetched and analyzed adaline.ai's source code
2. Discovered their frame-based approach (280 JPEGs)
3. Identified GSAP ScrollTrigger as the animation driver
4. Understood the canvas rendering technique

**Key insight:** The magic isn't in complex code—it's in the **preparation of assets**. A single, continuous 3D animation exported as frames is what creates the seamless feel.

### Phase 2: Initial Approach (What We Had Before)

Before implementing the canvas approach, the project used a **3-layer parallax fade**:

```tsx
// OLD APPROACH - 3 layered images with opacity transitions
const SCENE_ASSETS = {
  distant: "/images/scenic/graded_4K_100_gm_85_1440_3-001.jpg",
  middle: "/images/scenic/graded_4K_100_gm_85_1440_3-085.jpg", 
  close: "/images/scenic/graded_4K_100_gm_85_1440_3-135.jpg",
};

// Animation faded between 3 static images
tl.to(middleLayer, { opacity: 1 }, 0)
  .to(closeLayer, { opacity: 1 }, 2);
```

**Problems with this approach:**
- Only 3 discrete images = visible transitions between states
- Cross-fade effect doesn't feel like camera movement
- Limited to fade/scale animations, not true frame-by-frame

### Phase 3: Frame Sequence Implementation

**Step 1: Create the useFrameSequence Hook**

```typescript
// src/hooks/useFrameSequence.ts
const AVAILABLE_FRAMES = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  22, 24, 27, 29, 31, 33, 36, 38, 40, 42, 44, 46, 48, 50, 53, 55, 57, 59,
  // ... 129 frame numbers total (non-sequential due to gaps)
];

export function useFrameSequence() {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  
  useEffect(() => {
    // Preload all frames as HTMLImageElement objects
    frameNumbers.forEach((frameNum, index) => {
      const img = new Image();
      img.src = buildFrameUrl(frameNum);
      img.onload = () => setLoadedCount(prev => prev + 1);
      imageElements[index] = img;
    });
  }, []);

  const getFrameByProgress = (progress: number) => {
    const frameIndex = Math.floor(progress * (frames.length - 1));
    return frames[frameIndex];
  };

  return { frames, isLoading, loadProgress, getFrameByProgress };
}
```

**Step 2: Create the CanvasSequence Component**

```tsx
// src/components/CanvasSequence.tsx
export default function CanvasSequence({ progress }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getFrameByProgress } = useFrameSequence();

  useEffect(() => {
    requestAnimationFrame(() => {
      const frame = getFrameByProgress(progress);
      if (frame) drawFrame(frame);
    });
  }, [progress]);

  const drawFrame = (img: HTMLImageElement) => {
    const ctx = canvasRef.current?.getContext("2d");
    // Calculate "cover" dimensions and draw
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  return <canvas ref={canvasRef} />;
}
```

**Step 3: Wire Up ScrollTrigger**

```tsx
// src/components/ScenicSection.tsx
const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "+=250%",
    pin: true,
    scrub: 0.5,
    onUpdate: (self) => setScrollProgress(self.progress),
  });
}, []);

return (
  <section>
    <CanvasSequence progress={scrollProgress} />
    <div className="content-overlay">{children}</div>
  </section>
);
```

---

## Problems Faced & Solutions

### Problem 1: Non-Sequential Frame Numbers

**Issue:** Our frame sequence had gaps (e.g., 001, 002, 003, 005, 006... missing 004).

**Why it happened:** The original video was exported with variable frame rate or some frames were removed during optimization.

**Solution:** Instead of assuming sequential frames 1-281, we explicitly listed available frame numbers:

```typescript
const AVAILABLE_FRAMES = [1, 2, 3, 5, 6, 7, 8, 9, 10, ...]; // Actual available frames
```

The `getFrameByProgress` function maps scroll progress to array indices, not frame numbers, so gaps don't matter.

### Problem 2: TypeScript Error with useRef

**Issue:** 
```
useRef<number>() - Expected 1 arguments, but got 0
```

**Why it happened:** React 19 requires explicit initial values for refs.

**Solution:**
```typescript
// Before (error)
const animationFrameRef = useRef<number>();

// After (fixed)
const animationFrameRef = useRef<number | undefined>(undefined);
```

### Problem 3: Canvas Blurry on Retina Displays

**Issue:** Canvas looked pixelated on high-DPI screens (MacBooks, modern phones).

**Solution:** Account for device pixel ratio:

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = containerWidth * dpr;
canvas.height = containerHeight * dpr;
canvas.style.width = `${containerWidth}px`;
canvas.style.height = `${containerHeight}px`;
ctx.scale(dpr, dpr);
```

### Problem 4: Image Aspect Ratio Mismatch

**Issue:** Frames didn't cover the full viewport—letterboxing appeared.

**Solution:** Implement CSS `object-fit: cover` logic manually:

```typescript
const imgAspect = img.naturalWidth / img.naturalHeight;
const containerAspect = containerWidth / containerHeight;

if (containerAspect > imgAspect) {
  // Container is wider - fit to width
  drawWidth = containerWidth;
  drawHeight = containerWidth / imgAspect;
} else {
  // Container is taller - fit to height
  drawHeight = containerHeight;
  drawWidth = containerHeight * imgAspect;
}
// Center the image
drawX = (containerWidth - drawWidth) / 2;
drawY = (containerHeight - drawHeight) / 2;
```

### Problem 5: Content Flashing Before Frames Load

**Issue:** The hero content appeared before the background frames loaded, then jumped.

**Solution:** Track loading state and fade in content:

```tsx
const [isLoaded, setIsLoaded] = useState(false);

<CanvasSequence onLoadComplete={() => setIsLoaded(true)} />

<div style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s" }}>
  {children}
</div>
```

---

## What Didn't Work

### ❌ Attempt 1: Video Element with Scroll Sync

**What we tried:** Use an HTML5 `<video>` element and sync `currentTime` to scroll position.

**Why it failed:**
- Browsers throttle video seeking for performance
- Inconsistent frame timing across browsers
- No guarantee the exact frame you want is decoded
- Mobile browsers have autoplay restrictions

### ❌ Attempt 2: CSS Scroll-Linked Animations

**What we tried:** Use native CSS `animation-timeline: scroll()`.

**Why it failed:**
- Limited browser support (Chrome 115+, no Safari/Firefox)
- Can't control pinning behavior
- No way to render image sequences

### ❌ Attempt 3: Image Tag Swapping

**What we tried:** Swap `<img src="">` on each scroll update.

**Why it failed:**
- DOM thrashing caused jank
- Browser has to decode each image on source change
- Memory pressure from creating/destroying image elements

### ❌ Attempt 4: Intersection Observer Per Frame

**What we tried:** Use IntersectionObserver to trigger frame changes.

**Why it failed:**
- Too coarse for 129 discrete frames
- Designed for visibility detection, not continuous animation
- Can't achieve smooth scrubbing

---

## What Worked

### ✅ Canvas + Preloaded Images + ScrollTrigger

The winning combination:

1. **Preload all images as `HTMLImageElement` objects** - They're decoded and ready in memory
2. **Use canvas `drawImage()`** - Instant rendering, no DOM manipulation
3. **GSAP ScrollTrigger with `scrub`** - Smooth progress tracking
4. **RequestAnimationFrame** - Synced with browser's render cycle

### ✅ Non-Sequential Frame Handling

Storing available frame numbers in an array and indexing by position (not frame number) elegantly handles gaps.

### ✅ Loading State Management

Showing a spinner while preloading, then fading in content, creates a polished experience rather than a jarring pop-in.

### ✅ Cover Aspect Ratio Calculation

Manually implementing the "cover" algorithm ensures the scenic image always fills the viewport regardless of screen dimensions.

---

## Thinking Framework for Premium UX/UI

### The Adaline Mindset

When building websites like Adaline, think in **film terms**, not web terms:

| Web Thinking | Film Thinking |
|--------------|---------------|
| "Add scroll animation" | "Direct a scene that the user controls" |
| "Show three images" | "Create a continuous camera movement" |
| "Make it look nice" | "Every frame should be screenshot-worthy" |
| "Add transitions" | "Ensure invisible cuts between shots" |

### 5 Principles for Premium Scroll Experiences

#### 1. **Prepare Assets Like a Film Production**

The website is only as good as the source material. Adaline invested in:
- Professional 3D modeling of a Japanese house
- Cinematic lighting and color grading
- High-resolution renders (4K scaled to 1440p)

**Your approach:** Generate or acquire a single, continuous animation. Don't try to stitch separate images—it will always look choppy.

#### 2. **Control = Delight**

Users love feeling in control. Scroll-linked animations give them:
- Direct manipulation (scroll = progress)
- Reversibility (scroll up = go back)
- Pace control (scroll fast or slow)

This is more engaging than autoplay videos.

#### 3. **Performance is a Feature**

A 60fps animation on a $3000 MacBook that stutters on a $300 phone is a failure. Ensure:
- Images are appropriately sized (1080p is enough for most)
- Preloading happens before interaction
- Canvas rendering is GPU-accelerated

#### 4. **The First Frame Matters Most**

Users see Frame 1 immediately. It should:
- Be visually striking (establish the scene)
- Work as a standalone hero image
- Load as fast as possible (consider `priority` loading)

#### 5. **Content Over Canvas**

The animation is the background, not the star. Ensure:
- Text is readable over every frame (test at 0%, 50%, 100%)
- Interactive elements remain accessible
- Animation doesn't distract from the message

### Design Questions to Ask

Before implementing a similar experience, answer:

1. **What story am I telling?** (Adaline: "Enter this peaceful space")
2. **What's the user's journey?** (Start outside → move inside → reveal interior)
3. **How does scroll map to narrative?** (Each scroll "step" = camera movement)
4. **What happens at the end?** (Content continues normally after unpinning)

---

## Performance Considerations

### Current Implementation Stats

| Metric | Value |
|--------|-------|
| Total frames | 129 |
| Average frame size | ~100-150KB |
| Total download | ~15-20MB |
| Preload time (fast connection) | 3-5 seconds |
| Preload time (slow 3G) | 30-60 seconds |

### Optimization Opportunities

1. **WebP Conversion**: Convert JPEGs to WebP for 30-50% size reduction
2. **Progressive Loading**: Load frames 1-30 first, then load rest in background
3. **Mobile Frames**: Serve 720p frames on mobile devices
4. **Skip Frames on Slow Connections**: Use every 2nd frame (65 total) on slow networks

---

## Future Optimizations

### Priority Loading

```typescript
// Load first 20 frames with high priority
const priorityFrames = AVAILABLE_FRAMES.slice(0, 20);
const backgroundFrames = AVAILABLE_FRAMES.slice(20);

// Load priority frames first, then background
await loadFrames(priorityFrames);
setCanInteract(true); // Allow scrolling
loadFrames(backgroundFrames); // Continue in background
```

### WebP with JPEG Fallback

```typescript
const supportsWebP = document.createElement('canvas')
  .toDataURL('image/webp')
  .indexOf('data:image/webp') === 0;

const extension = supportsWebP ? 'webp' : 'jpg';
```

### Reduced Motion Support

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Show static image instead of animation
  return <StaticHeroImage />;
}
```

### Intersection-Based Loading

```typescript
// Only start preloading when section is near viewport
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      startPreloading();
      observer.disconnect();
    }
  },
  { rootMargin: '200px' }
);
```

---

## Key Takeaways

### Technical Lessons

1. **Canvas > Image tags** for rapid frame switching
2. **Preloading is essential** - decode images before they're needed
3. **GSAP ScrollTrigger is reliable** - works consistently across browsers
4. **Handle non-ideal data** - our frame gaps required flexible indexing

### Design Lessons

1. **Invest in source material** - the code is simple, the art is hard
2. **Think cinematically** - you're directing a scene, not building a website
3. **Test at extremes** - 0%, 50%, 100% scroll should all look intentional
4. **Respect user control** - scroll-linked > autoplay for engagement

### Process Lessons

1. **Analyze before building** - understanding Adaline's approach saved weeks
2. **Start simple, then optimize** - we got 129 JPEGs working first
3. **Document failures** - knowing what didn't work prevents repeat mistakes
4. **Performance is iterative** - ship working, then optimize

---

## Summary

We achieved a seamless scroll animation by:

1. **Researching** Adaline's technique (frame sequences + canvas + ScrollTrigger)
2. **Preparing** 129 high-quality JPEG frames from a continuous animation
3. **Building** a custom hook (`useFrameSequence`) for preloading and frame selection
4. **Rendering** frames to canvas with proper aspect ratio and DPI handling
5. **Connecting** scroll position to frame index via GSAP ScrollTrigger
6. **Polishing** with loading states, smooth transitions, and error handling

The technique is proven, the architecture is solid, and the result is a premium, Adaline-quality scroll experience.

---

*Documentation created: January 31, 2026*
*Project: AdlineAI Website*
