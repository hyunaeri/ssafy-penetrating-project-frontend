import type { MenuResponse } from "@/entities/store/model/types";

export function matchesOwnerMenuSearch(menu: MenuResponse, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  if (menu.name.toLowerCase().includes(trimmed)) return true;
  if (menu.description?.toLowerCase().includes(trimmed)) return true;

  return false;
}
