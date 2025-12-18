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
import { salesPerformance } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const SalesPerformance = ({ enterpriseId }: { enterpriseId: string }) => {
  const salesChartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
  };

  const { data } = useQuery({
    queryKey: ["salesPerformance", enterpriseId],
    queryFn: () => salesPerformance({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });
  console.log("salesPerformance", data);
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>Last 15 days sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={salesChartConfig} className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="label" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="totalSales"
                fill="var(--color-sales)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesPerformance;
