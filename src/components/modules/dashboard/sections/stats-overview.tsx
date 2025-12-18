 import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { statsOverview } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Pill, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  isLoading: boolean;
  prefix?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
  prefix = "",
}: StatCardProps) => (
  <Card className="shadow-sm w-full hover:shadow-md transition-shadow p-3 gap-2">
    <CardHeader className="flex flex-row items-center justify-between px-3">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent className="px-3">
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <div className="text-lg font-semibold">
          {prefix}
          {value}
        </div>
      )}
    </CardContent>
  </Card>
);

const StatsOverview = ({ enterpriseId }: { enterpriseId: string }) => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["statsOverview", enterpriseId],
    queryFn: () => statsOverview({ enterpriseId }),
    select: (data) => data.data,
    enabled: !!enterpriseId,
  });

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm text-red-500">
          Error loading stats
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex justify-between gap-10">
      <StatCard
        title="Inventory"
        value={stats?.inventoryItems}
        icon={Pill}
        isLoading={isLoading}
      />

      <StatCard
        title="Today's Sales"
        value={stats?.sales}
        icon={ShoppingCart}
        isLoading={isLoading}
      />

      <StatCard
        title="Patients"
        value={stats?.patients}
        icon={Users}
        isLoading={isLoading}
      />

      <StatCard
        title="Revenue"
        value={stats?.revenue}
        icon={BarChart3}
        prefix="₹ "
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsOverview;
