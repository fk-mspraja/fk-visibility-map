import { useState, useEffect, useRef } from 'react';

/**
 * Animated count-up hook for stat counters.
 * Eases from 0 to `target` over `duration` ms using ease-out-cubic.
 */
export function useCountUp(target, duration = 2400, delay = 0) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (now) => {
        if (startTimeRef.current === null) startTimeRef.current = now;
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay]);

  return value;
}
