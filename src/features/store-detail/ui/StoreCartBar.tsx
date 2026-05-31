"use client";

import Link from "next/link";
import type { StoreCartSummary } from "@/features/store-detail/hooks/use-store-cart-summary";
import { formatWon } from "@/features/category-stores/lib/format-store-display";

type StoreCartBarProps = {
  summary: StoreCartSummary;
};

export function StoreCartBar({ summary }: StoreCartBarProps) {
  const { subtotal, itemCount, remainingMinOrderPrice } = summary;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-mobile rounded-t-[20px] bg-white px-4 pb-4 pt-3.5 shadow-[0_-8px_32px_rgba(43,45,66,0.12)]">
      {remainingMinOrderPrice > 0 && (
        <p className="mb-2.5 text-center text-[12px] text-muted">
          최소주문금액까지{" "}
          <span className="font-semibold text-brand-dark">
            {formatWon(remainingMinOrderPrice)}
          </span>{" "}
          더 담아주세요
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-bold leading-none text-ink">
            {formatWon(subtotal)}
          </p>
        </div>

        <Link
          href="/cart"
          className="flex h-[52px] min-w-[148px] flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-bold text-ink shadow-[0_4px_16px_rgba(42,193,188,0.35)] transition-all hover:bg-brand-dark active:scale-[0.98]"
        >
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-[12px] font-bold text-white">
            {itemCount}
          </span>
          장바구니 보기
        </Link>
      </div>
    </div>
  );
}
