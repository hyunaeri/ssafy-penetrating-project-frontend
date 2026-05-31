import Link from "next/link";
import type { ReactNode } from "react";

type HeaderIconLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

export function HeaderIconLink({ href, label, children }: HeaderIconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-all hover:bg-brand-soft hover:text-brand-dark active:scale-95"
    >
      {children}
    </Link>
  );
}
