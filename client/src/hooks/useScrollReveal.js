// Intersection Observer hook for scroll-triggered animations
import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isVisible] — set ref on an element to get a scroll-triggered animation.
 * @param {number} threshold - 0..1, what fraction of element must be visible
 * @param {boolean} once - if true, only triggers once (default true)
 */
export function useScrollReveal(threshold = 0.12, once = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, visible];
}
