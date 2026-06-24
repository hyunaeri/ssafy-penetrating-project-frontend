"use client";

import type { CollectionItem } from "@/entities/catalog";
import { CollectionCardVisual } from "./CollectionCardVisual";

type CollectionCardProps = {
  item: CollectionItem;
  onClick: () => void;
};

export function CollectionCard({ item, onClick }: CollectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center text-left"
    >
      <CollectionCardVisual
        grade={item.grade}
        collected={item.collected}
        imageUrl={item.imageUrl}
        name={item.name}
      />

      <div className="mt-3 w-full max-w-[168px] text-center">
        <h3 className="line-clamp-1 text-[14px] font-bold text-ink">
          {item.name}
        </h3>
      </div>
    </button>
  );
}
