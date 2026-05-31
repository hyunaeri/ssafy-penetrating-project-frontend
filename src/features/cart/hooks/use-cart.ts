"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCart, type CartResponse } from "@/entities/cart";

export function useCart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setCart(await fetchCart());
    } catch (err) {
      setCart(null);
      setError(
        err instanceof Error ? err.message : "장바구니를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { cart, loading, error, reload: load };
}
