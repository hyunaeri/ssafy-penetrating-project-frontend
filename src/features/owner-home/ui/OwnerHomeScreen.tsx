"use client";

import { useState } from "react";
import { OwnerHomeGuideSection } from "@/features/owner-home/ui/OwnerHomeGuideSection";
import { OwnerHomeHeader } from "@/features/owner-home/ui/OwnerHomeHeader";
import { OwnerHomePromoBanner } from "@/features/owner-home/ui/OwnerHomePromoBanner";
import { OwnerQuickActionGrid } from "@/features/owner-home/ui/OwnerQuickActionGrid";

export function OwnerHomeScreen() {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <OwnerHomeHeader query={query} onQueryChange={setQuery} />

      <div className="flex flex-1 flex-col gap-3 px-3 pb-8 pt-3">
        {!searching && <OwnerHomePromoBanner />}
        <OwnerQuickActionGrid query={query} />
        {!searching && <OwnerHomeGuideSection />}
      </div>
    </div>
  );
}
