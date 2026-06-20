import type { MenuResponse } from "@/entities/store/model/types";
import { OwnerMenuListItem } from "@/features/owner-store/ui/menu/OwnerMenuListItem";

type OwnerMenuListProps = {
  menus: MenuResponse[];
  filteredMenus: MenuResponse[];
  searchQuery: string;
  saving: boolean;
  onAdd: () => void;
  onEdit: (menu: MenuResponse) => void;
  onDelete: (menu: MenuResponse) => void;
};

export function OwnerMenuList({
  menus,
  filteredMenus,
  searchQuery,
  saving,
  onAdd,
  onEdit,
  onDelete,
}: OwnerMenuListProps) {
  const trimmedSearch = searchQuery.trim();

  return (
    <ul className="mt-4 divide-y divide-line/80">
      {menus.length === 0 ? (
        <li className="py-8 text-center">
          <p className="text-[14px] text-muted">등록된 메뉴가 없어요.</p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-3 text-[14px] font-semibold text-brand-dark underline-offset-2 hover:underline"
          >
            첫 메뉴 추가하기
          </button>
        </li>
      ) : filteredMenus.length === 0 ? (
        <li className="py-8 text-center">
          <p className="text-[14px] font-bold text-ink">검색 결과가 없어요</p>
          <p className="mt-2 text-[13px] text-muted">
            ‘{trimmedSearch}’와 일치하는 메뉴를 찾지 못했어요.
          </p>
        </li>
      ) : (
        filteredMenus.map((menu) => (
          <OwnerMenuListItem
            key={menu.id}
            menu={menu}
            saving={saving}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </ul>
  );
}
