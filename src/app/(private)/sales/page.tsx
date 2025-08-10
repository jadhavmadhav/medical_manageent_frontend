import SalesList from "@/components/modules/sales/sales-list";
import { getCookie } from "@/utils/getCookie";

const SalesPage = async () => {
  const enterpriseId = await getCookie("enterpriseId");
  return <SalesList enterpriseId={enterpriseId || ""} />;
};

export default SalesPage;
