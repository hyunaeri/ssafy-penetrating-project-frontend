import Image from "next/image";

export const WHIK_PIXEL_LOGO = "/images/whik-pixel-logo.png";

type WhikBrandMarkProps = {
  size?: "md" | "lg";
  subtitle?: string;
  tagline?: string;
  logoBackground?: "white" | "cream" | "none";
  showLogo?: boolean;
};

const LOGO_SIZE = {
  md: 56,
  lg: 72,
} as const;

const LOGO_BG = {
  white: "bg-white",
  cream: "bg-[#FDF8ED]",
  none: "bg-transparent",
} as const;

export function WhikBrandMark({
  size = "md",
  subtitle = "휙",
  tagline,
  logoBackground = "cream",
  showLogo = true,
}: WhikBrandMarkProps) {
  const logoSize = LOGO_SIZE[size];
  const titleClass = size === "lg" ? "text-[26px]" : "text-[22px]";
  const subtitleClass = size === "lg" ? "text-[15px]" : "text-[14px]";
  const logoFrameClass =
    logoBackground === "none"
      ? "bg-transparent"
      : `${LOGO_BG[logoBackground]} ring-1 ring-line/80`;

  return (
    <div className={`flex items-center ${showLogo ? "gap-3.5" : ""}`}>
      {showLogo && (
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl ${logoFrameClass}`}
          style={{ width: logoSize, height: logoSize }}
        >
          <Image
            src={WHIK_PIXEL_LOGO}
            alt="Whik 로고"
            width={logoSize}
            height={logoSize}
            className="h-full w-full object-contain p-1"
            style={{ imageRendering: "pixelated" }}
            priority
          />
        </div>
      )}

      <div className="min-w-0">
        <p className={`${titleClass} font-bold leading-none tracking-tight text-ink`}>
          Whik
        </p>
        <p className={`${subtitleClass} mt-1.5 font-semibold text-brand-dark`}>
          {subtitle}
        </p>
        {tagline && (
          <p className="mt-1 text-[12px] font-medium text-muted">{tagline}</p>
        )}
      </div>
    </div>
  );
}
