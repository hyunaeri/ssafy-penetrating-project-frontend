import { EMPTY_PIXEL_IMAGE } from "@/features/owner-shared";

export function resolveRepresentativeImage(
  imageUrl?: string | null,
  imageFailed = false
): string {
  const trimmed = imageUrl?.trim();
  if (trimmed && !imageFailed) {
    return trimmed;
  }
  return EMPTY_PIXEL_IMAGE;
}
