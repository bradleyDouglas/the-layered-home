"use client";

import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionRouter
      leave={(next) => {
        const tween = gsap.fromTo(
          "main",
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.5, onComplete: next }
        );
        return () => tween.kill();
      }}
      enter={(next) => {
        const tween = gsap.fromTo(
          "main",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, onComplete: next }
        );
        return () => tween.kill();
      }}
    >
      {children}
    </TransitionRouter>
  );
}
