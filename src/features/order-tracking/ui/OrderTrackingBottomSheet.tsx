"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { CartOrderType } from "@/entities/cart/lib/parse-cart-response";
import type { OrderStatus } from "@/entities/order";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import {
  getOrderTrackingStatusDisplay,
  getStepMessage,
  mapOrderStatusToStep,
} from "@/features/order-tracking/lib/order-tracking-steps";
import { OrderTrackingProgressBar } from "@/features/order-tracking/ui/OrderTrackingProgressBar";
import { OrderTrackingStatusIcon } from "@/features/order-tracking/ui/OrderTrackingStepIcons";

type OrderTrackingBottomSheetProps = {
  storeName: string;
  menuSummary: string;
  amount: number;
  orderType: CartOrderType;
  address?: string | null;
  status?: OrderStatus;
  orderedAt?: string | null;
};

function DetailRow({
  icon,
  title,
  children,
  expandable = false,
  expanded = false,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="border-b border-line/70 last:border-b-0">
      <button
        type="button"
        onClick={expandable ? onToggle : undefined}
        className={`flex w-full items-start gap-3 px-4 py-4 text-left ${
          expandable ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-brand-dark">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-muted">{title}</p>
          <div className={`mt-1 text-[14px] leading-relaxed text-ink ${expanded ? "" : "line-clamp-2"}`}>
            {children}
          </div>
        </div>
        {expandable && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`mt-1 shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function OrderTrackingBottomSheet({
  storeName,
  menuSummary,
  amount,
  orderType,
  address,
  status = "PAID",
  orderedAt,
}: OrderTrackingBottomSheetProps) {
  const [addressExpanded, setAddressExpanded] = useState(false);
  const activeStep = mapOrderStatusToStep(status);
  const { headline, subLabel } = getOrderTrackingStatusDisplay(activeStep, orderedAt);
  const statusMessage = getStepMessage(activeStep);
  const isCanceled = status === "CANCELED";
  const deliveryLabel = orderType === "pickup" ? "포장" : "배달";

  return (
    <>
      <div className="flex items-start justify-between gap-3 px-5 pt-1">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-semibold text-brand-dark">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3 3 9v12h7v-7h4v7h7V9l-9-6Z" />
            </svg>
            {deliveryLabel}
          </div>

          {isCanceled ? (
            <>
              <h2 className="mt-3 text-[26px] font-bold leading-tight text-ink">
                주문이 취소되었어요
              </h2>
              <p className="mt-2 text-[14px] text-muted">
                자세한 내용은 주문 내역에서 확인해 주세요.
              </p>
            </>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <h2 className="text-[26px] font-bold leading-none text-ink">
                  {headline}
                </h2>
                {subLabel && (
                  <span className="pb-0.5 text-[15px] font-medium text-muted">
                    {subLabel}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {statusMessage}
              </p>
            </>
          )}
        </div>

        {!isCanceled && (
          <OrderTrackingStatusIcon stepIndex={Math.max(0, activeStep)} />
        )}
      </div>

      {!isCanceled && (
        <div className="mt-5 px-3">
          <OrderTrackingProgressBar activeStep={Math.max(0, activeStep)} />
        </div>
      )}

      <div className="mt-5 border-t border-line/70">
        <DetailRow
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3 3 9v12h7v-7h4v7h7V9l-9-6Z" />
            </svg>
          }
          title="배달주소"
          expandable
          expanded={addressExpanded}
          onToggle={() => setAddressExpanded((prev) => !prev)}
        >
          {address?.trim() || "등록된 주소가 없어요."}
        </DetailRow>

        <DetailRow
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="주문 메뉴"
        >
          {menuSummary}
        </DetailRow>
      </div>

      <div className="mx-4 mt-4 flex items-center justify-between rounded-2xl border border-line/80 bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold text-ink">{storeName}</p>
          <p className="mt-0.5 text-[13px] text-muted">{formatWon(amount)}</p>
        </div>
        <Link
          href="/orders"
          className="shrink-0 rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-brand/30"
        >
          상세내역
        </Link>
      </div>
    </>
  );
}
