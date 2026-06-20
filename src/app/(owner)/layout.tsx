import type { ReactNode } from "react";
import { OwnerAppShell } from "@/widgets/app-shell";

export default function OwnerAppLayout({ children }: { children: ReactNode }) {
  return <OwnerAppShell>{children}</OwnerAppShell>;
}
