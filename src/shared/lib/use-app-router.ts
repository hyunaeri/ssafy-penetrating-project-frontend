"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { setNavigationDirection } from "@/shared/lib/navigation-direction";

/**
 * 페이지 전환 방향을 기록한 뒤 Next.js 라우터를 호출한다.
 * `router.back()` / `router.push()`를 직접 쓰면 슬라이드 애니메이션 방향이 맞지 않을 수 있다.
 */
export function useAppRouter() {
  const router = useRouter();

  return useMemo(
    () => ({
      push: (
        href: string,
        options?: Parameters<typeof router.push>[1]
      ) => {
        setNavigationDirection("forward");
        router.push(href, options);
      },
      back: () => {
        setNavigationDirection("back");
        router.back();
      },
      replace: (
        href: string,
        options?: Parameters<typeof router.replace>[1]
      ) => {
        setNavigationDirection("replace");
        router.replace(href, options);
      },
      refresh: router.refresh,
      prefetch: router.prefetch,
    }),
    [router]
  );
}
