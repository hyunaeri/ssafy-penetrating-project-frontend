import type { ReactNode } from "react";
import { CustomerAppShell } from "@/widgets/app-shell";

export default function CustomerAppLayout({ children }: { children: ReactNode }) {
  return <CustomerAppShell>{children}</CustomerAppShell>;
}
