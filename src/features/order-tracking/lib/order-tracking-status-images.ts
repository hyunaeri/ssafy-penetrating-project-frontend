export const ORDER_TRACKING_STATUS_IMAGES = [
  "/images/order-confirmed-pixel.png",
  "/images/order-cooking-pixel.png",
  "/images/order-delivering-pixel.png",
  "/images/order-completed-pixel.png",
] as const;

export function getOrderTrackingStatusImage(stepIndex: number): string {
  const clamped = Math.max(
    0,
    Math.min(stepIndex, ORDER_TRACKING_STATUS_IMAGES.length - 1)
  );
  return ORDER_TRACKING_STATUS_IMAGES[clamped]!;
}
