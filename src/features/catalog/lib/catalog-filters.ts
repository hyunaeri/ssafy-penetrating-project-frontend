import type { CollectionGrade, CollectionItem } from "@/entities/catalog";

export type CatalogGradeFilter = "ALL" | CollectionGrade | "HIDDEN";

export type CatalogSortKey = "RECENT" | "GRADE";

export type CatalogCollectionFilter = "ALL" | "UNCOLLECTED";

export const CATALOG_SORT_OPTIONS: { key: CatalogSortKey; label: string }[] = [
  { key: "RECENT", label: "최근 달성순" },
  { key: "GRADE", label: "등급순" },
];

export const CATALOG_COLLECTION_FILTERS: {
  key: CatalogCollectionFilter;
  label: string;
}[] = [
  { key: "ALL", label: "전체" },
  { key: "UNCOLLECTED", label: "미수집만" },
];

export const CATALOG_GRADE_FILTERS: {
  key: CatalogGradeFilter;
  label: string;
}[] = [
  { key: "ALL", label: "전체" },
  { key: "NORMAL", label: "노말" },
  { key: "EPIC", label: "에픽" },
  { key: "UNIQUE", label: "유니크" },
  { key: "LEGENDARY", label: "레전드리" },
  { key: "HIDDEN", label: "히든" },
];

const GRADE_ORDER: CollectionGrade[] = [
  "LEGENDARY",
  "UNIQUE",
  "EPIC",
  "NORMAL",
];

function compareByGrade(a: CollectionItem, b: CollectionItem) {
  const gradeDiff =
    GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade);
  if (gradeDiff !== 0) return gradeDiff;
  return a.name.localeCompare(b.name, "ko");
}

function compareByRecent(a: CollectionItem, b: CollectionItem) {
  if (!a.achievedAt && !b.achievedAt) {
    return compareByGrade(a, b);
  }
  if (!a.achievedAt) return 1;
  if (!b.achievedAt) return -1;
  return (
    new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
  );
}

export function filterCatalogItems(
  items: CollectionItem[],
  gradeFilter: CatalogGradeFilter,
  collectionFilter: CatalogCollectionFilter = "ALL",
): CollectionItem[] {
  return items.filter((item) => {
    if (collectionFilter === "UNCOLLECTED" && item.collected) {
      return false;
    }
    if (gradeFilter === "HIDDEN" && !item.hidden) {
      return false;
    }
    if (
      gradeFilter !== "ALL" &&
      gradeFilter !== "HIDDEN" &&
      item.grade !== gradeFilter
    ) {
      return false;
    }
    return true;
  });
}

export function sortCatalogItems(
  items: CollectionItem[],
  sortKey: CatalogSortKey,
): CollectionItem[] {
  const sorted = [...items];
  sorted.sort(sortKey === "RECENT" ? compareByRecent : compareByGrade);
  return sorted;
}

export function applyCatalogFilters(
  items: CollectionItem[],
  gradeFilter: CatalogGradeFilter,
  sortKey: CatalogSortKey,
  collectionFilter: CatalogCollectionFilter = "ALL",
): CollectionItem[] {
  return sortCatalogItems(
    filterCatalogItems(items, gradeFilter, collectionFilter),
    sortKey,
  );
}
