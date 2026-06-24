import type { CollectionGrade } from "../model/types";
import { getGradeCardImage } from "./grade-images";

function resolveRemoteImageUrl(imageUrl?: string | null): string | null {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/$/, "");
    if (base) return `${base}${trimmed}`;
    return trimmed;
  }

  return trimmed;
}

export function resolveCatalogCardImage(
  grade: CollectionGrade,
  imageUrl?: string | null,
  imageFailed = false,
): string {
  if (!imageFailed) {
    const remote = resolveRemoteImageUrl(imageUrl);
    if (remote) return remote;
  }

  return getGradeCardImage(grade);
}
