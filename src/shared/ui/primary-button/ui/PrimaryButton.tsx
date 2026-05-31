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
    "flex h-12 w-full items-center justify-center rounded-button text-[14px] font-semibold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "solid"
      ? "bg-brand text-white shadow-float hover:bg-brand-dark"
      : "border border-line bg-white text-ink hover:border-brand/30 hover:bg-brand-soft";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
