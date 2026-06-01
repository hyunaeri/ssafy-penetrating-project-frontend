"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { completeSignup, type SignupRole } from "@/entities/user";
import { setAccessToken } from "@/entities/session";
import { notifyError, notifySuccess, toastMessages } from "@/shared/ui";
import { formatSignupAddress } from "@/features/auth/signup/lib/format-signup-address";
import type { SignupFormValues } from "@/features/auth/signup/model/types";

type UseSignupSubmitParams = {
  signupToken: string | null;
  role: SignupRole | null;
};

export function useSignupSubmit({ signupToken, role }: UseSignupSubmitParams) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: completeSignup,
  });

  const submit = async (values: SignupFormValues) => {
    if (!signupToken || !role) return;

    setError(null);

    try {
      const response = await mutation.mutateAsync({
        signupToken,
        phoneNumber: values.phoneNumber.trim(),
        address: formatSignupAddress(values.address, values.addressDetail),
        role,
      });

      setAccessToken(response.accessToken);
      notifySuccess(toastMessages.signup.success);
      router.replace("/main");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : toastMessages.signup.fail.description;
      setError(message);
      notifyError({
        title: toastMessages.signup.fail.title,
        description: message,
      });
    }
  };

  return { submit, error, submitting: mutation.isPending };
}
