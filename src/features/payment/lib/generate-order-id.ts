/** 가맹점 주문번호 (Toss orderId) */
export function generateOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  }
  return window.btoa(String(Math.random())).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
}
