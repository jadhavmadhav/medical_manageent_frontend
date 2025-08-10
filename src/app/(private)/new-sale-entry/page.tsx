import NewSaleEntryView from "@/components/modules/new-sale-entry/page";
import { getCookie } from "@/utils/getCookie";

interface PageProps {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

const NewSaleEntry = async ({ params, searchParams }: PageProps) => {
  const resolvedParams = params ? await params : undefined;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const enterpriseId = await getCookie("enterpriseId");
  console.log("Params:", resolvedParams);
  console.log("Search Params:", resolvedSearchParams);

  const id = resolvedSearchParams?.id as string;

  return (
    <NewSaleEntryView enterpriseId={enterpriseId || ""} bill_id={id ?? ""} />
  );
};

export default NewSaleEntry;
