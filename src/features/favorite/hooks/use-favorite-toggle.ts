"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavoriteStore, removeFavoriteStore } from "@/entities/favorite";
import { getAccessToken } from "@/entities/session";
import { notifyError } from "@/shared/ui";
import {
  FAVORITES_QUERY_KEY,
  isStoreFavorited,
  useFavorites,
} from "@/features/favorite/hooks/use-favorites";
import { useFavoriteDraftStore } from "@/features/favorite/store/favorite-draft-store";

const DEFAULT_DEBOUNCE_MS = 600;

export function useFavoriteToggle(storeId: number) {
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { stores, loading: favoritesLoading } = useFavorites();

  const drafts = useFavoriteDraftStore((s) => s.drafts);
  const dirtyIds = useFavoriteDraftStore((s) => s.dirtyIds);
  const setDraft = useFavoriteDraftStore((s) => s.setDraft);
  const clearDraft = useFavoriteDraftStore((s) => s.clearDraft);
  const markClean = useFavoriteDraftStore((s) => s.markClean);

  const serverFavorited = isStoreFavorited(stores, storeId);

  const mutation = useMutation({
    mutationFn: async (favorited: boolean) => {
      if (favorited) {
        return addFavoriteStore(storeId);
      }
      return removeFavoriteStore(storeId);
    },
    onSuccess: async () => {
      markClean(storeId);
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
    onError: (err) => {
      clearDraft(storeId);
      markClean(storeId);
      notifyError(
        err instanceof Error ? err.message : "찜 상태를 변경하지 못했습니다."
      );
    },
  });

  const getFavorited = useCallback(() => {
    const draft = drafts[storeId];
    if (typeof draft === "boolean") return draft;
    return serverFavorited;
  }, [drafts, serverFavorited, storeId]);

  const commitNow = useCallback(() => {
    const state = useFavoriteDraftStore.getState();
    if (!state.dirtyIds[storeId]) return;

    const favorited = state.drafts[storeId];
    if (typeof favorited !== "boolean") {
      markClean(storeId);
      return;
    }

    mutation.mutate(favorited);
  }, [markClean, mutation, storeId]);

  const scheduleCommit = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commitNow(), DEFAULT_DEBOUNCE_MS);
  }, [commitNow]);

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const state = useFavoriteDraftStore.getState();
    if (state.dirtyIds[storeId]) {
      commitNow();
    }
    await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
  }, [commitNow, queryClient, storeId]);

  const toggle = useCallback(() => {
    if (!getAccessToken()) {
      notifyError("로그인이 필요합니다.");
      return;
    }

    const next = !getFavorited();
    setDraft(storeId, next);
    scheduleCommit();
  }, [getFavorited, scheduleCommit, setDraft, storeId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const state = useFavoriteDraftStore.getState();
      if (!state.dirtyIds[storeId]) return;

      const favorited = state.drafts[storeId];
      if (typeof favorited !== "boolean") return;

      void (async () => {
        try {
          if (favorited) {
            await addFavoriteStore(storeId);
          } else {
            await removeFavoriteStore(storeId);
          }
          markClean(storeId);
          await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
        } catch {
          clearDraft(storeId);
          markClean(storeId);
        }
      })();
    };
  }, [clearDraft, markClean, queryClient, storeId]);

  return {
    favorited: getFavorited(),
    toggle,
    flush,
    statusLoading: favoritesLoading,
    isSaving: mutation.isPending,
    isDirty: Boolean(dirtyIds[storeId]),
  };
}
