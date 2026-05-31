"use client";

import { useState } from "react";
import { formatWon } from "@/features/category-stores/lib/format-store-display";

type DeliverySectionProps = {
  minOrderPrice: number;
  deliveryFee: number;
};

type OrderType = "delivery" | "pickup";

export function DeliverySection({
  minOrderPrice,
  deliveryFee,
}: DeliverySectionProps) {
  const [orderType, setOrderType] = useState<OrderType>("delivery");

  return (
    <section className="border-b border-line/80 bg-surface px-4 py-4">
      <div className="mb-3 flex rounded-2xl bg-white p-1 shadow-card">
        <button
          type="button"
          onClick={() => setOrderType("delivery")}
          className={`flex-1 rounded-[0.9rem] py-2.5 text-[14px] font-semibold transition-all ${
            orderType === "delivery"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          배달
        </button>
        <button
          type="button"
          onClick={() => setOrderType("pickup")}
          className={`flex-1 rounded-[0.9rem] py-2.5 text-[14px] font-semibold transition-all ${
            orderType === "pickup"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          픽업
        </button>
      </div>

      <div className="soft-card p-4">
        <div className="flex items-center justify-between border-b border-line/80 pb-3">
          <span className="text-[14px] font-semibold text-ink">최소주문</span>
          <span className="text-[14px] font-bold text-brand-dark">
            {formatWon(minOrderPrice)}
          </span>
        </div>

        {orderType === "delivery" ? (
          <ul className="divide-y divide-line/80 pt-1">
            <li className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-[15px] font-semibold text-ink">가게배달</p>
                <p className="mt-0.5 text-[12px] text-muted">매장 직접 배달</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-ink">
                  {deliveryFee === 0 ? "무료" : formatWon(deliveryFee)}
                </p>
                <p className="mt-0.5 text-[12px] text-muted">배달팁</p>
              </div>
            </li>
          </ul>
        ) : (
          <p className="py-4 text-center text-[14px] text-muted">
            매장에서 직접 픽업할 수 있습니다.
          </p>
        )}
      </div>

      <p className="mt-3 rounded-2xl bg-accent-blue px-3.5 py-2.5 text-[12px] leading-relaxed text-accent-blue-text">
        최소주문금액 {formatWon(minOrderPrice)} 이상 주문 시 배달이 가능합니다.
      </p>
    </section>
  );
}
