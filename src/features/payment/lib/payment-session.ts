import type { PendingPaymentContext } from "@/features/payment/model/types";

const STORAGE_KEY = "payment:pending";

export function savePendingPayment(context: PendingPaymentContext) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export function getPendingPayment(): PendingPaymentContext | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPaymentContext;
  } catch {
    return null;
  }
}

export function clearPendingPayment() {
  sessionStorage.removeItem(STORAGE_KEY);
}
