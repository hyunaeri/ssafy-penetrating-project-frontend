"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCart } from "@/entities/cart";
import { CART_UPDATED_EVENT } from "@/features/cart/lib/cart-events";

function getCartItemCount(items: { quantity: number }[]) {
  return items.reduce((sum, line) => sum + line.quantity, 0);
}

export function useCartBadge() {
  const [itemCount, setItemCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const cart = await fetchCart();
      setItemCount(getCartItemCount(cart.items));
    } catch {
      setItemCount(0);
    }
  }, []);

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

  return { itemCount, hasItems: itemCount > 0, refresh };
}
