"use client";

import { useMemo, useState } from "react";
import type { OrderStatus } from "@/entities/order";
import {
  OwnerErrorState,
  OwnerSearchBar,
} from "@/features/owner-shared";
import { matchesOwnerOrderSearch } from "@/features/owner-orders/lib/owner-order-actions";
import { useOwnerOrders } from "@/features/owner-orders/hooks/use-owner-orders";
import { OwnerOrdersEmptyState } from "@/features/owner-orders/ui/OwnerOrdersEmptyState";
import { OwnerOrdersList } from "@/features/owner-orders/ui/OwnerOrdersList";
import { notifyError, notifySuccess } from "@/shared/ui";

type OwnerOrdersContentProps = {
  storeId: number;
};

export function OwnerOrdersContent({ storeId }: OwnerOrdersContentProps) {
  const { orders, loading, error, reload, updateStatus, updating } =
    useOwnerOrders(storeId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesOwnerOrderSearch(order, searchQuery)),
    [orders, searchQuery]
  );

  const trimmed = searchQuery.trim();
  const isSearching = trimmed.length > 0;
  const showList = !loading && !error && filteredOrders.length > 0;
  const isEmpty = !loading && !error && filteredOrders.length === 0;

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await updateStatus({ orderId, status });
      notifySuccess("주문 상태가 변경되었습니다.");
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "주문 상태 변경에 실패했습니다."
      );
    }
  };

  return (
    <>
      <OwnerSearchBar
        variant="section"
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="주문번호, 메뉴명으로 검색"
        ariaLabel="주문 검색"
        onClear={() => setSearchQuery("")}
      />

      {showList && (
        <p className="border-b border-line/80 bg-white px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">
            {filteredOrders.length}
          </span>
          건
        </p>
      )}

      <div className="flex min-h-0 flex-1 flex-col bg-surface">
        {loading && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">
              주문 목록을 불러오는 중입니다
            </p>
          </div>
        )}

        {!loading && error && (
          <OwnerErrorState
            message={error}
            onRetry={() => void reload()}
            className="flex-1 py-16"
          />
        )}

        {isEmpty && <OwnerOrdersEmptyState isSearching={isSearching} />}

        {showList && (
          <OwnerOrdersList
            orders={filteredOrders}
            updating={updating}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </>
  );
}
