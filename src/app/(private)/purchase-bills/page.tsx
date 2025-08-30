import PurchaseBills from "@/components/modules/purchase-bills/page";
import { getCookie } from "@/utils/getCookie";

const page = async () => {
  const enterpriseId = await getCookie("enterpriseId");
  return <PurchaseBills enterpriseId={enterpriseId || ""} />;
};

export default page;
