"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOwnerMenu,
  deleteOwnerMenu,
  fetchOwnerMenus,
  type OwnerMenuPayload,
  updateOwnerMenu,
} from "@/entities/owner-menu";
import type { MenuResponse } from "@/entities/store/model/types";

export function useOwnerMenus(storeId: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery<MenuResponse[], Error>({
    queryKey: ["owner-menus", storeId],
    queryFn: () => fetchOwnerMenus(storeId!),
    enabled: storeId != null,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["owner-menus", storeId] });

  const createMutation = useMutation({
    mutationFn: (payload: OwnerMenuPayload & { image?: File | null }) =>
      createOwnerMenu({ storeId: storeId!, ...payload }),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: (
      payload: OwnerMenuPayload & { menuId: number; image?: File | null }
    ) =>
      updateOwnerMenu({
        storeId: storeId!,
        menuId: payload.menuId,
        name: payload.name,
        tagId: payload.tagId,
        description: payload.description,
        price: payload.price,
        image: payload.image,
      }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (menuId: number) => deleteOwnerMenu(storeId!, menuId),
    onSuccess: invalidate,
  });

  return {
    menus: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
    createMenu: createMutation.mutateAsync,
    updateMenu: updateMutation.mutateAsync,
    deleteMenu: deleteMutation.mutateAsync,
    saving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
