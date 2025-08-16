import InventoryView from "@/components/modules/inventory/page";
import { getCookie, getEnterpriseFromCookie } from "@/utils/getCookie";

const Page = async () => {
  const enterpriseId = await getCookie("enterpriseId");




  return <InventoryView enterpriseId={enterpriseId} />;
};
export default Page;
