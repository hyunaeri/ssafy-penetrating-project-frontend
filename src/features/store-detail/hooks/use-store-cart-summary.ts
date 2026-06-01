"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCart, getCartOrderSummary } from "@/entities/cart";
import { CART_UPDATED_EVENT } from "@/features/cart/lib/cart-events";

export type StoreCartSummary = {
  subtotal: number;
  itemCount: number;
  minOrderPrice: number;
  remainingMinOrderPrice: number;
};

export function useStoreCartSummary(storeId: number) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  useEffect(() => {
    const onUpdate = () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
    };
  }, [queryClient]);

  const cart = query.data;
  const order =
    cart && cart.storeId === storeId && cart.items.length > 0
      ? getCartOrderSummary(cart, "delivery")
      : null;
  const summary =
    cart && order
      ? {
          subtotal: order.subtotal,
          itemCount: cart.items.reduce((sum, line) => sum + line.quantity, 0),
          minOrderPrice: order.minOrderPrice,
          remainingMinOrderPrice: order.remainingMinOrderPrice,
        }
      : null;

  return {
    summary,
    visible: summary != null,
    refresh: query.refetch,
  };
}
