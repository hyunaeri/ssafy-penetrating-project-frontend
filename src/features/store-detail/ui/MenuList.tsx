"use client";

import Image from "next/image";
import { useState } from "react";
import type { MenuResponse } from "@/entities/store";
import { MenuAddModal } from "@/features/add-to-cart";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { MenuNoticeSection } from "@/features/store-detail/ui/MenuNoticeSection";

type MenuListProps = {
  menus: MenuResponse[];
  minOrderPrice: number;
};

function MenuItem({
  menu,
  onSelect,
}: {
  menu: MenuResponse;
  onSelect: (menu: MenuResponse) => void;
}) {
  const imageUrl = menu.imageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const description = menu.description?.trim();

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(menu)}
        className="flex w-full gap-3.5 rounded-none border-b border-line/60 py-4 text-left transition-colors last:border-b-0 hover:bg-brand-soft/40 active:bg-brand-soft/60"
      >
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-inset ring-brand/10">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt=""
            fill
            className="object-cover"
            sizes="100px"
            unoptimized
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[28px] font-semibold text-muted/70">
            {menu.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <h3 className="text-[16px] font-bold leading-snug text-ink">{menu.name}</h3>
        {description && (
          <p className="line-clamp-2 text-[13px] leading-snug text-muted">
            {description}
          </p>
        )}
        <p className="mt-1 text-[15px] font-bold text-brand-dark">{formatWon(menu.price)}</p>
      </div>
      </button>
    </li>
  );
}

export function MenuList({ menus, minOrderPrice }: MenuListProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuResponse | null>(null);
  if (menus.length === 0) {
    return (
      <section className="mt-2 flex flex-1 flex-col bg-white px-4 py-16">
        <p className="text-center text-[14px] text-muted">
          등록된 메뉴가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-2 flex flex-1 flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-4px_20px_rgba(43,45,66,0.04)]">
      <div className="sticky top-0 z-[5] border-b border-line/60 bg-white/95 px-4 py-3.5 backdrop-blur-sm">
        <h2 className="text-[17px] font-bold text-ink">메뉴</h2>
        <p className="mt-0.5 text-[13px] text-muted">{menus.length}개</p>
      </div>

      <ul className="px-3 pb-2">
        {menus.map((menu) => (
          <MenuItem
            key={menu.id}
            menu={menu}
            onSelect={setSelectedMenu}
          />
        ))}
      </ul>

      <MenuNoticeSection />

      {selectedMenu && (
        <MenuAddModal
          menu={selectedMenu}
          minOrderPrice={minOrderPrice}
          onClose={() => setSelectedMenu(null)}
        />
      )}
    </section>
  );
}
