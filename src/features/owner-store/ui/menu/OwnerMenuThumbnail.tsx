"use client";

import Image from "next/image";
import { useState } from "react";
import type { MenuResponse } from "@/entities/store/model/types";
import { EMPTY_MENU_IMAGE } from "@/features/owner-shared";

type OwnerMenuThumbnailProps = {
  menu: MenuResponse;
};

export function OwnerMenuThumbnail({ menu }: OwnerMenuThumbnailProps) {
  const imageUrl = menu.imageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const src = imageUrl && !imageFailed ? imageUrl : EMPTY_MENU_IMAGE;

  return (
    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-inset ring-brand/10">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="72px"
        unoptimized
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
