"use client";

import type { ReactNode } from "react";
import { AlarmButton } from "@/features/notification";
import { BackHeader } from "@/shared/ui";

type OwnerPageHeaderProps = {
  title: string;
  trailing?: ReactNode;
};

export function OwnerPageHeader({ title, trailing }: OwnerPageHeaderProps) {
  return (
    <BackHeader
      title={title}
      trailing={
        <>
          {trailing}
          <AlarmButton />
        </>
      }
    />
  );
}
