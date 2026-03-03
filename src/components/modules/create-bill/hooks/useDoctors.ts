import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor, CreateDoctorPayload, ApiResponse } from "../types";
import { createDoctor, searchDoctors } from "@/services/new-sale-entry";



interface UseDocotrsParams {
  enterpriseId: string;
  search?: string;
}

// ✅ Fix: hook accepts { enterpriseId, search } — enabled guard on enterpriseId
export function useDoctors({ enterpriseId, search = "" }: UseDocotrsParams) {
  return useQuery({
    queryKey: ["doctors", enterpriseId, search],
    queryFn: () => searchDoctors({ enterpriseId, search }),
    enabled: !!enterpriseId && !!search,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
    select: (data) => data.doctors
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDoctorPayload) => createDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}