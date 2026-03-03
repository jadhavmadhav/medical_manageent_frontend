import { apiRequestWithAuth } from "@/utils/axios"
import { error } from "console"



export const getMasterProductList = async ({ page, limit }: { page: number, limit: number }) => {

    try {
        const response = await apiRequestWithAuth("get", `/all-master-products`, {}, { page, limit })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getCustomersList = async ({ enterpriseId, page, limit }: { enterpriseId: string, page: number, limit: number }) => {

    try {
        const response = await apiRequestWithAuth("get", "customers", {}, { enterpriseId, page, limit })
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getVendors = async ({ page, limit }: { page: number, limit: number }) => {
    try {
        const response = await apiRequestWithAuth("get", "/all-vendors", {}, { page, limit })
        return response
    } catch (error) {
        console.log(error)
    }
}


