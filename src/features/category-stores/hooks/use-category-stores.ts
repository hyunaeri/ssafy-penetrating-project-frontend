"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchStoresByCategory, type StoreResponse } from "@/entities/store";

export function useCategoryStores(categoryId: number) {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setStores(await fetchStoresByCategory(categoryId));
    } catch (err) {
      setStores([]);
      setError(
        err instanceof Error ? err.message : "매장 목록을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stores, loading, error, reload: load };
}
