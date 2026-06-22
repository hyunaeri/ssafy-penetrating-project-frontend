"use client";

import { useEffect, useState } from "react";

export const ORDER_TRACKING_SHEET_HEIGHT_RATIO = 0.5;
export const ORDER_TRACKING_SHEET_PEEK_PX = 132;

export function useOrderTrackingSheetMaxDrag(): number {
  const [maxDragY, setMaxDragY] = useState(400);

  useEffect(() => {
    const update = () => {
      const sheetHeight = window.innerHeight * ORDER_TRACKING_SHEET_HEIGHT_RATIO;
      setMaxDragY(Math.max(sheetHeight - ORDER_TRACKING_SHEET_PEEK_PX, 160));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return maxDragY;
}
