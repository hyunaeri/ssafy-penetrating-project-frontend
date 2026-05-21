"use client";

import { useEffect, useState } from "react";
import {
  CategoryGrid,
  ScrollToTopButton,
} from "@/features/category-grid";

export default function MainPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <CategoryGrid />
      <ScrollToTopButton
        visible={showTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </>
  );
}
