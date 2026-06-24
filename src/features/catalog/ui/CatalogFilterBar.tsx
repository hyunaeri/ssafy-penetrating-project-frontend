"use client";

import type {
  CatalogCollectionFilter,
  CatalogGradeFilter,
} from "../lib/catalog-filters";
import {
  CATALOG_COLLECTION_FILTERS,
  CATALOG_GRADE_FILTERS,
} from "../lib/catalog-filters";

type CatalogFilterBarProps = {
  gradeFilter: CatalogGradeFilter;
  collectionFilter: CatalogCollectionFilter;
  onGradeFilterChange: (value: CatalogGradeFilter) => void;
  onCollectionFilterChange: (value: CatalogCollectionFilter) => void;
};

const pillClass = (active: boolean) =>
  `shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
    active
      ? "border-brand bg-brand-soft text-brand-dark"
      : "border-line bg-white text-muted hover:border-brand/30 hover:text-ink"
  }`;

export function CatalogFilterBar({
  gradeFilter,
  collectionFilter,
  onGradeFilterChange,
  onCollectionFilterChange,
}: CatalogFilterBarProps) {
  return (
    <div className="border-b border-line/80 bg-white">
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 py-3">
        {CATALOG_COLLECTION_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onCollectionFilterChange(option.key)}
            className={pillClass(collectionFilter === option.key)}
          >
            {option.label}
          </button>
        ))}

        <span
          className="mx-0.5 h-5 w-px shrink-0 bg-line/80"
          aria-hidden
        />

        {CATALOG_GRADE_FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onGradeFilterChange(option.key)}
            className={pillClass(gradeFilter === option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
