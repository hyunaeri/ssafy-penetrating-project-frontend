"use client";

import { useEffect, useState } from "react";
import { ScrollToTopButton } from "@/shared/ui/scroll-to-top/ScrollToTopButton";

type ScrollToTopFabProps = {
  threshold?: number;
  bottomClassName?: string;
  enabled?: boolean;
};

export function ScrollToTopFab({
  threshold = 280,
  bottomClassName,
  enabled = true,
}: ScrollToTopFabProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, threshold]);

  if (!enabled) {
    return null;
  }

  return (
    <ScrollToTopButton
      visible={visible}
      bottomClassName={bottomClassName}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    />
  );
}
