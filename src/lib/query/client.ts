"use client";

import { QueryClient } from "@tanstack/react-query";

const STALE_MS = 60_000;
const GC_MS = 5 * 60_000;

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_MS,
        gcTime: GC_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
