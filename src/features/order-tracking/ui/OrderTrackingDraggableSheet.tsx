"use client";

import {
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useState, type ReactNode } from "react";
import {
  ORDER_TRACKING_SHEET_HEIGHT_RATIO,
  useOrderTrackingSheetMaxDrag,
} from "@/features/order-tracking/hooks/use-order-tracking-sheet-drag";

type SheetSnap = "expanded" | "collapsed";

type OrderTrackingDraggableSheetProps = {
  children: ReactNode;
};

function resolveSnap(
  currentSnap: SheetSnap,
  offsetY: number,
  velocityY: number,
  maxDragY: number
): SheetSnap {
  const collapseThreshold = maxDragY * 0.35;
  const expandThreshold = maxDragY * 0.25;

  if (currentSnap === "expanded") {
    if (offsetY > collapseThreshold || velocityY > 520) {
      return "collapsed";
    }
    return "expanded";
  }

  if (offsetY < -expandThreshold || velocityY < -520) {
    return "expanded";
  }
  return "collapsed";
}

export function OrderTrackingDraggableSheet({
  children,
}: OrderTrackingDraggableSheetProps) {
  const reduceMotion = useReducedMotion();
  const maxDragY = useOrderTrackingSheetMaxDrag();
  const dragControls = useDragControls();
  const [snap, setSnap] = useState<SheetSnap>("expanded");

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setSnap((current) => resolveSnap(current, info.offset.y, info.velocity.y, maxDragY));
  };

  const toggleSnap = () => {
    setSnap((current) => (current === "expanded" ? "collapsed" : "expanded"));
  };

  return (
    <motion.div
      className="pointer-events-auto flex touch-none flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-12px_40px_rgba(43,45,66,0.14)]"
      style={{ height: `${ORDER_TRACKING_SHEET_HEIGHT_RATIO * 100}vh` }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: maxDragY }}
      dragElastic={0.06}
      onDragEnd={handleDragEnd}
      animate={{ y: snap === "expanded" ? 0 : maxDragY }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 340, damping: 36, mass: 0.9 }
      }
    >
      <button
        type="button"
        aria-label={snap === "expanded" ? "주문 정보 접기" : "주문 정보 펼치기"}
        onClick={toggleSnap}
        onPointerDown={(event) => dragControls.start(event)}
        className="flex w-full shrink-0 cursor-grab items-center justify-center pb-2 pt-3 active:cursor-grabbing"
      >
        <span className="h-1 w-10 rounded-full bg-line" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
        {children}
      </div>
    </motion.div>
  );
}
