// lib/context/EnterpriseContext.tsx
"use client";
import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/services/enterprise";
import Cookies from "js-cookie";

interface Enterprise {
  id: string;
  name: string;
  enterpriseCode: string;
  extraFieldsForProduct: any[];
  billTableForCreateBill: any[];
  reportConfigurations: reportConfigurationsObj[];
  enterpriseId: string;
  // Add other fields as per your API response
}

interface reportConfigurationsObj {
  key: string;
  value: boolean;
  reportLabel: string;
  configColumns: configColumnsObj[];
}

interface configColumnsObj {
  key: string;
  label: string;
  value: boolean;
  required: boolean;
  position: number | string;
}
interface EnterpriseContextType {
  enterprise: Enterprise | undefined;
  isLoading: boolean;
  error: any;
}

const EnterpriseContext = createContext<EnterpriseContextType | undefined>(
  undefined
);

export function EnterpriseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const enterpriseId = Cookies.get("enterpriseId");

  const { data, isLoading, error } = useQuery({
    queryKey: ["enterprise"],
    queryFn: () => getEnterprise(enterpriseId || ""),
    enabled: !!enterpriseId, // Only fetch if user is logged in
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const value = useMemo(
    () => ({
      enterprise: data,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );

  return (
    <EnterpriseContext.Provider value={value}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error("useEnterprise must be used within an EnterpriseProvider");
  }
  return context;
}
