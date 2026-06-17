"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigationDirectionListener } from "@/shared/lib/use-navigation-direction-listener";
import { AppToaster } from "@/shared/ui";

function NavigationDirectionListener() {
  useNavigationDirectionListener();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavigationDirectionListener />
        {children}
        <AppToaster />
      </QueryClientProvider>
    </>
  );
}
