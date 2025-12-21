// "use client";

import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, Globe, Smartphone, Wallet } from "lucide-react";

export const dateFormatter = (date: any) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("ISO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function numberFormatter(number: number) {
  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getStatusBadge(status?: string) {
  let label = "";
  let className = "";

  switch (status) {
    case "expired":
      label = "Expired";
      className = "bg-red-100 text-red-700";
      break;
    case "out_of_stock":
      label = "Out of Stock";
      className = "bg-gray-200 text-gray-800";
      break;
    case "low_stock":
      label = "Low Stock";
      className = "bg-yellow-100 text-yellow-800";
      break;
    case "in_stock":
      label = "In Stock";
      className = "bg-green-100 text-green-700";
      break;
    default:
      label = status || "";
      className = "bg-blue-100 text-blue-700";
  }

  return (
    <span
      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

export function renderStockProgress(quantity: number, saleQuantity: number) {
  const available = quantity - saleQuantity;
  const total = quantity;
  const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

  return (
    <div className="w-full min-w-[150px]">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span>Sold: {saleQuantity}</span>
        <span>Available: {available}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            percentage < 20
              ? "bg-red-500"
              : percentage < 50
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export const PaymentStatusBadge = (status: any) => {
  let badgeClasses = "p-2 capitalize w-full min-w-[60px]"; // Base classes

  if (status === "paid" || status === "completed") {
    // Green for success/completion
    badgeClasses += "bg-green-500 text-white bg-green-600";
  } else if (status === "pending" || status === "partial") {
    // Orange/Amber for caution/waiting
    badgeClasses += "bg-orange-400 text-black bg-orange-500";
  } else if (
    status === "returned" ||
    status === "cancelled" ||
    status === "failed"
  ) {
    // Red for failure/reversal
    badgeClasses += "bg-red-500 text-white bg-red-600";
  } else {
    // Blue/Gray for a neutral default status
    badgeClasses += "bg-blue-100 text-blue-800 bg-blue-200";
  }

  return <Button className={badgeClasses}>{status}</Button>;
};

export const getPaymentMethodIcon = (method: string) => {
  const lowerMethod = method.toLowerCase();
  const iconClass = "h-4 w-4 mr-1.5"; // consistent icon size and spacing

  if (lowerMethod === "cash") {
    return <Banknote className={iconClass} />;
  }
  if (lowerMethod === "card") {
    return <CreditCard className={iconClass} />;
  }
  if (lowerMethod === "upi") {
    // Smartphone icon for UPI/Digital transactions in medical context
    return <Smartphone className={iconClass} />;
  }
  if (lowerMethod === "wallet") {
    return <Wallet className={iconClass} />;
  }
  // Default icon for 'Other' or unknown methods
  return <Globe className={iconClass} />;
};
