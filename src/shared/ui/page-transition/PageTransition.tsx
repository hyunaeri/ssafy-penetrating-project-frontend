"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import {
  consumeNavigationDirection,
  type NavigationDirection,
} from "@/shared/lib/navigation-direction";

export const PAGE_TRANSITION_DURATION = 0.24;

const SLIDE_OFFSET = 18;

type SlideDirection = "forward" | "back" | "none";

function resolveSlideDirection(consumed: NavigationDirection): SlideDirection {
  if (consumed === "back") return "back";
  if (consumed === "replace" || consumed === "none") return "none";
  return "forward";
}

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const prevPathnameRef = useRef(pathname);
  const slideDirectionRef = useRef<SlideDirection>("none");

  if (prevPathnameRef.current !== pathname) {
    slideDirectionRef.current = resolveSlideDirection(
      consumeNavigationDirection()
    );
    prevPathnameRef.current = pathname;
  }

  const slideDirection = slideDirectionRef.current;
  const skipSlide = reduceMotion || slideDirection === "none";
  const transition = reduceMotion
    ? { duration: 0 }
    : {
        type: "tween" as const,
        duration: PAGE_TRANSITION_DURATION,
        ease: [0.25, 0.1, 0.25, 1] as const,
      };

  const enterX =
    slideDirection === "back"
      ? -SLIDE_OFFSET
      : slideDirection === "forward"
        ? SLIDE_OFFSET
        : 0;
  const exitX =
    slideDirection === "back"
      ? SLIDE_OFFSET
      : slideDirection === "forward"
        ? -SLIDE_OFFSET
        : 0;

  return (
    <div className="page-transition-root relative min-h-full overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="min-h-full bg-surface"
          initial={skipSlide ? { opacity: 0 } : { opacity: 0, x: enterX }}
          animate={{ opacity: 1, x: 0 }}
          exit={skipSlide ? { opacity: 0 } : { opacity: 0, x: exitX }}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
