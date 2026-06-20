"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSignupToken, type SignupTokenPreview } from "@/entities/user";
import { getOAuthIntent } from "@/shared/lib/oauth-intent";

export function useSignupToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preview, setPreview] = useState<SignupTokenPreview | null>(null);
  const [signupToken, setSignupToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams?.get("signupToken");
    const loginPath =
      getOAuthIntent() === "admin" ? "/admin/login" : "/login";

    if (!token) {
      router.replace(loginPath);
      return;
    }

    const parsed = parseSignupToken(token);
    if (!parsed) {
      router.replace(loginPath);
      return;
    }

    setSignupToken(token);
    setPreview(parsed);
  }, [router, searchParams]);

  return { preview, signupToken, isReady: preview !== null };
}
