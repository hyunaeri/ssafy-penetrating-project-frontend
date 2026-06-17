"use client";

import { useMemo, useState } from "react";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { OrderHistoryCard } from "@/features/orders/ui/OrderHistoryCard";
import { BackHeader, PrimaryButton } from "@/shared/ui";
import { BOTTOM_NAV_HEIGHT_PX } from "@/widgets/bottom-nav";

function matchesSearch(
  order: {
    storeName?: string | null;
    storeId: number;
    items: { menuName: string }[];
  },
  query: string
) {
  const lower = query.toLowerCase();
  const storeName = order.storeName?.toLowerCase() ?? `매장 #${order.storeId}`;
  if (storeName.includes(lower)) return true;
  return order.items.some((item) =>
    item.menuName.toLowerCase().includes(lower)
  );
}

export function OrdersHistoryScreen() {
  const { orders, loading, error, reload } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return orders;
    return orders.filter((order) => matchesSearch(order, trimmed));
  }, [orders, searchQuery]);

  const showList = !loading && !error && filteredOrders.length > 0;
  const isEmpty = !loading && !error && filteredOrders.length === 0;

  return (
    <div
      className={`flex flex-col ${isEmpty ? "bg-surface" : "min-h-full bg-surface"}`}
      style={
        isEmpty
          ? { minHeight: `calc(100dvh - ${BOTTOM_NAV_HEIGHT_PX}px)` }
          : undefined
      }
    >
      <BackHeader
        title="주문내역"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      <div className="border-b border-line/80 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-2.5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="shrink-0 text-muted"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="매장명, 메뉴명으로 검색"
            aria-label="주문 내역 검색"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-muted/70 focus:outline-none"
          />
        </div>
      </div>

      {showList && (
        <p className="border-b border-line/80 bg-white px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">
            {filteredOrders.length}
          </span>
          건
        </p>
      )}

      <div
        className={
          isEmpty
            ? "flex min-h-0 flex-1 flex-col bg-surface"
            : "flex flex-1 flex-col px-4 py-4"
        }
      >
        {loading && (
          <p className="px-4 py-16 text-center text-[14px] text-muted">
            주문 내역을 불러오는 중입니다
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

        {isEmpty && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <p className="text-[16px] font-bold text-ink">
              {searchQuery.trim() ? "검색 결과가 없어요" : "주문 내역이 없어요"}
            </p>
            <p className="text-[14px] text-muted">
              {searchQuery.trim()
                ? "매장명이나 메뉴명으로 다시 검색해 보세요."
                : "첫 주문을 완료하면 여기에서 확인할 수 있어요."}
            </p>
          </div>
        )}

        {showList && (
          <ul className="flex flex-col gap-3">
            {filteredOrders.map((order) => (
              <li key={order.id}>
                <OrderHistoryCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
