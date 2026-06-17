"use client";

import { useEffect } from "react";
import { setNavigationDirection } from "@/shared/lib/navigation-direction";

function isInternalAppHref(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  if (href.startsWith("/api/")) return false;
  return true;
}

/**
 * 브라우저 뒤로가기(popstate)와 내부 Link 클릭 시 전환 방향을 기록한다.
 */
export function useNavigationDirectionListener() {
  useEffect(() => {
    const onPopState = () => {
      setNavigationDirection("back");
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalAppHref(href)) return;

      const nextUrl = new URL(href, window.location.origin);
      if (nextUrl.origin !== window.location.origin) return;
      if (nextUrl.pathname === window.location.pathname) return;

      setNavigationDirection("forward");
    };

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick, true);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, []);
}
