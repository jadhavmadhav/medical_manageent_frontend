export interface createDoctorPayload {
  enterpriseId: string;
  name: string;
  specialization?: string;
  mobile_number: string;
  email?: string;
  hospital: string;
  address: string;
}

export interface createDoctorResponse {
  message: string;
  doctor: Doctor;
}

export interface Doctor {
  enterpriseId: string;
  name: string;
  specialization: string;
  mobile_number: string;
  email: string;
  hospital: string;
  address: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface updateDoctorPayload {
  _id: string;
  enterpriseId: string;
  name: string;
  specialization: string;
  mobile_number: string;
  email: string;
  hospital: string;
  address: string;
}

export interface updateDoctorResponse {
  message: string;
  status: number;
  doctor: Doctor;
}

export interface searchDoctorPayload {
  enterpriseId: string;
  search: string;
}
