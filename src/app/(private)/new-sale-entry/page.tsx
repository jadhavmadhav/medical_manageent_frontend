import MedicalBillCreate from "@/components/modules/create-bill/page";
import NewSaleEntryView from "@/components/modules/new-sale-entry/page";
import { getCookie } from "@/utils/getCookie";

interface PageProps {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

const NewSaleEntry = async ({ params, searchParams }: PageProps) => {


  // ✅ Both awaits run in parallel — no waterfall
  const [resolvedSearchParams, enterpriseId] = await Promise.all([
    searchParams ?? Promise.resolve(),
    getCookie("enterpriseId"),
  ]);

  const idValue = resolvedSearchParams?.id;
  const id = Array.isArray(idValue) ? idValue[0] : idValue || "";

  return <MedicalBillCreate enterpriseId={enterpriseId!} bill_id={id} />
  // <NewSaleEntryView enterpriseId={enterpriseId!} bill_id={id} />;
};

export default NewSaleEntry;
