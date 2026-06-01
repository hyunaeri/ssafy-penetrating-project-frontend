"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCart } from "@/entities/cart";
import { CART_UPDATED_EVENT } from "@/features/cart/lib/cart-events";

function getCartItemCount(items: { quantity: number }[]) {
  return items.reduce((sum, line) => sum + line.quantity, 0);
}

export function useCartBadge() {
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

  const itemCount = query.data ? getCartItemCount(query.data.items) : 0;

  return {
    itemCount,
    hasItems: itemCount > 0,
    refresh: query.refetch,
  };
}
