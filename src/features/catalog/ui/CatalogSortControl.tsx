"use client";

import type { CatalogSortKey } from "../lib/catalog-filters";
import { CATALOG_SORT_OPTIONS } from "../lib/catalog-filters";

type CatalogSortControlProps = {
  sortKey: CatalogSortKey;
  onSortKeyChange: (value: CatalogSortKey) => void;
};

export function CatalogSortControl({
  sortKey,
  onSortKeyChange,
}: CatalogSortControlProps) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      {CATALOG_SORT_OPTIONS.map((option, index) => {
        const active = sortKey === option.key;
        return (
          <span key={option.key} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-line/80" aria-hidden>
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => onSortKeyChange(option.key)}
              className={
                active
                  ? "font-semibold text-ink"
                  : "text-muted transition-colors hover:text-ink"
              }
            >
              {option.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
