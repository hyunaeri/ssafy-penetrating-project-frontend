import { Suspense } from "react";
import { MobileShell } from "@/shared/ui";
import { SignupForm } from "@/widgets/signup-form";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <MobileShell title="회원가입">
          <p className="text-[14px] text-muted">정보를 불러오는 중입니다</p>
        </MobileShell>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
