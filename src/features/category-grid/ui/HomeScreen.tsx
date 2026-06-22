"use client";

import { useState } from "react";
import { HomeCategoryGrid } from "@/features/category-grid/ui/HomeCategoryGrid";
import { HomeHeader } from "@/features/category-grid/ui/HomeHeader";
import { HomePromoBanner } from "@/features/category-grid/ui/HomePromoBanner";
import { RecommendedStores } from "@/features/category-grid/ui/RecommendedStores";

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <HomeHeader query={query} onQueryChange={setQuery} />

      <div className="flex flex-1 flex-col gap-3 px-3 pb-8 pt-3">
        {!searching && <HomePromoBanner />}
        <HomeCategoryGrid query={query} />
        {!searching && <RecommendedStores />}
      </div>
    </div>
  );
}
