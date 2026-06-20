"use client";

import { OwnerErrorState, OwnerSearchBar } from "@/features/owner-shared";
import { useOwnerMenuPanel } from "@/features/owner-store/hooks/use-owner-menu-panel";
import { OwnerMenuDeleteConfirmModal } from "@/features/owner-store/ui/menu/OwnerMenuDeleteConfirmModal";
import { OwnerMenuFormModal } from "@/features/owner-store/ui/menu/OwnerMenuFormModal";
import { OwnerMenuList } from "@/features/owner-store/ui/menu/OwnerMenuList";
import { OwnerMenuPanelHeader } from "@/features/owner-store/ui/menu/OwnerMenuPanelHeader";

type OwnerMenuPanelProps = {
  storeId: number;
};

export function OwnerMenuPanel({ storeId }: OwnerMenuPanelProps) {
  const panel = useOwnerMenuPanel(storeId);

  return (
    <>
      <section className="soft-card px-4 py-5">
        <OwnerMenuPanelHeader
          totalCount={panel.menus.length}
          filteredCount={panel.filteredMenus.length}
          isSearching={panel.isSearching}
          loading={panel.loading}
          hasError={Boolean(panel.error)}
          onAdd={() => panel.setModalState({ mode: "create" })}
        />

        {panel.loading && (
          <p className="mt-4 text-[14px] text-muted">메뉴를 불러오는 중입니다</p>
        )}

        {!panel.loading && panel.error && (
          <OwnerErrorState
            message={panel.error}
            onRetry={() => void panel.reload()}
            className="mt-4 py-4"
          />
        )}

        {!panel.loading && !panel.error && panel.menus.length > 0 && (
          <div className="mt-4">
            <OwnerSearchBar
              value={panel.searchQuery}
              onChange={panel.setSearchQuery}
              placeholder="메뉴명, 설명으로 검색"
              ariaLabel="메뉴 검색"
              onClear={() => panel.setSearchQuery("")}
            />
          </div>
        )}

        {!panel.loading && !panel.error && (
          <OwnerMenuList
            menus={panel.menus}
            filteredMenus={panel.filteredMenus}
            searchQuery={panel.searchQuery}
            saving={panel.saving}
            onAdd={() => panel.setModalState({ mode: "create" })}
            onEdit={(menu) => panel.setModalState({ mode: "edit", menu })}
            onDelete={panel.setDeleteTarget}
          />
        )}
      </section>

      <OwnerMenuFormModal
        open={panel.modalState?.mode === "create"}
        mode="create"
        saving={panel.saving}
        onClose={() => panel.setModalState(null)}
        onSubmit={panel.handleCreate}
      />

      <OwnerMenuFormModal
        open={panel.modalState?.mode === "edit"}
        mode="edit"
        menu={panel.modalState?.mode === "edit" ? panel.modalState.menu : null}
        saving={panel.saving}
        onClose={() => panel.setModalState(null)}
        onSubmit={panel.handleUpdate}
      />

      <OwnerMenuDeleteConfirmModal
        open={panel.deleteTarget != null}
        menuName={panel.deleteTarget?.name ?? ""}
        loading={panel.deleting}
        onCancel={() => {
          if (!panel.deleting) panel.setDeleteTarget(null);
        }}
        onConfirm={() => void panel.handleConfirmDelete()}
      />
    </>
  );
}
