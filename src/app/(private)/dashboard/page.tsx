import DashboardView from "@/components/modules/dashboard/page";
import { getCookie } from "@/utils/getCookie";

const Page = async () => {
  const enterpriseId = await getCookie("enterpriseId");

  return <DashboardView enterpriseId={enterpriseId!} />;
};

export default Page;
