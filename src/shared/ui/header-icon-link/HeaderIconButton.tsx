import type { ButtonHTMLAttributes, ReactNode } from "react";
import { HEADER_ICON_TRIGGER_CLASS } from "./header-icon-styles";

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
      className={`${HEADER_ICON_TRIGGER_CLASS} disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
