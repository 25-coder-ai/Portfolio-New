"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { frame, cancelFrame } from "framer-motion";
import "lenis/dist/lenis.css";

// Site-wide "butter" smooth scrolling.
//
// Lenis interpolates the real scroll position (it doesn't fake it with a
// transform), so `position: sticky`, `useScroll`, and getBoundingClientRect all
// keep working. We drive its RAF from framer-motion's frame loop instead of a
// separate requestAnimationFrame — that keeps scroll-linked motion values (like
// the Experience section's scrollYProgress) in lock-step with the smoothed
// scroll, which is what removes the jank there.

// Consumers only read the instance inside event handlers (nav clicks, the
// Experience side-nav), never during render — so we hand out a stable getter
// backed by a ref rather than state. That keeps Lenis mounting from forcing a
// re-render of the whole app.
type GetLenis = () => Lenis | null;
const LenisContext = createContext<GetLenis>(() => null);

/** Returns a getter for the live Lenis instance (null under reduced motion). */
export function useLenis(): GetLenis {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const getLenis = useCallback<GetLenis>(() => lenisRef.current, []);

  useEffect(() => {
    // Never hijack scrolling for people who asked for reduced motion —
    // native scroll stays instant and predictable for them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.09, // lower = smoother/heavier glide
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = instance;

    const update = (data: { timestamp: number }) => instance.raf(data.timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={getLenis}>{children}</LenisContext.Provider>;
}
