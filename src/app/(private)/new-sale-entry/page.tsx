import NewSaleEntryView from "@/components/modules/new-sale-entry/page";
import { getCookie } from "@/utils/getCookie";

type PageProps = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

const NewSaleEntry = async ({ searchParams }: PageProps) => {
  const enterpriseId = await getCookie("enterpriseId");

  const { id } = searchParams;

  return (
    <NewSaleEntryView enterpriseId={enterpriseId || ""} bill_id={id?? ""} />
  );
};

export default NewSaleEntry;
