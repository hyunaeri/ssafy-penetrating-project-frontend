"use client";

import { useState } from "react";
import type { StoreDetailResponse } from "@/entities/store/model/types";
import { OwnerStoreEditForm } from "@/features/owner-store/ui/store/OwnerStoreEditForm";
import { OwnerStoreInfoView } from "@/features/owner-store/ui/store/OwnerStoreInfoView";

type OwnerStoreInfoPanelProps = {
  store: StoreDetailResponse;
  onUpdated: () => void;
};

export function OwnerStoreInfoPanel({
  store,
  onUpdated,
}: OwnerStoreInfoPanelProps) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="soft-card px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-bold text-ink">매장 기본 정보</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-brand-dark transition-colors hover:bg-brand-soft"
          >
            수정
          </button>
        )}
      </div>

      {!editing ? (
        <OwnerStoreInfoView store={store} />
      ) : (
        <OwnerStoreEditForm
          store={store}
          onUpdated={() => {
            setEditing(false);
            onUpdated();
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </section>
  );
}
