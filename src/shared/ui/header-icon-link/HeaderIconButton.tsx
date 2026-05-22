import type { ButtonHTMLAttributes, ReactNode } from "react";

type HeaderIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
};

export function HeaderIconButton({
  label,
  children,
  className = "",
  type = "button",
  ...props
}: HeaderIconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface active:bg-surface disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
