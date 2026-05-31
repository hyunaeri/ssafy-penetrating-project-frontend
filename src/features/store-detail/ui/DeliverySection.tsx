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
    <section className="border-b border-line bg-[#f5f5f5] px-4 py-4">
      <div className="mb-3 flex rounded-xl bg-line/60 p-1">
        <button
          type="button"
          onClick={() => setOrderType("delivery")}
          className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold transition-colors ${
            orderType === "delivery"
              ? "bg-white text-ink shadow-sm"
              : "text-muted"
          }`}
        >
          배달
        </button>
        <button
          type="button"
          onClick={() => setOrderType("pickup")}
          className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold transition-colors ${
            orderType === "pickup"
              ? "bg-white text-ink shadow-sm"
              : "text-muted"
          }`}
        >
          픽업
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="text-[14px] font-semibold text-ink">최소주문</span>
          <span className="text-[14px] font-bold text-ink">
            {formatWon(minOrderPrice)}
          </span>
        </div>

        {orderType === "delivery" ? (
          <ul className="divide-y divide-line pt-1">
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

      <p className="mt-3 rounded-lg bg-[#eef6ff] px-3 py-2.5 text-[12px] leading-relaxed text-[#2b6cb0]">
        최소주문금액 {formatWon(minOrderPrice)} 이상 주문 시 배달이 가능합니다.
      </p>
    </section>
  );
}
