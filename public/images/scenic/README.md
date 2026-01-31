# Scenic Image Assets

This directory contains the layered scenic images for the landing page visual section.

## Required Assets for V1

- `background.svg` - Placeholder SVG (currently in use)
- `background.jpg` - Primary scenic image with mountains, lake, and distant trees

## Assets for V2 (GSAP ScrollTrigger Animation)

When implementing the scroll-driven animation in V2, add these layered assets:

| Filename | Description | Depth |
|----------|-------------|-------|
| `background.jpg` | Distant mountains and sky | 0 (slowest parallax) |
| `midground.png` | Lake and mid-distance trees | 1 |
| `foreground.png` | Close trees, bushes, grass | 2 (faster parallax) |
| `frame-left.png` | Japanese window frame (left) | 3 (slides in from left) |
| `frame-right.png` | Japanese window frame (right) | 3 (slides in from right) |

## Image Specifications

- **Format**: JPG for backgrounds (smaller file size), PNG for layers with transparency
- **Resolution**: 2560x1080 minimum (21:9 aspect ratio)
- **Color Profile**: sRGB
- **Compression**: Optimized for web (WebP versions recommended)

## Naming Convention

Use descriptive names that indicate the layer's role in the parallax effect:
- `background-*` → Slowest moving layer
- `midground-*` → Medium speed
- `foreground-*` → Fastest moving layer
- `frame-*` → Static frame elements

## Notes

- Images should have consistent color grading (warm, muted tones)
- Edges of PNG layers should be soft for seamless blending
- Consider creating 2x versions for retina displays
