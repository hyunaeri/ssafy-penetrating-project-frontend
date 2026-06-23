"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ensureSession } from "@/entities/user";
import { useNavigationDirectionListener } from "@/shared/lib/use-navigation-direction-listener";
import { AppToaster } from "@/shared/ui";

function NavigationDirectionListener() {
  useNavigationDirectionListener();
  return null;
}

function SessionBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void ensureSession().then((session) => {
      if (session) {
        queryClient.setQueryData(["currentUser"], session.user);
      }
    });
  }, [queryClient]);

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
        <SessionBootstrap />
        <NavigationDirectionListener />
        {children}
        <AppToaster />
      </QueryClientProvider>
    </>
  );
}
