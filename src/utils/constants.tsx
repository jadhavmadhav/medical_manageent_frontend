// "use client";

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
  return number.toLocaleString("en-IN");
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
