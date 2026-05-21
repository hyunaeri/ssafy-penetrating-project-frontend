"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSignupToken, type SignupTokenPreview } from "@/entities/user";

export function useSignupToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preview, setPreview] = useState<SignupTokenPreview | null>(null);
  const [signupToken, setSignupToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams?.get("signupToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const parsed = parseSignupToken(token);
    if (!parsed) {
      router.replace("/login");
      return;
    }

    setSignupToken(token);
    setPreview(parsed);
  }, [router, searchParams]);

  return { preview, signupToken, isReady: preview !== null };
}
