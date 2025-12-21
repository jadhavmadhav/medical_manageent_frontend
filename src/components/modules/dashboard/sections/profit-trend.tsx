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
import { profitTrend } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const ProfitTrend = ({ enterpriseId }: { enterpriseId: string }) => {
 
  const profitChartConfig = {
    profit: {
      label: "Profit",
      color: "var(--chart-3)",
    },
  };

  const { data } = useQuery({
    queryKey: ["profitTrend", enterpriseId],
    queryFn: () => profitTrend({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });
  console.log("profitTrend", data);
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
          Profit Trend
        </CardTitle>
        <CardDescription>Monthly profit performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={profitChartConfig} className="h-64 w-full">
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
                dataKey="totalProfit"
                fill="var(--color-profit)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProfitTrend;
