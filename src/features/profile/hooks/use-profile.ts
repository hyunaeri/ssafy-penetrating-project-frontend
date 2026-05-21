"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, type UserResponse } from "@/entities/user";

export function useProfile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setUser(await getCurrentUser());
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error ? err.message : "사용자 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { user, loading, error, reload: load };
}
