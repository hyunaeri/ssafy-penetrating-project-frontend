"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import type { OrderResponse } from "@/entities/order";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import {
  getOrderMenuSummary,
  getOrderTrackingPath,
  isOrderCompleted,
  isOrderTrackable,
} from "@/features/orders/lib/order-status-flow";
import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from "@/features/orders/lib/format-order-status";
import { ORDERS_QUERY_KEY } from "@/features/orders/lib/orders-query-key";
import { ReviewWriteModal } from "@/features/review";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";
import { resolveRepresentativeImage } from "@/shared/lib/resolve-representative-image";

type OrderHistoryCardProps = {
  order: OrderResponse;
};

function OrderStatusBadge({ order }: { order: OrderResponse }) {
  const label = getOrderStatusLabel(order.status);
  const badgeClass = getOrderStatusBadgeClass(order.status);

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${badgeClass}`}
    >
      {label}
    </span>
  );
}

function getStoreName(order: OrderResponse) {
  const name = order.storeName?.trim();
  if (name) return name;
  return `매장 #${order.storeId}`;
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"] as const;
  return `${date.getMonth() + 1}. ${date.getDate()} (${weekdays[date.getDay()]})`;
}

function StoreThumbnail({
  imageUrl,
}: {
  imageUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const src = resolveRepresentativeImage(imageUrl, failed);

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-line/80">
      <LazyImage
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="56px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function PaymentAmount({
  order,
  hasDiscount,
}: {
  order: OrderResponse;
  hasDiscount: boolean;
}) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <span className="text-[14px] text-muted">결제금액</span>
      <div className="flex items-center gap-1.5">
        {hasDiscount && (
          <span className="text-[13px] text-muted line-through">
            {formatWon(order.totalPrice + order.deliveryFee)}
          </span>
        )}
        <span className="flex items-center gap-1 text-[17px] font-bold text-accent-purple-text">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-brand-dark"
            aria-hidden
          >
            <path d="M12 2 4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4Z" />
          </svg>
          {formatWon(order.finalPrice)}
        </span>
      </div>
    </div>
  );
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const queryClient = useQueryClient();
  const storeName = getStoreName(order);
  const menuSummary = getOrderMenuSummary(order);
  const hasDiscount = order.totalPrice > order.finalPrice;
  const trackable = isOrderTrackable(order.status);
  const completed = isOrderCompleted(order.status);
  const trackingPath = getOrderTrackingPath(order.id);
  const hasReviewed = order.reviewed === true;
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleReviewSubmitted = () => {
    void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
  };

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="flex items-start gap-3 p-4 pb-3">
        <StoreThumbnail imageUrl={order.storeImageUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-[16px] font-bold text-ink">
                {storeName}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <p className="text-[13px] text-muted">
                  {formatOrderDate(order.orderedAt)}
                </p>
                <OrderStatusBadge order={order} />
              </div>
            </div>
            {!trackable && (
              <Link
                href={`/stores/${order.storeId}`}
                className="shrink-0 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-brand/30 hover:text-ink"
              >
                주문상세
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line/70 px-4 py-3">
        <p className="line-clamp-2 text-[14px] leading-relaxed text-ink">
          {menuSummary}
        </p>
        <PaymentAmount order={order} hasDiscount={hasDiscount} />
      </div>

      {trackable && (
        <div className="border-t border-line/70 p-3">
          <Link href={trackingPath} className="delivery-tracking-cta">
            <span className="relative z-[1] flex items-center gap-2">
              <span className="delivery-live-dot" aria-hidden />
              배달 현황
            </span>
          </Link>
        </div>
      )}

      {completed && (
        <>
          <div className="border-t border-line/70 p-3">
            <button
              type="button"
              disabled={hasReviewed}
              onClick={() => setReviewOpen(true)}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-line bg-white text-[14px] font-semibold text-ink transition-colors hover:bg-surface active:bg-surface disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted"
            >
              {hasReviewed ? "리뷰 작성 완료" : "리뷰 쓰기"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-line/70 p-3 pt-0">
            <Link
              href={`/stores/${order.storeId}`}
              className="flex h-11 items-center justify-center rounded-xl border border-line bg-white text-[14px] font-semibold text-ink transition-colors hover:bg-surface active:bg-surface"
            >
              같은 메뉴 담기
            </Link>
            <Link
              href={`/stores/${order.storeId}`}
              className="brand-cta h-11 text-[14px]"
            >
              바로 주문
            </Link>
          </div>
        </>
      )}

      {reviewOpen && (
        <ReviewWriteModal
          orderId={order.id}
          storeName={storeName}
          menuName={menuSummary}
          onClose={() => setReviewOpen(false)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </article>
  );
}
