"use client";

import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { BackHeader, PrimaryButton } from "@/shared/ui";

function getOrderTitle(order: {
  storeId: number;
  items: { menuName: string; quantity: number }[];
}) {
  if (order.items.length === 0) return `매장 #${order.storeId} 주문`;
  const first = order.items[0]?.menuName?.trim() || "주문";
  const extra = order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : "";
  return `${first}${extra}`;
}

function formatOrderedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PAYMENT_PENDING":
      return "결제 대기";
    case "PAID":
      return "결제 완료";
    case "ACCEPTED":
      return "주문 수락";
    case "COOKING":
      return "조리 중";
    case "DELIVERING":
      return "배달 중";
    case "COMPLETED":
      return "배달 완료";
    case "CANCELED":
      return "주문 취소";
    default:
      return status;
  }
}

export function OrdersHistoryScreen() {
  const { orders, loading, error, reload } = useOrders();

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <BackHeader
        title="주문 이력"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      {!loading && !error && orders.length > 0 && (
        <p className="border-b border-line/80 bg-white px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">{orders.length}</span>건
        </p>
      )}

      <div className="flex flex-1 flex-col">
        {loading && (
          <p className="px-4 py-16 text-center text-[14px] text-muted">
            주문 이력을 불러오는 중입니다
          </p>
        )}

        {!loading && error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
            <p className="text-[14px] text-red-600">{error}</p>
            <PrimaryButton
              type="button"
              variant="outline"
              className="max-w-[200px]"
              onClick={() => void reload()}
            >
              다시 시도
            </PrimaryButton>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <p className="text-[16px] font-bold text-ink">주문 이력이 없어요</p>
            <p className="text-[14px] text-muted">
              첫 주문을 완료하면 여기에서 확인할 수 있어요.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <ul className="divide-y divide-line/80 bg-white px-4">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[16px] font-bold text-ink">
                      {getOrderTitle(order)}
                    </p>
                    <p className="mt-1 text-[12px] text-muted">
                      주문번호 #{order.id} · {formatOrderedAt(order.orderedAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-semibold text-brand-dark">
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-3 text-[13px] text-muted">
                  <p>매장 ID #{order.storeId}</p>
                  <p className="mt-1">결제금액 {formatWon(order.finalPrice)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
