import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Patient, CreatePatientPayload, ApiResponse } from "../types";
import { createPatient, searchPatients } from "@/services/new-sale-entry";



 

interface UsePatientsParams {
  enterpriseId: string;
  search?: string;
}

// ✅ Fix: hook accepts { enterpriseId, search } — enabled guard on enterpriseId
export function usePatients({ enterpriseId, search = "" }: UsePatientsParams) {
  return useQuery({
    queryKey: ["patients", enterpriseId, search],
    queryFn: () => searchPatients({ enterpriseId, search }),
    enabled: !!enterpriseId && !!search,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
    select: (data) => data.result
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}