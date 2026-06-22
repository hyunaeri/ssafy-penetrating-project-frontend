"use client";

import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  getOrderTrackingSheetSnapY,
  resolveNearestOrderTrackingSheetSnap,
  type OrderTrackingSheetSnap,
  useOrderTrackingSheetOffsets,
} from "@/features/order-tracking/hooks/use-order-tracking-sheet-drag";

const SHEET_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 36,
  mass: 0.9,
};

type OrderTrackingDraggableSheetProps = {
  children: ReactNode;
};

function getHandleAriaLabel(snap: OrderTrackingSheetSnap): string {
  if (snap === "expanded") return "주문 정보 접기";
  if (snap === "collapsed") return "주문 정보 펼치기";
  return "주문 정보 더 펼치기";
}

export function OrderTrackingDraggableSheet({
  children,
}: OrderTrackingDraggableSheetProps) {
  const reduceMotion = useReducedMotion();
  const offsets = useOrderTrackingSheetOffsets();
  const dragControls = useDragControls();
  const y = useMotionValue(offsets.defaultY);
  const [snap, setSnap] = useState<OrderTrackingSheetSnap>("default");
  const snapRef = useRef(snap);
  const didDragRef = useRef(false);

  snapRef.current = snap;

  const snapTo = (nextSnap: OrderTrackingSheetSnap) => {
    const targetY = getOrderTrackingSheetSnapY(nextSnap, offsets);
    setSnap(nextSnap);

    if (reduceMotion) {
      y.set(targetY);
      return;
    }

    void animate(y, targetY, SHEET_SPRING);
  };

  useLayoutEffect(() => {
    y.set(getOrderTrackingSheetSnapY(snapRef.current, offsets));
  }, [offsets, y]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    didDragRef.current = Math.abs(info.offset.y) > 6;
    const nextSnap = resolveNearestOrderTrackingSheetSnap(
      y.get(),
      info.velocity.y,
      offsets
    );
    snapTo(nextSnap);
  };

  const toggleSnap = () => {
    if (snap === "expanded") {
      snapTo("default");
      return;
    }
    if (snap === "default") {
      snapTo("collapsed");
      return;
    }
    snapTo("default");
  };

  const handleHandleClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    toggleSnap();
  };

  return (
    <motion.div
      className="pointer-events-auto flex touch-none flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-12px_40px_rgba(43,45,66,0.14)]"
      style={{ y, height: offsets.sheetHeightPx }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={{
        top: offsets.expandedY,
        bottom: offsets.collapsedY,
      }}
      dragElastic={0.04}
      onDragEnd={handleDragEnd}
    >
      <button
        type="button"
        aria-label={getHandleAriaLabel(snap)}
        onClick={handleHandleClick}
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
