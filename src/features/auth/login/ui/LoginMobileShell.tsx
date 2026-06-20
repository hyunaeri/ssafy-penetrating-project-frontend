import type { ReactNode } from "react";

type LoginMobileShellProps = {
  children: ReactNode;
  footer?: ReactNode;
};

/** 로그인 전용 셸 — 민트 톤 배경 */
export function LoginMobileShell({ children, footer }: LoginMobileShellProps) {
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <div className="shell-frame flex min-h-screen flex-col bg-gradient-to-b from-brand-soft via-brand-light to-brand-light">
        <main className="flex flex-1 flex-col px-5 py-10">{children}</main>

        {footer && (
          <footer className="mt-auto px-5 py-4 pb-8">{footer}</footer>
        )}
      </div>
    </div>
  );
}
