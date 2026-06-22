"use client";

import { useEffect, useState } from "react";

/** 시트 최대 높이 — 뷰포트의 95%까지 덮는다. */
export const ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO = 0.95;

/** 기본으로 보여 줄 시트 노출 높이 */
export const ORDER_TRACKING_SHEET_DEFAULT_VISIBLE_RATIO = 0.6;

/** 축소 시 노출 높이 — 상태 제목·안내 문구가 보이도록 */
export const ORDER_TRACKING_SHEET_COLLAPSED_VISIBLE_PX = 188;

export type OrderTrackingSheetSnap = "expanded" | "default" | "collapsed";

export type OrderTrackingSheetOffsets = {
  expandedY: number;
  defaultY: number;
  collapsedY: number;
  sheetHeightPx: number;
};

const SNAP_ORDER: OrderTrackingSheetSnap[] = [
  "expanded",
  "default",
  "collapsed",
];

export function getOrderTrackingSheetSnapY(
  snap: OrderTrackingSheetSnap,
  offsets: OrderTrackingSheetOffsets
): number {
  switch (snap) {
    case "expanded":
      return offsets.expandedY;
    case "default":
      return offsets.defaultY;
    case "collapsed":
      return offsets.collapsedY;
  }
}

export function getOrderTrackingSheetSnapPoints(
  offsets: OrderTrackingSheetOffsets
): { snap: OrderTrackingSheetSnap; y: number }[] {
  return SNAP_ORDER.map((snap) => ({
    snap,
    y: getOrderTrackingSheetSnapY(snap, offsets),
  }));
}

/** 드래그 종료 시점 y 좌표에서 가장 가까운 스냅을 고른다. */
export function resolveNearestOrderTrackingSheetSnap(
  currentY: number,
  velocityY: number,
  offsets: OrderTrackingSheetOffsets
): OrderTrackingSheetSnap {
  const points = getOrderTrackingSheetSnapPoints(offsets);

  if (velocityY < -450) {
    const above = points
      .filter((point) => point.y < currentY - 8)
      .sort((a, b) => b.y - a.y);
    if (above[0]) return above[0].snap;
  }

  if (velocityY > 450) {
    const below = points
      .filter((point) => point.y > currentY + 8)
      .sort((a, b) => a.y - b.y);
    if (below[0]) return below[0].snap;
  }

  return points.reduce((nearest, point) => {
    const nearestDistance = Math.abs(currentY - nearest.y);
    const pointDistance = Math.abs(currentY - point.y);
    return pointDistance < nearestDistance ? point : nearest;
  }).snap;
}

export function useOrderTrackingSheetOffsets(): OrderTrackingSheetOffsets {
  const [offsets, setOffsets] = useState<OrderTrackingSheetOffsets>({
    expandedY: 0,
    defaultY: 280,
    collapsedY: 520,
    sheetHeightPx: 640,
  });

  useEffect(() => {
    const update = () => {
      const viewportHeight = window.innerHeight;
      const sheetHeightPx = Math.round(
        viewportHeight * ORDER_TRACKING_SHEET_MAX_HEIGHT_RATIO
      );
      const defaultVisiblePx = Math.round(
        viewportHeight * ORDER_TRACKING_SHEET_DEFAULT_VISIBLE_RATIO
      );

      const expandedY = 0;
      const defaultY = Math.max(sheetHeightPx - defaultVisiblePx, 0);
      const collapsedY = Math.max(
        sheetHeightPx - ORDER_TRACKING_SHEET_COLLAPSED_VISIBLE_PX,
        defaultY + 72
      );

      setOffsets({
        expandedY,
        defaultY,
        collapsedY,
        sheetHeightPx,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return offsets;
}
