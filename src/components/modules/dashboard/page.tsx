"use client";
import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsOverview from "./sections/stats-overview";
import ExpiringProducts from "./sections/expiring-products";
import TopSoldProducts from "./sections/top-sold-products";
import PendingPatientBills from "./sections/pending-patient-bills";
import PendingPurchaseBills from "./sections/pending-purchase-bills";
import ProfitTrend from "./sections/profit-trend";
import SalesPerformance from "./sections/sales-performance";
import InventoryDistribution from "./sections/inventory-distribution";
import { useRouter } from "next/navigation";
 

const DashboardView = ({ enterpriseId }: { enterpriseId: string }) => {
 const router= useRouter()

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  const handleNewBill = () => { 
    router.push('/new-sale-entry'); 
  }
  return (
    <div className="min-h-screen bg-background  py-3 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1"> Dashboard</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Button onClick={handleNewBill}>
            <Plus className="h-4 w-4 " />
            New Bill
          </Button>
        </div>
      </div>
      {/* Stats Overview */}
      <StatsOverview enterpriseId={enterpriseId!} />

      <div className="grid grid-cols-1  gap-6">
        {/* Sales Chart */}
        <SalesPerformance enterpriseId={enterpriseId!} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Products */}
        <ExpiringProducts enterpriseId={enterpriseId!} />

        {/* Top Sold Products */}
        <TopSoldProducts enterpriseId={enterpriseId!} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Patient Payments */}
        <PendingPatientBills enterpriseId={enterpriseId!} />
        {/* Pending Purchase Bills */}
        <PendingPurchaseBills enterpriseId={enterpriseId!} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Trend */}
        <ProfitTrend enterpriseId={enterpriseId!} />

        {/* Inventory Chart */}
        <InventoryDistribution />
      </div>
    </div>
  );
};

export default DashboardView;
