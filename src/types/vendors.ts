

export interface createNewVendorPayload {
  name: string
  enterpriseId: string
  companyName: string
  mobileNumber: string
  email: string
  gstNumber: string
  address: string
}



export interface createNewVendorResponse {
  status: number
  message: string
  data: createNewVendorResponseData
}

export interface createNewVendorResponseData {
  name: string
  enterpriseId: string
  companyName: string
  mobileNumber: string
  email: string
  gstNumber: string
  address: string
  country: string
  _id: string
  createdAt: string
  __v: number
}
