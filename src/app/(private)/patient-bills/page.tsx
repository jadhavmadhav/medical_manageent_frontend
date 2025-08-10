import PatientBillView from "@/components/modules/patient-bills/PatientBillView";
import { getCookie } from "@/utils/getCookie";

export default async function BillsPage() {
  const enterpriseId = await getCookie("enterpriseId");
  return <PatientBillView enterpriseId={enterpriseId || ""} />;
}
