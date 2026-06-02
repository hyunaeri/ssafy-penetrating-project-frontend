"use client";

import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { BackHeader } from "@/shared/ui/back-header";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <BackHeader
        title={title}
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />
      <div className="px-5 py-10">
        <p className="text-[14px] leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
