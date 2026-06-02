"use client";

import { create } from "zustand";

type FavoriteDraftState = {
  /** storeId -> 찜 여부 (낙관적 UI) */
  drafts: Record<number, boolean | undefined>;
  dirtyIds: Record<number, true | undefined>;
};

type FavoriteDraftActions = {
  setDraft: (storeId: number, favorited: boolean) => void;
  clearDraft: (storeId: number) => void;
  markClean: (storeId: number) => void;
};

export type FavoriteDraftStore = FavoriteDraftState & FavoriteDraftActions;

export const useFavoriteDraftStore = create<FavoriteDraftStore>((set) => ({
  drafts: {},
  dirtyIds: {},

  setDraft: (storeId, favorited) =>
    set((state) => ({
      drafts: { ...state.drafts, [storeId]: favorited },
      dirtyIds: { ...state.dirtyIds, [storeId]: true },
    })),

  clearDraft: (storeId) =>
    set((state) => {
      const next = { ...state.drafts };
      delete next[storeId];
      return { drafts: next };
    }),

  markClean: (storeId) =>
    set((state) => {
      const nextDirty = { ...state.dirtyIds };
      delete nextDirty[storeId];
      const nextDrafts = { ...state.drafts };
      delete nextDrafts[storeId];
      return { drafts: nextDrafts, dirtyIds: nextDirty };
    }),
}));
