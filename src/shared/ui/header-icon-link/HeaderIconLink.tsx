import Link from "next/link";
import type { ReactNode } from "react";
import { HEADER_ICON_TRIGGER_CLASS } from "./header-icon-styles";

type HeaderIconLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

export function HeaderIconLink({ href, label, children }: HeaderIconLinkProps) {
  return (
    <Link href={href} aria-label={label} className={HEADER_ICON_TRIGGER_CLASS}>
      {children}
    </Link>
  );
}
