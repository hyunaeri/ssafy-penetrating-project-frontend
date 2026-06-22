"use client";

import {
  OwnerErrorState,
  OwnerPageHeader,
  OwnerScreenShell,
} from "@/features/owner-shared";
import { useOwnerStore } from "@/features/owner-store/hooks/use-owner-store";
import { OwnerMenuPanel } from "@/features/owner-store/ui/menu/OwnerMenuPanel";
import { OwnerStoreInfoPanel } from "@/features/owner-store/ui/store/OwnerStoreInfoPanel";
import { OwnerStoreRegisterForm } from "@/features/owner-store/ui/store/OwnerStoreRegisterForm";

export function OwnerStoreScreen() {
  const { store, hasStore, loading, error, reload, refreshStore } =
    useOwnerStore();

  return (
    <OwnerScreenShell>
      <OwnerPageHeader title="매장 관리" />

      <div className="screen-body gap-3 px-3 pb-8 pt-3">
        {loading && (
          <div className="screen-state">
            <p className="text-[14px] text-muted">
              매장 정보를 불러오는 중입니다
            </p>
          </div>
        )}

        {!loading && !hasStore && (
          <OwnerStoreRegisterForm onRegistered={refreshStore} />
        )}

        {!loading && hasStore && error && (
          <div className="soft-card px-4 py-8">
            <OwnerErrorState message={error} onRetry={() => void reload()} />
          </div>
        )}

        {!loading && hasStore && store && !error && (
          <>
            <p className="px-1 text-[14px] text-muted">
              매장 정보와 메뉴를 한곳에서 관리할 수 있어요.
            </p>
            <OwnerStoreInfoPanel store={store} onUpdated={() => void reload()} />
            <OwnerMenuPanel storeId={store.id} />
          </>
        )}
      </div>
    </OwnerScreenShell>
  );
}
