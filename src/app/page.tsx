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
    <div className="mx-auto flex min-h-screen max-w-mobile items-center justify-center bg-white">
      <p className="text-[13px] text-muted">잠시만 기다려 주세요</p>
    </div>
  );
}
