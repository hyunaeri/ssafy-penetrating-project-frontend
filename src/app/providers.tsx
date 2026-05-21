"use client";

import type { ReactNode } from "react";
import { AppToaster } from "@/shared/ui";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
