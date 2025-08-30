import AddNewInventories from "@/components/modules/add-inventory/page";
import { getCookie } from "@/utils/getCookie";

const Page = async () => {
  const enterpriseId = await getCookie("enterpriseId");

  return <AddNewInventories enterpriseId={enterpriseId!} />;
};

export default Page;
