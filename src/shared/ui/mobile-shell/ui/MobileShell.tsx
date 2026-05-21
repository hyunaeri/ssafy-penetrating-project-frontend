import type { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  footer?: ReactNode;
};

export function MobileShell({
  children,
  title,
  subtitle,
  footer,
}: MobileShellProps) {
  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-mobile flex-col bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
          {(title || subtitle) && (
            <header className="border-b border-line px-5 pb-6 pt-10">
              {title && (
                <h1 className="text-[22px] font-semibold tracking-tight text-ink">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {subtitle}
                </p>
              )}
            </header>
          )}

          <main className="flex flex-1 flex-col px-5 py-8">{children}</main>

          {footer && (
            <footer className="mt-auto border-t border-line bg-white px-5 py-4 pb-8">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}
