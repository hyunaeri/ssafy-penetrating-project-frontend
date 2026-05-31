"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCart, getCartSubtotal } from "@/entities/cart";
import { CART_UPDATED_EVENT } from "@/features/cart/lib/cart-events";

export type StoreCartSummary = {
  subtotal: number;
  itemCount: number;
  minOrderPrice: number;
};

export function useStoreCartSummary(storeId: number) {
  const [summary, setSummary] = useState<StoreCartSummary | null>(null);

  const refresh = useCallback(async () => {
    try {
      const cart = await fetchCart();
      if (cart.storeId === storeId && cart.items.length > 0) {
        setSummary({
          subtotal: getCartSubtotal(cart.items),
          itemCount: cart.items.reduce((sum, line) => sum + line.quantity, 0),
          minOrderPrice: cart.minOrderPrice ?? 0,
        });
      } else {
        setSummary(null);
      }
    } catch {
      setSummary(null);
    }
  }, [storeId]);

  useEffect(() => {
    void refresh();

    const onUpdate = () => void refresh();
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    window.addEventListener("focus", onUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
      window.removeEventListener("focus", onUpdate);
    };
  }, [refresh]);

  return { summary, visible: summary != null, refresh };
}
