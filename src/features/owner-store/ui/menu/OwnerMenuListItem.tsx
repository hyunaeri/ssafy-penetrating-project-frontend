"use client";

import type { MenuResponse } from "@/entities/store/model/types";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { OwnerMenuThumbnail } from "@/features/owner-store/ui/menu/OwnerMenuThumbnail";

type OwnerMenuListItemProps = {
  menu: MenuResponse;
  saving: boolean;
  onEdit: (menu: MenuResponse) => void;
  onDelete: (menu: MenuResponse) => void;
};

export function OwnerMenuListItem({
  menu,
  saving,
  onEdit,
  onDelete,
}: OwnerMenuListItemProps) {
  return (
    <li className="flex items-center gap-3 py-3">
      <OwnerMenuThumbnail menu={menu} />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[15px] font-bold text-ink">{menu.name}</p>
        <p className="mt-0.5 text-[13px] text-muted">
          {formatWon(menu.price)}
          {!menu.active && " · 판매 중지"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => onEdit(menu)}
          disabled={saving}
          className="inline-flex h-8 min-w-[3.25rem] items-center justify-center rounded-full border border-line px-3 text-[12px] font-semibold leading-none text-ink transition-colors hover:border-brand/30 hover:text-brand-dark disabled:opacity-40"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(menu)}
          disabled={saving}
          className="inline-flex h-8 min-w-[3.25rem] items-center justify-center rounded-full border border-red-200 px-3 text-[12px] font-semibold leading-none text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-40"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
