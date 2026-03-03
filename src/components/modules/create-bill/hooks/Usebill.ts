import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getBillById, UpdateBill } from "@/services/new-sale-entry";

// ─── Fetch a single bill by ID ────────────────────────────────────────────────

export function useGetBill(bill_id: string | undefined) {
    return useQuery({
        queryKey: ["bill", bill_id],
        // getBillById should return { result: FetchedBill, ... } — we select result
        queryFn: () => getBillById(bill_id!).then((res) => res.result),
        enabled: !!bill_id,
        staleTime: 1000 * 60 * 5, // 5 min — bill data won't change unless we update it
        retry: 1,
    });
}

// ─── Update an existing bill ──────────────────────────────────────────────────

export function useUpdateBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => UpdateBill(payload),
        onSuccess: (_data, variables) => {
            // Invalidate so any detail view elsewhere sees fresh data immediately
            queryClient.invalidateQueries({ queryKey: ["bill", _data?._id] });
            // Also bust any bills-list query (adjust key to match your list hook)
            queryClient.invalidateQueries({ queryKey: ["bills"] });
        },
    });
}