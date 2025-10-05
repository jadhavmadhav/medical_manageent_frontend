"use client";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsOverview from "./sections/stats-overview";
import ExpiringProducts from "./sections/expiring-products";
import TopSoldProducts from "./sections/top-sold-products";
import PendingPatientBills from "./sections/pending-patient-bills";
import PendingPurchaseBills from "./sections/pending-purchase-bills";
import ProfitTrend from "./sections/profit-trend";
import SalesPerformance from "./sections/sales-performance";
import InventoryDistribution from "./sections/inventory-distribution";

const DashboardView = ({ enterpriseId }: { enterpriseId: string }) => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold"> Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Bill
          </Button>
        </div>
      </div>
      {/* Stats Overview */}
      <StatsOverview enterpriseId={enterpriseId!} />

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

      <div className="grid grid-cols-1  gap-6">
        {/* Sales Chart */}
        <SalesPerformance enterpriseId={enterpriseId!} />
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
