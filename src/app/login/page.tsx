import { MobileShell } from "@/shared/ui";
import { GoogleLoginButton } from "@/features/auth/google-login";

export default function LoginPage() {
  return (
    <MobileShell
      title="로그인"
      subtitle="소셜 로그인으로 간편하게 시작하세요."
      footer={
        <p className="text-center text-[11px] leading-relaxed text-muted">
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      }
    >
      <div className="flex flex-1 flex-col justify-between gap-16">
        <section className="space-y-3 pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
            Delivery Coach
          </p>
          <p className="text-[26px] font-semibold leading-tight text-ink">
            오늘도
            <br />
            맛있게 배달 시켜 먹어요
          </p>
        </section>

        <section className="space-y-3">
          <GoogleLoginButton />
          <p className="text-center text-[12px] text-muted">
            처음 이용하시면 가입 화면으로 안내됩니다.
          </p>
        </section>
      </div>
    </MobileShell>
  );
}
