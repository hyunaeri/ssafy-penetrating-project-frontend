"use client";

import {
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useState, type ReactNode } from "react";
import {
  ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO,
  useOrderTrackingSheetOffsets,
} from "@/features/order-tracking/hooks/use-order-tracking-sheet-drag";

type SheetSnap = "expanded" | "default";

type OrderTrackingDraggableSheetProps = {
  children: ReactNode;
};

function resolveSnap(
  currentSnap: SheetSnap,
  offsetY: number,
  velocityY: number,
  defaultY: number
): SheetSnap {
  const threshold = defaultY * 0.25;

  if (currentSnap === "expanded") {
    if (offsetY > threshold || velocityY > 520) {
      return "default";
    }
    return "expanded";
  }

  if (offsetY < -threshold || velocityY < -520) {
    return "expanded";
  }
  return "default";
}

export function OrderTrackingDraggableSheet({
  children,
}: OrderTrackingDraggableSheetProps) {
  const reduceMotion = useReducedMotion();
  const { expandedY, defaultY } = useOrderTrackingSheetOffsets();
  const dragControls = useDragControls();
  const [snap, setSnap] = useState<SheetSnap>("default");

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setSnap((current) =>
      resolveSnap(current, info.offset.y, info.velocity.y, defaultY)
    );
  };

  const toggleSnap = () => {
    setSnap((current) => (current === "expanded" ? "default" : "expanded"));
  };

  return (
    <motion.div
      className="pointer-events-auto flex touch-none flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-12px_40px_rgba(43,45,66,0.14)]"
      style={{ height: `${ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO * 100}vh` }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: expandedY, bottom: defaultY }}
      dragElastic={0.06}
      onDragEnd={handleDragEnd}
      animate={{ y: snap === "expanded" ? expandedY : defaultY }}
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

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
        {children}
      </div>
    </motion.div>
  );
}
