"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Frame sequence configuration
 */
interface FrameSequenceConfig {
  basePath: string;
  prefix: string;
  extension: string;
  frameNumbers: number[];
}

/**
 * Hook return type
 */
interface UseFrameSequenceReturn {
  frames: HTMLImageElement[];
  isLoading: boolean;
  loadProgress: number;
  getFrameByProgress: (progress: number) => HTMLImageElement | null;
  totalFrames: number;
}

/**
 * Available frame numbers in the sequence (non-sequential, extracted from directory listing)
 * These are the actual frames available in public/images/standard-sequence/
 */
const AVAILABLE_FRAMES = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  22, 24, 27, 29, 31, 33, 36, 38, 40, 42, 44, 46, 48, 50, 53, 55, 57, 59,
  62, 64, 66, 68, 71, 73, 75, 77, 79, 81, 83, 85, 88, 90, 92, 94, 97, 99,
  101, 103, 106, 108, 110, 112, 114, 116, 118, 120, 123, 125, 127, 129,
  132, 134, 136, 138, 141, 143, 145, 147, 149, 151, 153, 155, 158, 160,
  162, 164, 167, 169, 171, 173, 176, 178, 180, 182, 184, 186, 188, 190,
  193, 195, 197, 199, 202, 204, 206, 211, 215, 217, 219, 221, 223, 225,
  228, 230, 232, 234, 237, 239, 241, 243, 246, 248, 250, 254, 258, 263,
  267, 272, 276, 280, 281
];

/**
 * Default configuration for the scenic frame sequence
 */
const DEFAULT_CONFIG: FrameSequenceConfig = {
  basePath: "/images/standard-sequence",
  prefix: "graded_4K_100_gm_50_1080_3-",
  extension: "jpg",
  frameNumbers: AVAILABLE_FRAMES,
};

/**
 * Pad a number to 3 digits (e.g., 1 -> "001", 85 -> "085")
 */
function padFrameNumber(num: number): string {
  return num.toString().padStart(3, "0");
}

/**
 * Build the full URL for a frame
 */
function buildFrameUrl(config: FrameSequenceConfig, frameNumber: number): string {
  return `${config.basePath}/${config.prefix}${padFrameNumber(frameNumber)}.${config.extension}`;
}

/**
 * useFrameSequence Hook
 * 
 * Preloads an image sequence and provides a function to get frames by scroll progress.
 * Handles non-sequential frame numbers by mapping progress (0-1) to available frames.
 * 
 * @param config - Optional configuration override
 * @returns Object with frames array, loading state, and getFrameByProgress function
 */
export function useFrameSequence(
  config: Partial<FrameSequenceConfig> = {}
): UseFrameSequenceReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { frameNumbers } = mergedConfig;
  
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use ref to track if we've started loading
  const hasStartedLoading = useRef(false);

  // Preload all frames on mount
  useEffect(() => {
    if (hasStartedLoading.current) return;
    hasStartedLoading.current = true;

    const imageElements: HTMLImageElement[] = [];
    let loaded = 0;

    // Create and start loading all images
    frameNumbers.forEach((frameNum, index) => {
      const img = new Image();
      img.src = buildFrameUrl(mergedConfig, frameNum);
      
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        
        if (loaded === frameNumbers.length) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load frame ${frameNum}`);
        loaded++;
        setLoadedCount(loaded);
        
        if (loaded === frameNumbers.length) {
          setIsLoading(false);
        }
      };

      imageElements[index] = img;
    });

    setFrames(imageElements);
  }, []);

  /**
   * Get the appropriate frame for a given scroll progress (0-1)
   * Maps linear progress to the available frame indices
   */
  const getFrameByProgress = useCallback(
    (progress: number): HTMLImageElement | null => {
      if (frames.length === 0) return null;

      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // Map progress to frame index
      const frameIndex = Math.floor(clampedProgress * (frames.length - 1));
      
      return frames[frameIndex] || null;
    },
    [frames]
  );

  return {
    frames,
    isLoading,
    loadProgress: frameNumbers.length > 0 ? loadedCount / frameNumbers.length : 0,
    getFrameByProgress,
    totalFrames: frameNumbers.length,
  };
}

export default useFrameSequence;
