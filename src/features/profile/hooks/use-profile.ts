"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccessToken, useSessionUser } from "@/entities/session";
import { getCurrentUser, type UserResponse } from "@/entities/user";

export function useProfile() {
  const accessToken = useAccessToken();
  const cachedUser = useSessionUser();

  const query = useQuery<UserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: Boolean(accessToken),
    initialData: cachedUser ?? undefined,
    staleTime: 60_000,
  });

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
