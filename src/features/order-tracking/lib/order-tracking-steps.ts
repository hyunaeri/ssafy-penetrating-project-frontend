import type { OrderStatus } from "@/entities/order";

export type OrderTrackingStep = {
  key: "confirmed" | "cooking" | "delivering" | "completed";
  label: string;
  message: string;
};

export const ORDER_TRACKING_STEPS: OrderTrackingStep[] = [
  {
    key: "confirmed",
    label: "주문확인",
    message: "가게에서 주문을 확인하고 있어요.",
  },
  {
    key: "cooking",
    label: "조리중",
    message: "주문하신 메뉴를 준비하고 있어요.",
  },
  {
    key: "delivering",
    label: "배달중",
    message: "라이더가 배달 중이에요.",
  },
  {
    key: "completed",
    label: "배달완료",
    message: "배달이 완료되었어요!",
  },
];

export function mapOrderStatusToStep(status: OrderStatus): number {
  switch (status) {
    case "PAYMENT_PENDING":
    case "PAID":
    case "ACCEPTED":
      return 0;
    case "COOKING":
      return 1;
    case "DELIVERING":
      return 2;
    case "COMPLETED":
      return 3;
    case "CANCELED":
      return -1;
    default:
      return 0;
  }
}

export function getDefaultStepAfterPayment(): number {
  return 0;
}

export function getStepMessage(stepIndex: number): string {
  const clamped = Math.max(0, Math.min(stepIndex, ORDER_TRACKING_STEPS.length - 1));
  return ORDER_TRACKING_STEPS[clamped]?.message ?? ORDER_TRACKING_STEPS[0]!.message;
}

export function estimateRemainingMinutes(
  stepIndex: number,
  orderedAt?: string | null
): number | null {
  if (stepIndex <= 0 || stepIndex >= ORDER_TRACKING_STEPS.length - 1) {
    return null;
  }

  const baseMinutes = [28, 20, 12, 0][stepIndex] ?? 0;
  if (!orderedAt) return baseMinutes;

  const orderedTime = new Date(orderedAt).getTime();
  if (Number.isNaN(orderedTime)) return baseMinutes;

  const elapsedMinutes = Math.floor((Date.now() - orderedTime) / 60000);
  return Math.max(1, baseMinutes - Math.floor(elapsedMinutes / 2));
}

export type OrderTrackingStatusDisplay = {
  headline: string;
  subLabel: string | null;
};

export function getOrderTrackingStatusDisplay(
  stepIndex: number,
  orderedAt?: string | null
): OrderTrackingStatusDisplay {
  if (stepIndex < 0) {
    return { headline: "", subLabel: null };
  }

  if (stepIndex >= ORDER_TRACKING_STEPS.length - 1) {
    return { headline: "배달 완료", subLabel: null };
  }

  if (stepIndex === 0) {
    return { headline: "주문 확인 중", subLabel: null };
  }

  const remainingMinutes = estimateRemainingMinutes(stepIndex, orderedAt);

  if (stepIndex === 1) {
    return {
      headline:
        remainingMinutes != null ? `약 ${remainingMinutes}분 남음` : "조리 중",
      subLabel: formatEstimatedArrival(remainingMinutes),
    };
  }

  return {
    headline:
      remainingMinutes != null ? `${remainingMinutes}분 남음` : "배달 중",
    subLabel: formatEstimatedArrival(remainingMinutes),
  };
}

export function formatEstimatedArrival(minutes: number | null): string | null {
  if (minutes == null) return null;
  if (minutes <= 1) return "곧 도착";

  const arrival = new Date(Date.now() + minutes * 60000);
  const hours = arrival.getHours();
  const mins = arrival.getMinutes();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 || 12;
  return `${period} ${hour12}:${String(mins).padStart(2, "0")}`;
}
