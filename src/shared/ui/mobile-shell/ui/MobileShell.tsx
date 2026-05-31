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
    <div className="min-h-screen bg-canvas">
      <div className="shell-frame flex min-h-screen flex-col">
        {(title || subtitle) && (
          <header className="border-b border-line/80 bg-white px-5 pb-6 pt-10">
            {title && (
              <h1 className="text-[22px] font-bold tracking-tight text-ink">
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

        <main className="flex flex-1 flex-col bg-surface px-5 py-8">
          {children}
        </main>

        {footer && (
          <footer className="mt-auto border-t border-line/80 bg-white px-5 py-4 pb-8">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
