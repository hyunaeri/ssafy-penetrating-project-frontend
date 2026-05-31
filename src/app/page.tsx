"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/entities/session";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    router.replace(token ? "/main" : "/login");
  }, [router]);

  return (
    <div className="shell-frame flex min-h-screen items-center justify-center bg-surface">
      <p className="text-[13px] text-muted">잠시만 기다려 주세요</p>
    </div>
  );
}
