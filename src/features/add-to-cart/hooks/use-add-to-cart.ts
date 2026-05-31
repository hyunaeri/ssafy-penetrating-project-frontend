"use client";

import { useCallback, useState } from "react";
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
  const [submitting, setSubmitting] = useState(false);
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
      setSubmitting(true);

      try {
        await addCartItem(request);
        clearConflict();
        return true;
      } catch (err) {
        if (err instanceof CartStoreConflictError) {
          setConflict(err.conflict);
          setPending({ menuId: request.menuId, quantity: request.quantity });
          return false;
        }

        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [clearConflict]
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
    submitting,
    conflict,
    clearConflict,
    add,
    confirmReplace,
  };
}
