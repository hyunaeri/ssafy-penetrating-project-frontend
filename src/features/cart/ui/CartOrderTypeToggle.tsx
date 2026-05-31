"use client";

import { useEffect, useRef, useState } from "react";

export type CartOrderType = "delivery" | "pickup";

const ORDER_TYPE_INFO =
  "직전 주문 시 수령방법이 기본으로 선택돼요. 직전 주문이 없다면 배달 예상시간, 라이더 매칭 여부를 고려해 우선 선택돼요.";

type CartOrderTypeToggleProps = {
  orderType: CartOrderType;
  onChange: (orderType: CartOrderType) => void;
};

export function CartOrderTypeToggle({
  orderType,
  onChange,
}: CartOrderTypeToggleProps) {
  const [showInfo, setShowInfo] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showInfo) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) {
        return;
      }
      setShowInfo(false);
    };

    const timerId = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [showInfo]);

  return (
    <section className="relative mx-3 mt-3 overflow-visible soft-card p-4">
      <div className="relative z-10 mb-3">
        {showInfo && (
          <div
            ref={tooltipRef}
            role="tooltip"
            className="pointer-events-auto absolute bottom-full left-0 right-0 z-50 mb-2 select-none tooltip-fade-in rounded-xl border border-line/80 bg-[#f5f5f5] px-3.5 py-3 text-[12px] leading-[1.65] text-[#6b7280] shadow-[0_4px_20px_rgba(43,45,66,0.12)]"
          >
            {ORDER_TYPE_INFO}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <h2 className="text-[16px] font-bold text-ink">
            수령방법을 선택해주세요
          </h2>
          <button
            ref={buttonRef}
            type="button"
            aria-label="수령방법 안내"
            aria-expanded={showInfo}
            onClick={() => setShowInfo((prev) => !prev)}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted outline-none transition-opacity [-webkit-tap-highlight-color:transparent] hover:text-ink focus:outline-none focus-visible:outline-none active:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex rounded-2xl bg-surface p-1">
        <button
          type="button"
          onClick={() => onChange("delivery")}
          className={`flex-1 rounded-[0.9rem] py-2.5 text-[14px] font-semibold transition-all [-webkit-tap-highlight-color:transparent] ${
            orderType === "delivery"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          배달
        </button>
        <button
          type="button"
          onClick={() => onChange("pickup")}
          className={`flex-1 rounded-[0.9rem] py-2.5 text-[14px] font-semibold transition-all [-webkit-tap-highlight-color:transparent] ${
            orderType === "pickup"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          픽업
        </button>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        {orderType === "delivery"
          ? "라이더를 매칭해 배달해 드려요."
          : "매장에서 직접 픽업할 수 있어요."}
      </p>
    </section>
  );
}
