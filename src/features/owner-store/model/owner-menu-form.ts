import type { OwnerMenuPayload } from "@/entities/owner-menu";
import type { MenuResponse } from "@/entities/store/model/types";

export type OwnerMenuFormValues = OwnerMenuPayload & {
  image?: File | null;
};

export const DEFAULT_OWNER_MENU_FORM: OwnerMenuPayload = {
  name: "",
  description: "",
  price: 10000,
  tagId: 1,
};

export function menuToOwnerMenuForm(menu: MenuResponse): OwnerMenuPayload {
  return {
    name: menu.name,
    description: menu.description ?? "",
    price: menu.price,
    tagId: menu.tagId ?? 1,
  };
}
