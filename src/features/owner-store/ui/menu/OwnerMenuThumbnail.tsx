"use client";

import { useState } from "react";
import type { MenuResponse } from "@/entities/store/model/types";
import { resolveRepresentativeImage } from "@/shared/lib/resolve-representative-image";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";

type OwnerMenuThumbnailProps = {
  menu: MenuResponse;
};

export function OwnerMenuThumbnail({ menu }: OwnerMenuThumbnailProps) {
  const imageUrl = menu.imageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const src = resolveRepresentativeImage(imageUrl, imageFailed);

  return (
    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-inset ring-brand/10">
      <LazyImage
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="72px"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
