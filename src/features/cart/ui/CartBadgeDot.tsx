type CartBadgeDotProps = {
  count: number;
  variant?: "light" | "dark";
};

export function CartBadgeDot({
  count,
  variant = "light",
}: CartBadgeDotProps) {
  if (count <= 0) return null;

  const ringClass = variant === "dark" ? "ring-black/25" : "ring-white";
  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      aria-hidden
      className={`absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d94f72] px-1 text-[10px] font-bold leading-none text-white ring-2 ${ringClass}`}
    >
      {label}
    </span>
  );
}
