import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types";
import { getAllInventories } from "@/services/new-sale-entry";

interface UseInventoriesParams {
  enterpriseId: string;
  search?: string;
}

/**
 * Wraps your existing `getAllInventories` call with TanStack Query.
 *
 * - queryKey includes both enterpriseId and search so each unique search
 *   string gets its own cache entry and refetches independently.
 * - `placeholderData: (prev) => prev` keeps the previous result visible
 *   while a new search is in-flight (no flash of empty dropdown).
 * - `enabled: !!enterpriseId` mirrors your existing pattern — won't fire
 *   until an enterpriseId is available.
 * - `staleTime: 60_000` — inventory list is stable enough for 1 min cache.
 */
export function useInventories({ enterpriseId, search = "" }: UseInventoriesParams) {
  return useQuery({
    queryKey: ["inventories", enterpriseId, search],
    queryFn: () => getAllInventories({ enterpriseId, search }),
    enabled: !!enterpriseId && !!search,
    staleTime: 1000 * 60, // 1 min
    placeholderData: (prev) => prev,
    select: (data) => data?.result
  });
}