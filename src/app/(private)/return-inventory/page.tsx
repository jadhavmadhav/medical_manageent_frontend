import ReturnInventoryView from "@/components/modules/return-inventory/page";
import { getCookie } from "@/utils/getCookie";

const ReturnInventory = async () => {
  const enterpriseId = await getCookie("enterpriseId");
  return <ReturnInventoryView enterpriseId={enterpriseId || ""} />;
};

export default ReturnInventory;
