"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemQuantity, type CartResponse } from "@/entities/cart";
import { notifyError } from "@/shared/ui";
import { useCartQuantityDraftStore } from "@/features/cart/store/cart-quantity-draft-store";

const DEFAULT_DEBOUNCE_MS = 600;

function clampQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity));
}

export function useCartQuantityController(cart: CartResponse | null) {
  const queryClient = useQueryClient();
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const drafts = useCartQuantityDraftStore((s) => s.drafts);
  const dirtyIds = useCartQuantityDraftStore((s) => s.dirtyIds);
  const setDraft = useCartQuantityDraftStore((s) => s.setDraft);
  const clearDraft = useCartQuantityDraftStore((s) => s.clearDraft);
  const markClean = useCartQuantityDraftStore((s) => s.markClean);

  const mutation = useMutation({
    mutationFn: async (vars: { cartItemId: number; quantity: number }) => {
      return updateCartItemQuantity(vars.cartItemId, { quantity: vars.quantity });
    },
    onSuccess: async (_data, vars) => {
      markClean(vars.cartItemId);
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err, vars) => {
      clearDraft(vars.cartItemId);
      markClean(vars.cartItemId);
      notifyError(err instanceof Error ? err.message : "수량 변경에 실패했어요.");
    },
  });

  const cartItemIds = useMemo(() => {
    const ids = new Set<number>();
    cart?.items.forEach((item) => ids.add(item.id));
    return ids;
  }, [cart]);

  useEffect(() => {
    // 장바구니가 바뀌면(예: 매장 변경/비움) 존재하지 않는 draft/dirty를 정리
    const state = useCartQuantityDraftStore.getState();
    Object.keys(state.drafts).forEach((rawId) => {
      const id = Number(rawId);
      if (!cartItemIds.has(id)) {
        state.clearDraft(id);
        state.markClean(id);
      }
    });
  }, [cartItemIds]);

  const getQuantity = (cartItemId: number, serverQuantity: number) => {
    const draft = drafts[cartItemId];
    return typeof draft === "number" ? clampQuantity(draft) : clampQuantity(serverQuantity);
  };

  const commitNow = (cartItemId: number) => {
    const state = useCartQuantityDraftStore.getState();
    const quantity = state.drafts[cartItemId];
    if (typeof quantity !== "number") {
      state.markClean(cartItemId);
      return;
    }
    mutation.mutate({ cartItemId, quantity: clampQuantity(quantity) });
  };

  const scheduleCommit = (cartItemId: number, debounceMs = DEFAULT_DEBOUNCE_MS) => {
    const prev = timersRef.current.get(cartItemId);
    if (prev) clearTimeout(prev);
    const timer = setTimeout(() => commitNow(cartItemId), debounceMs);
    timersRef.current.set(cartItemId, timer);
  };

  const setQuantity = (cartItemId: number, quantity: number) => {
    setDraft(cartItemId, clampQuantity(quantity));
    scheduleCommit(cartItemId);
  };

  const increment = (cartItemId: number, serverQuantity: number) => {
    setQuantity(cartItemId, getQuantity(cartItemId, serverQuantity) + 1);
  };

  const decrement = (cartItemId: number, serverQuantity: number) => {
    setQuantity(cartItemId, getQuantity(cartItemId, serverQuantity) - 1);
  };

  const flushAll = async () => {
    const state = useCartQuantityDraftStore.getState();
    const ids = Object.keys(state.dirtyIds).map((id) => Number(id));
    ids.forEach((id) => {
      const t = timersRef.current.get(id);
      if (t) clearTimeout(t);
      commitNow(id);
    });
    await queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const isDirty = (cartItemId: number) => Boolean(dirtyIds[cartItemId]);

  return {
    getQuantity,
    setQuantity,
    increment,
    decrement,
    flushAll,
    isDirty,
    isSaving: mutation.isPending,
  };
}

