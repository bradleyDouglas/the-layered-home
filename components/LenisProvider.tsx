// components/providers/LenisProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import type { LenisOptions } from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({
  children,
  options = {},
}: {
  children: React.ReactNode;
  options?: LenisOptions;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const lenisInstance = new Lenis({
      autoRaf: true, // Automatically handles requestAnimationFrame
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      anchors: true,
      syncTouch: false, // Better mobile performance
      ...optionsRef.current,
    });
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []); // Empty dependency array for single initialization

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
