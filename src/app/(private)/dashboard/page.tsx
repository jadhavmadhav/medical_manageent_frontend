"use client";
import { useQuery } from "@tanstack/react-query";
import { getEnterprise } from "@/services/enterprise";
import Cookies from "js-cookie";

const Dashboard = () => {
  const enterpriseId = Cookies.get("enterpriseId");

  const { data, isLoading } = useQuery({
    queryKey: ["enterpriseDetails", enterpriseId],
    queryFn: () => getEnterprise(enterpriseId || ""),
    enabled: !!enterpriseId,
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Dashboard - {data?.name}</div>;
};

export default Dashboard;
