"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeSignup, type SignupRole } from "@/entities/user";
import { setAccessToken } from "@/entities/session";
import type { SignupFormValues } from "@/features/auth/signup/model/types";

type UseSignupSubmitParams = {
  signupToken: string | null;
  role: SignupRole | null;
};

export function useSignupSubmit({ signupToken, role }: UseSignupSubmitParams) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (values: SignupFormValues) => {
    if (!signupToken || !role) return;

    setError(null);
    setSubmitting(true);

    try {
      const response = await completeSignup({
        signupToken,
        phoneNumber: values.phoneNumber.trim(),
        address: values.address.trim(),
        role,
      });

      setAccessToken(response.accessToken);
      router.replace("/main");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "회원가입에 실패했습니다."
      );
      setSubmitting(false);
    }
  };

  return { submit, error, submitting };
}
