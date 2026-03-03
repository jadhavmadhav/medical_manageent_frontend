import { CustomersView } from "@/components/modules/master/customers/page"
import { getCookie } from "@/utils/getCookie"


const page = async () => {

    const enterpriseId = await getCookie("enterpriseId")
    return <CustomersView enterpriseId={enterpriseId!} />
}

export default page