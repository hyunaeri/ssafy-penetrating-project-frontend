"use client";

import { create } from "zustand";

type QuantityDraftState = {
  /** cartItemId -> quantity */
  drafts: Record<number, number | undefined>;
  /** 서버와 불일치할 가능성이 있는 아이템 id 목록 */
  dirtyIds: Record<number, true | undefined>;
};

type QuantityDraftActions = {
  setDraft: (cartItemId: number, quantity: number) => void;
  clearDraft: (cartItemId: number) => void;
  markClean: (cartItemId: number) => void;
  resetAll: () => void;
};

export type CartQuantityDraftStore = QuantityDraftState & QuantityDraftActions;

export const useCartQuantityDraftStore = create<CartQuantityDraftStore>(
  (set) => ({
    drafts: {},
    dirtyIds: {},

    setDraft: (cartItemId, quantity) =>
      set((state) => ({
        drafts: { ...state.drafts, [cartItemId]: quantity },
        dirtyIds: { ...state.dirtyIds, [cartItemId]: true },
      })),

    clearDraft: (cartItemId) =>
      set((state) => {
        const next = { ...state.drafts };
        delete next[cartItemId];
        return { drafts: next };
      }),

    markClean: (cartItemId) =>
      set((state) => {
        const next = { ...state.dirtyIds };
        delete next[cartItemId];
        return { dirtyIds: next };
      }),

    resetAll: () => set({ drafts: {}, dirtyIds: {} }),
  })
);

