"use client";

import { useEffect, useState } from "react";

/** 시트 최대 높이 — 뷰포트의 95%까지 덮는다. */
export const ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO = 0.95;

/** 기본으로 보여 줄 시트 노출 높이 */
export const ORDER_TRACKING_SHEET_DEFAULT_VISIBLE_RATIO = 0.6;

type OrderTrackingSheetOffsets = {
  expandedY: number;
  defaultY: number;
};

export function useOrderTrackingSheetOffsets(): OrderTrackingSheetOffsets {
  const [offsets, setOffsets] = useState<OrderTrackingSheetOffsets>({
    expandedY: 0,
    defaultY: 280,
  });

  useEffect(() => {
    const update = () => {
      const viewportHeight = window.innerHeight;
      const sheetHeight =
        viewportHeight * ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO;
      const defaultVisible =
        viewportHeight * ORDER_TRACKING_SHEET_DEFAULT_VISIBLE_RATIO;

      setOffsets({
        expandedY: 0,
        defaultY: Math.max(sheetHeight - defaultVisible, 0),
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return offsets;
}
