"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchStoreDetail, type StoreDetailResponse } from "@/entities/store";

export function useStoreDetail(storeId: number) {
  const [store, setStore] = useState<StoreDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setStore(await fetchStoreDetail(storeId));
    } catch (err) {
      setStore(null);
      setError(
        err instanceof Error ? err.message : "매장 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { store, loading, error, reload: load };
}
