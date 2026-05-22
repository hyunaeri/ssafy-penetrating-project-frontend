"use client";

import { useState } from "react";
import { MobileShell } from "@/shared/ui";
import { formatProviderLabel, type SignupRole } from "@/entities/user";
import { AddressSearchModal } from "@/features/auth/signup/ui/AddressSearchModal";
import { SignupContactFields } from "@/features/auth/signup/ui/SignupContactFields";
import { SignupFooter } from "@/features/auth/signup/ui/SignupFooter";
import { SignupProfileCard } from "@/features/auth/signup/ui/SignupProfileCard";
import { SignupRoleSection } from "@/features/auth/signup/ui/SignupRoleSection";
import { useSignupForm } from "@/features/auth/signup/hooks/use-signup-form";
import { useSignupSubmit } from "@/features/auth/signup/hooks/use-signup-submit";
import { useSignupToken } from "@/features/auth/signup/hooks/use-signup-token";

export function SignupForm() {
  const { preview, signupToken, isReady } = useSignupToken();
  const [role, setRole] = useState<SignupRole | null>(null);
  const {
    form,
    phoneNumber,
    address,
    showPostcode,
    openPostcode,
    closePostcode,
    handleAddressComplete,
  } = useSignupForm();
  const { submit, error, submitting } = useSignupSubmit({ signupToken, role });

  const canSubmit =
    Boolean(signupToken && role && phoneNumber.trim() && address.trim()) &&
    !submitting;

  if (!isReady || !preview) {
    return (
      <MobileShell title="회원가입">
        <p className="text-[14px] text-muted">정보를 불러오는 중입니다</p>
      </MobileShell>
    );
  }

  return (
    <>
      <MobileShell
        title="회원가입"
        subtitle={
          <>
            {formatProviderLabel(preview.provider)} 계정 인증이 완료되었습니다.
            <br />
            서비스 이용을 위해 추가 정보를 입력해 주세요.
          </>
        }
        footer={
          <SignupFooter
            error={error}
            canSubmit={canSubmit}
            submitting={submitting}
            onSubmit={() => void form.handleSubmit(submit)()}
          />
        }
      >
        <SignupProfileCard preview={preview} />
        <SignupContactFields
          register={form.register}
          errors={form.formState.errors}
          hasBaseAddress={Boolean(address.trim())}
          onOpenAddressSearch={openPostcode}
        />
        <SignupRoleSection role={role} onRoleChange={setRole} />
      </MobileShell>

      <AddressSearchModal
        open={showPostcode}
        onClose={closePostcode}
        onComplete={handleAddressComplete}
      />
    </>
  );
}
