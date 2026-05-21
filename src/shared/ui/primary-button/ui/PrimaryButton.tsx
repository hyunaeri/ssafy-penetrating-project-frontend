import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "outline";
};

export function PrimaryButton({
  children,
  variant = "solid",
  className = "",
  ...props
}: PrimaryButtonProps) {
  const base =
    "flex h-12 w-full items-center justify-center text-[14px] font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "solid"
      ? "bg-ink text-white hover:bg-black"
      : "border border-ink bg-white text-ink hover:bg-surface";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
