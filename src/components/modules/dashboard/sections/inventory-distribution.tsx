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
        <ChartContainer config={inventoryChartConfig} className="h-64">
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default InventoryDistribution;
