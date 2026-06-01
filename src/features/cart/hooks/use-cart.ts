"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCart, type CartResponse } from "@/entities/cart";

export function useCart() {
  const query = useQuery<CartResponse, Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  return {
    cart: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
