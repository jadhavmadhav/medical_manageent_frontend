import { SuppliersView } from "@/components/modules/master/suppliers/page"
import { getCookie } from "@/utils/getCookie"


const page = async()=>{
   const enterpriseId = await getCookie("enterpriseId")
    return <SuppliersView enterpriseId={enterpriseId!} />
}

export default page