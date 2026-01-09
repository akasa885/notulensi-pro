import { useState, useEffect, RefObject } from "react";

/**
 * Hook untuk mendeteksi elemen masuk viewport (untuk animasi scroll)
 * @param ref - Reference ke elemen yang ingin diobservasi
 * @param rootMargin - Margin untuk intersection observer
 * @returns boolean - true jika elemen terlihat di viewport
 */
export const useOnScreen = (
  ref: RefObject<HTMLElement>,
  rootMargin: string = "0px"
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
};
