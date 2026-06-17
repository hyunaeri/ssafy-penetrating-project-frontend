import { create } from "zustand";

const STORAGE_KEY = "notification-stream:active-order-id";

function readStoredOrderId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

type NotificationStreamState = {
  activeOrderId: number | null;
  hydrate: () => void;
  startStream: (orderId: number) => void;
  stopStream: () => void;
};

export const useNotificationStreamStore = create<NotificationStreamState>(
  (set) => ({
    activeOrderId: null,
    hydrate: () => {
      set({ activeOrderId: readStoredOrderId() });
    },
    startStream: (orderId) => {
      sessionStorage.setItem(STORAGE_KEY, String(orderId));
      set({ activeOrderId: orderId });
    },
    stopStream: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      set({ activeOrderId: null });
    },
  })
);

export function startNotificationStream(orderId: number): void {
  useNotificationStreamStore.getState().startStream(orderId);
}

export function stopNotificationStream(): void {
  useNotificationStreamStore.getState().stopStream();
}
