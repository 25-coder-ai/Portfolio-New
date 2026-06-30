"use client";
import { useInView } from "react-intersection-observer";

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useScrollAnimation({
  threshold = 0.15,
  triggerOnce = true,
  rootMargin = "0px 0px -50px 0px",
}: UseScrollAnimationOptions = {}) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  return { ref, inView };
}
