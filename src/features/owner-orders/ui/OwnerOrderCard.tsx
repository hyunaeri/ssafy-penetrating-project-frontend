"use client";

import type { OrderResponse, OrderStatus } from "@/entities/order";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from "@/features/orders/lib/format-order-status";
import {
  getOwnerNextStatuses,
  getOwnerStatusActionLabel,
} from "@/features/owner-orders/lib/owner-order-actions";
import { PrimaryButton } from "@/shared/ui";

type OwnerOrderCardProps = {
  order: OrderResponse;
  updating?: boolean;
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
};

function getMenuSummary(order: OrderResponse) {
  if (order.items.length === 0) return "주문 메뉴 없음";
  const first = order.items[0]!;
  const quantityLabel = first.quantity > 1 ? ` ${first.quantity}개` : "";
  const firstLine = `${first.menuName}${quantityLabel}`;
  if (order.items.length === 1) return firstLine;
  return `${firstLine} 외 ${order.items.length - 1}건`;
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;
  return `${date.getMonth() + 1}. ${date.getDate()} (${weekdays[date.getDay()]}) ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function OwnerOrderCard({
  order,
  updating = false,
  onUpdateStatus,
}: OwnerOrderCardProps) {
  const nextStatuses = getOwnerNextStatuses(order.status);
  const badgeClass = getOrderStatusBadgeClass(order.status);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-muted">
              주문 #{order.id}
            </p>
            <p className="mt-1 line-clamp-2 text-[15px] font-bold text-ink">
              {getMenuSummary(order)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-[13px] text-muted">
                {formatOrderDate(order.orderedAt)}
              </p>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${badgeClass}`}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-muted">결제금액</p>
            <p className="text-[17px] font-bold text-accent-purple-text">
              {formatWon(order.finalPrice)}
            </p>
          </div>
        </div>
      </div>

      {nextStatuses.length > 0 && (
        <div className="grid gap-2 border-t border-line/70 p-3 sm:grid-cols-2">
          {nextStatuses.map((status) => (
            <PrimaryButton
              key={status}
              type="button"
              variant={status === "CANCELED" ? "outline" : "solid"}
              disabled={updating}
              onClick={() => void onUpdateStatus(order.id, status)}
            >
              {getOwnerStatusActionLabel(status)}
            </PrimaryButton>
          ))}
        </div>
      )}
    </article>
  );
}
