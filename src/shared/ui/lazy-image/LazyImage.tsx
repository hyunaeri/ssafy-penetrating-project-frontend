import Image, { type ImageProps } from "next/image";
import { shouldUnoptimizeImage } from "@/shared/lib/should-unoptimize-image";

type LazyImageProps = Omit<ImageProps, "loading"> & {
  priority?: boolean;
};

export function LazyImage({
  src,
  alt = "",
  priority = false,
  unoptimized,
  style,
  className,
  ...props
}: LazyImageProps) {
  const resolvedSrc = typeof src === "string" ? src : "";
  const resolvedUnoptimized =
    unoptimized ?? (typeof src === "string" ? shouldUnoptimizeImage(src) : false);
  const isPixelPlaceholder = resolvedSrc.includes("empty-pixel");

  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized={resolvedUnoptimized}
      className={className}
      style={
        isPixelPlaceholder
          ? { imageRendering: "pixelated", ...style }
          : style
      }
      {...props}
    />
  );
}
