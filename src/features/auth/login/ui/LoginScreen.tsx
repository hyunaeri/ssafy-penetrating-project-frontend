import { GoogleLoginButton } from "@/features/auth/google-login";
import { LoginMobileShell } from "@/features/auth/login/ui/LoginMobileShell";

export function LoginScreen() {
  return (
    <LoginMobileShell
      footer={
        <p className="text-center text-[11px] leading-relaxed text-muted">
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center px-2">
        <h1
          className="font-euljiro -rotate-[4deg] text-[clamp(4.5rem,18vw,6rem)] leading-none tracking-wide text-brand-dark"
          aria-label="Whik"
        >
          Whik
        </h1>

        <div className="mt-16 w-full">
          <GoogleLoginButton />
        </div>
      </div>
    </LoginMobileShell>
  );
}
