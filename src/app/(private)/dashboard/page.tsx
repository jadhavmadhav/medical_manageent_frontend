"use client";

import { useEnterprise } from "@/lib/context/EnterpriseContext";

const Dashboard = () => {
  const { enterprise, isLoading, error: enterpriseError } = useEnterprise();

  console.log("enterprise", enterprise);

  if (isLoading) return <div>Loading...</div>;

  return <div>Dashboard - {enterprise?.name}</div>;
};

export default Dashboard;
