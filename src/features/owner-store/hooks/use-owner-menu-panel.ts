"use client";

import { useMemo, useState } from "react";
import type { MenuResponse } from "@/entities/store/model/types";
import { matchesOwnerMenuSearch } from "@/features/owner-store/lib/matches-owner-menu-search";
import type { OwnerMenuModalState } from "@/features/owner-store/model/menu-modal-state";
import type { OwnerMenuFormValues } from "@/features/owner-store/model/owner-menu-form";
import { useOwnerMenus } from "@/features/owner-store/hooks/use-owner-menus";
import { notifyError, notifySuccess } from "@/shared/ui";

export function useOwnerMenuPanel(storeId: number) {
  const {
    menus,
    loading,
    error,
    reload,
    createMenu,
    updateMenu,
    deleteMenu,
    saving,
  } = useOwnerMenus(storeId);

  const [modalState, setModalState] = useState<OwnerMenuModalState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MenuResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredMenus = useMemo(
    () => menus.filter((menu) => matchesOwnerMenuSearch(menu, searchQuery)),
    [menus, searchQuery]
  );

  const isSearching = searchQuery.trim().length > 0;

  const handleCreate = async (values: OwnerMenuFormValues) => {
    try {
      await createMenu(values);
      notifySuccess("메뉴가 등록되었습니다.");
      setModalState(null);
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "메뉴 등록에 실패했습니다."
      );
    }
  };

  const handleUpdate = async (values: OwnerMenuFormValues) => {
    if (modalState?.mode !== "edit") return;

    try {
      await updateMenu({
        menuId: modalState.menu.id,
        ...values,
      });
      notifySuccess("메뉴가 수정되었습니다.");
      setModalState(null);
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "메뉴 수정에 실패했습니다."
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteMenu(deleteTarget.id);
      notifySuccess("메뉴가 삭제되었습니다.");
      setDeleteTarget(null);
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "메뉴 삭제에 실패했습니다."
      );
    } finally {
      setDeleting(false);
    }
  };

  return {
    menus,
    filteredMenus,
    loading,
    error,
    reload,
    saving,
    modalState,
    setModalState,
    searchQuery,
    setSearchQuery,
    isSearching,
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleCreate,
    handleUpdate,
    handleConfirmDelete,
  };
}
