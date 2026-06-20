import type { MenuResponse } from "@/entities/store/model/types";

export type OwnerMenuModalState =
  | { mode: "create" }
  | { mode: "edit"; menu: MenuResponse }
  | null;
