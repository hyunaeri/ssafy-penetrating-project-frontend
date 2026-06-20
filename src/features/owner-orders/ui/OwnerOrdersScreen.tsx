"use client";

import {
  OwnerPageHeader,
  OwnerScreenShell,
} from "@/features/owner-shared";
import { useOwnerStore } from "@/features/owner-store/hooks/use-owner-store";
import { OwnerStoreRegisterForm } from "@/features/owner-store/ui/store/OwnerStoreRegisterForm";
import { OwnerOrdersContent } from "@/features/owner-orders/ui/OwnerOrdersContent";

export function OwnerOrdersScreen() {
  const { storeId, hasStore, loading: storeLoading, refreshStore } =
    useOwnerStore();

  return (
    <OwnerScreenShell>
      <OwnerPageHeader title="주문 관리" />

      {storeLoading && (
        <p className="px-4 py-16 text-center text-[14px] text-muted">
          매장 정보를 확인하는 중입니다
        </p>
      )}

      {!storeLoading && !hasStore && (
        <div className="flex flex-1 flex-col gap-3 px-3 pb-8 pt-3">
          <OwnerStoreRegisterForm onRegistered={refreshStore} />
        </div>
      )}

      {!storeLoading && hasStore && storeId != null && (
        <OwnerOrdersContent storeId={storeId} />
      )}
    </OwnerScreenShell>
  );
}
