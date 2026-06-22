"use client";

import { useCallback, useEffect, useRef } from "react";

export function useInfiniteScrollSentinel(
  onIntersect: () => void,
  enabled: boolean
) {
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const disconnect = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnect();
    }
  }, [disconnect, enabled]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      disconnect();

      if (!enabled || !node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onIntersectRef.current();
          }
        },
        { rootMargin: "240px" }
      );

      observerRef.current.observe(node);
    },
    [disconnect, enabled]
  );

  useEffect(() => disconnect, [disconnect]);

  return sentinelRef;
}
