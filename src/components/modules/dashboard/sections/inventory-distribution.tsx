import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const InventoryDistribution = () => {
  const inventoryData = [
    { name: "Tablets", value: 40 },
    { name: "Syrups", value: 25 },
    { name: "Injections", value: 15 },
    { name: "OTC", value: 12 },
    { name: "Equipment", value: 8 },
  ];

  const inventoryChartConfig = {
    value: {
      label: "Percentage",
      color: "hsl(var(--chart-2))",
    },
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Inventory Distribution</CardTitle>
        <CardDescription>Inventory distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <ChartContainer config={inventoryChartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={inventoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {inventoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer> */}

        <div className="space-y-4">
          {[
            { name: "Tablets", value: 40, color: "bg-blue-500" },
            { name: "Syrups", value: 25, color: "bg-green-500" },
            { name: "Injections", value: 15, color: "bg-yellow-500" },
            { name: "OTC Products", value: 12, color: "bg-orange-500" },
            { name: "Equipment", value: 8, color: "bg-purple-500" },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium ">
                  {item.name}
                </span>
                <span className="text-sm font-semibold">
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryDistribution;
