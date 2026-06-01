"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  CartStoreConflictError,
  type AddCartItemRequest,
  type CartStoreConflictResponse,
} from "@/entities/cart";

type PendingAdd = {
  menuId: number;
  quantity: number;
};

export function useAddToCart() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (request: AddCartItemRequest) => addCartItem(request),
  });
  const [conflict, setConflict] = useState<CartStoreConflictResponse | null>(
    null
  );
  const [pending, setPending] = useState<PendingAdd | null>(null);

  const clearConflict = useCallback(() => {
    setConflict(null);
    setPending(null);
  }, []);

  const add = useCallback(
    async (request: AddCartItemRequest): Promise<boolean> => {
      try {
        await mutation.mutateAsync(request);
        clearConflict();
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
        return true;
      } catch (err) {
        if (err instanceof CartStoreConflictError) {
          setConflict(err.conflict);
          setPending({ menuId: request.menuId, quantity: request.quantity });
          return false;
        }

        throw err;
      }
    },
    [clearConflict, mutation, queryClient]
  );

  const confirmReplace = useCallback(async (): Promise<boolean> => {
    if (!pending) return false;

    return add({
      menuId: pending.menuId,
      quantity: pending.quantity,
      replaceCart: true,
    });
  }, [add, pending]);

  return {
    submitting: mutation.isPending,
    conflict,
    clearConflict,
    add,
    confirmReplace,
  };
}
