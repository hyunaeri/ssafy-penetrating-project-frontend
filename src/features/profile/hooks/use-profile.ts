"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type UserResponse } from "@/entities/user";

export function useProfile() {
  const query = useQuery<UserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? query.error.message : null,
    reload: query.refetch,
  };
}
