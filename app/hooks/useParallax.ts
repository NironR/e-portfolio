import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Custom hook to calculate parallax offsets based on scroll position.
 */
export function useParallax(
  multiplier: number,
  onChange: (value: number) => void
): void {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    let animationFrame: number | null = null;

    const animate = () => {
      const { innerHeight } = window;
      const offsetValue = Math.max(0, window.scrollY) * multiplier;
      
      // Clamp the value to the screen height to prevent extreme translations
      const clampedOffsetValue = Math.max(
        -innerHeight,
        Math.min(innerHeight, offsetValue)
      );

      onChange(clampedOffsetValue);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Only attach listeners if the user hasn't requested reduced motion
    if (!reduceMotion) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [multiplier, onChange, reduceMotion]);
}