"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CollectionGrade } from "@/entities/catalog";
import { getGradeStyle, resolveCatalogCardImage } from "@/entities/catalog";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";

type CollectionCardVisualProps = {
  grade: CollectionGrade;
  collected: boolean;
  imageUrl: string | null;
  name: string;
  maxWidthClass?: string;
  imageSizes?: string;
  showBadges?: boolean;
};

export function CollectionCardVisual({
  grade,
  collected,
  imageUrl,
  name,
  maxWidthClass = "max-w-[168px]",
  imageSizes = "168px",
  showBadges = true,
}: CollectionCardVisualProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const style = getGradeStyle(grade);
  const imageSrc = resolveCatalogCardImage(grade, imageUrl, imageFailed);
  const canInteract = collected && style.tiltMax > 0;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl, grade]);

  const resetTilt = useCallback(() => {
    const frame = frameRef.current;
    const overlay = overlayRef.current;
    if (!frame) return;

    frame.style.transform = "";
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.backgroundPosition = "50% 50%";
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const frame = frameRef.current;
      const overlay = overlayRef.current;
      if (!frame || !canInteract) return;

      const rect = frame.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -style.tiltMax;
      const rotateY = ((x - centerX) / centerX) * style.tiltMax;

      frame.style.transform = `perspective(${style.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (overlay && style.holoEnabled) {
        overlay.style.opacity = String(style.holoOpacity);
        overlay.style.backgroundPosition = `${x / 3 + y / 5}% ${y / 3}%`;
      }
    },
    [
      canInteract,
      style.holoEnabled,
      style.holoOpacity,
      style.perspective,
      style.tiltMax,
    ],
  );

  const cardFrame = (
    <div
      ref={frameRef}
      className={`collection-card-frame relative aspect-square w-full overflow-hidden rounded-[1.1rem] bg-white ${style.frameClass} ${
        collected ? "" : "opacity-50 grayscale"
      }`}
    >
      <LazyImage
        src={imageSrc}
        alt={`${name} ${style.label} 카드`}
        fill
        sizes={imageSizes}
        className="object-cover"
        onError={() => setImageFailed(true)}
      />

      {style.holoEnabled && collected && (
        <div
          ref={overlayRef}
          className={`collection-card-overlay collection-card-overlay--${grade.toLowerCase()} pointer-events-none absolute inset-0 rounded-[1.1rem]`}
          style={{ backgroundImage: style.holoGradient }}
          aria-hidden
        />
      )}

      {showBadges && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-2.5">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset backdrop-blur-sm ${style.badgeClass}`}
          >
            {style.label}
          </span>
          {!collected && (
            <span className="inline-flex items-center rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white">
              미수집
            </span>
          )}
        </div>
      )}
    </div>
  );

  const cardWithAura =
    style.auraClass && collected ? (
      <div className={`collection-card-aura ${style.auraClass}`}>{cardFrame}</div>
    ) : (
      cardFrame
    );

  return (
    <div
      className={`collection-card-scene w-full ${maxWidthClass}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
      onPointerCancel={resetTilt}
    >
      {cardWithAura}
    </div>
  );
}
