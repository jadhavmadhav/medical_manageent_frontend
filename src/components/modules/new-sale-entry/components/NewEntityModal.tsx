// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// /* -------------------------------------------------------------------------- */
// /*                                   TYPES                                    */
// /* -------------------------------------------------------------------------- */

// type EntityType = "patient" | "doctor";

// interface NewEntityModalProps {
//   entityType: EntityType;
//   open: boolean;
//   enterpriseId: string;
//   setOpen: (open: boolean) => void;
//   onSubmit: (data: FormData) => void;
// }

// interface BaseForm {
//   enterpriseId: string;
//   name: string;
//   mobile_number: string;
//   address: string;
// }

// interface PatientForm extends BaseForm {
//   age: string;
//   gender: "Male" | "Female" | "Other";
// }

// interface DoctorForm extends BaseForm {
//   specialization: string;
//   hospital?: string;
//   email?: string;
// }

// type FormData = PatientForm | DoctorForm;

// /* -------------------------------------------------------------------------- */
// /*                             INITIAL FORM STATE                              */
// /* -------------------------------------------------------------------------- */

// const getInitialFormData = (
//   entityType: any,
//   enterpriseId: string
// ): any =>
//   entityType === "patient"
//     ? {
//       enterpriseId,
//       patientName: "",
//       patientMobileNumber: "",
//       patientAddress: "",
//       age: "",
//       gender: "Male",
//     }
//     : {
//       enterpriseId,
//       doctorName: "",
//       doctorMobileNumber: "",
//       doctorAddress: "",
//       doctorSpecialization: "",
//       doctorHospital: "",
//       // email: "",
//     };

// /* -------------------------------------------------------------------------- */
// /*                               MAIN COMPONENT                                */
// /* -------------------------------------------------------------------------- */

// const NewEntityModal = ({
//   entityType,
//   open,
//   enterpriseId,
//   setOpen,
//   onSubmit,
// }: NewEntityModalProps) => {
//   const [formData, setFormData] = useState<FormData>(
//     getInitialFormData(entityType, enterpriseId)
//   );
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* Reset form when entity type or modal changes */
//   useEffect(() => {
//     if (open) {
//       setFormData(getInitialFormData(entityType, enterpriseId));
//       setErrors({});
//     }
//   }, [entityType, enterpriseId, open]);

//   /* ------------------------------------------------------------------------ */
//   /*                               HANDLERS                                    */
//   /* ------------------------------------------------------------------------ */

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;

//     setFormData((prev) => ({ ...prev, [id]: value }));
//     setErrors((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleGenderChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       gender: value as PatientForm["gender"],
//     }));
//   };

//   /* ------------------------------------------------------------------------ */
//   /*                               VALIDATION                                  */
//   /* ------------------------------------------------------------------------ */

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.mobile_number.trim())
//       newErrors.mobile_number = "Mobile number is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";

//     if (
//       entityType === "doctor" &&
//       !(formData as DoctorForm).specialization?.trim()
//     ) {
//       newErrors.specialization = "Specialization is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ------------------------------------------------------------------------ */
//   /*                               SUBMIT                                      */
//   /* ------------------------------------------------------------------------ */

//   const handleSubmit = () => {
//     if (!validateForm()) return;

//     onSubmit(formData);
//     setOpen(false);
//   };

//   /* ------------------------------------------------------------------------ */
//   /*                              FORM UI                                      */
//   /* ------------------------------------------------------------------------ */

//   const renderError = (field: string) =>
//     errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>;

//   const renderFormFields = () =>
//     entityType === "patient" ? (
//       <>
//         <FormField
//           id="name"
//           label="Full Name"
//           value={formData.patientName}
//           onChange={handleChange}
//           error={errors.name}
//         />

//         <FormField
//           id="mobile_number"
//           label="Mobile Number"
//           value={formData.mobile_number}
//           onChange={handleChange}
//           error={errors.mobile_number}
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             id="age"
//             label="Age"
//             type="number"
//             value={(formData as PatientForm).age}
//             onChange={handleChange}
//           />

//           <div className="space-y-2">
//             <Label>Gender</Label>
//             <Select
//               value={(formData as PatientForm).gender}
//               onValueChange={handleGenderChange}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Male">Male</SelectItem>
//                 <SelectItem value="Female">Female</SelectItem>
//                 <SelectItem value="Other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <FormField
//           id="address"
//           label="Address"
//           value={formData.address}
//           onChange={handleChange}
//           error={errors.address}
//         />
//       </>
//     ) : (
//       <>
//         <FormField
//           id="name"
//           label="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           error={errors.name}
//         />

//         <FormField
//           id="mobile_number"
//           label="Mobile Number"
//           value={formData.mobile_number}
//           onChange={handleChange}
//           error={errors.mobile_number}
//         />

//         <FormField
//           id="specialization"
//           label="Specialization"
//           value={(formData as DoctorForm).specialization}
//           onChange={handleChange}
//           error={errors.specialization}
//         />

//         <FormField
//           id="hospital"
//           label="Hospital (Optional)"
//           value={(formData as DoctorForm).hospital || ""}
//           onChange={handleChange}
//         />

//         {/* <FormField
//           id="email"
//           label="Email (Optional)"
//           type="email"
//           value={(formData as DoctorForm).email || ""}
//           onChange={handleChange}
//         /> */}

//         <FormField
//           id="address"
//           label="Address"
//           value={formData.address}
//           onChange={handleChange}
//           error={errors.address}
//         />
//       </>
//     );

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>
//             Add New {entityType === "patient" ? "Patient" : "Doctor"}
//           </DialogTitle>
//           <DialogDescription>
//             Enter details for the new{" "}
//             {entityType === "patient" ? "patient" : "doctor"}.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">{renderFormFields()}</div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>
//             Add {entityType === "patient" ? "Patient" : "Doctor"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NewEntityModal;

// /* -------------------------------------------------------------------------- */
// /*                            REUSABLE FORM FIELD                              */
// /* -------------------------------------------------------------------------- */

// interface FormFieldProps {
//   id: string;
//   label: string;
//   value: string;
//   type?: string;
//   error?: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const FormField = ({
//   id,
//   label,
//   value,
//   type = "text",
//   error,
//   onChange,
// }: FormFieldProps) => (
//   <div className="space-y-2">
//     <Label htmlFor={id}>
//       {label} <span className="text-red-500">*</span>
//     </Label>
//     <Input id={id} type={type} value={value} onChange={onChange} />
//     {error && <p className="text-sm text-red-500">{error}</p>}
//   </div>
// );




import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type EntityType = "patient" | "doctor";

interface NewEntityModalProps {
  entityType: EntityType;
  open: boolean;
  enterpriseId: string;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

/* -------------------------------------------------------------------------- */
/*                             INITIAL FORM STATE                              */
/* -------------------------------------------------------------------------- */

const getInitialFormData = (
  entityType: EntityType,
  enterpriseId: string
) =>
  entityType === "patient"
    ? {
        enterpriseId,
        patientName: "",
        patientMobileNumber: "",
        patientAddress: "",
        age: "",
        gender: "Male",
      }
    : {
        enterpriseId,
        doctorName: "",
        doctorMobileNumber: "",
        doctorAddress: "",
        doctorSpecialization: "",
        doctorHospital: "",
      };

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

const NewEntityModal = ({
  entityType,
  open,
  enterpriseId,
  setOpen,
  onSubmit,
}: NewEntityModalProps) => {
  const [formData, setFormData] = useState<any>(
    getInitialFormData(entityType, enterpriseId)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* Reset form on open */
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(entityType, enterpriseId));
      setErrors({});
    }
  }, [entityType, enterpriseId, open]);

  /* ------------------------------------------------------------------------ */
  /*                               HANDLERS                                    */
  /* ------------------------------------------------------------------------ */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, gender: value }));
  };

  /* ------------------------------------------------------------------------ */
  /*                               VALIDATION                                  */
  /* ------------------------------------------------------------------------ */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (entityType === "patient") {
      if (!formData.patientName?.trim())
        newErrors.patientName = "Name is required";

      if (!formData.patientMobileNumber?.trim())
        newErrors.patientMobileNumber = "Mobile number is required";

      if (!formData.patientAddress?.trim())
        newErrors.patientAddress = "Address is required";
    }

    if (entityType === "doctor") {
      if (!formData.doctorName?.trim())
        newErrors.doctorName = "Name is required";

      if (!formData.doctorMobileNumber?.trim())
        newErrors.doctorMobileNumber = "Mobile number is required";

      if (!formData.doctorAddress?.trim())
        newErrors.doctorAddress = "Address is required";

      if (!formData.doctorSpecialization?.trim())
        newErrors.doctorSpecialization = "Specialization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------------------------------------------------------------ */
  /*                               SUBMIT                                      */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(formData);
    setOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /*                              FORM UI                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add New {entityType === "patient" ? "Patient" : "Doctor"}
          </DialogTitle>
          <DialogDescription>
            Enter details for the new{" "}
            {entityType === "patient" ? "patient" : "doctor"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {entityType === "patient" ? (
            <>
              <FormField
                id="patientName"
                label="Full Name"
                value={formData.patientName}
                onChange={handleChange}
                error={errors.patientName}
              />

              <FormField
                id="patientMobileNumber"
                label="Mobile Number"
                value={formData.patientMobileNumber}
                onChange={handleChange}
                error={errors.patientMobileNumber}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="age"
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                />

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <FormField
                id="patientAddress"
                label="Address"
                value={formData.patientAddress}
                onChange={handleChange}
                error={errors.patientAddress}
              />
            </>
          ) : (
            <>
              <FormField
                id="doctorName"
                label="Full Name"
                value={formData.doctorName}
                onChange={handleChange}
                error={errors.doctorName}
              />

              <FormField
                id="doctorMobileNumber"
                label="Mobile Number"
                value={formData.doctorMobileNumber}
                onChange={handleChange}
                error={errors.doctorMobileNumber}
              />

              <FormField
                id="doctorSpecialization"
                label="Specialization"
                value={formData.doctorSpecialization}
                onChange={handleChange}
                error={errors.doctorSpecialization}
              />

              <FormField
                id="doctorHospital"
                label="Hospital (Optional)"
                value={formData.doctorHospital}
                onChange={handleChange}
              />

              <FormField
                id="doctorAddress"
                label="Address"
                value={formData.doctorAddress}
                onChange={handleChange}
                error={errors.doctorAddress}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add {entityType === "patient" ? "Patient" : "Doctor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntityModal;

/* -------------------------------------------------------------------------- */
/*                            REUSABLE FORM FIELD                              */
/* -------------------------------------------------------------------------- */

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  type?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = ({
  id,
  label,
  value,
  type = "text",
  error,
  onChange,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} <span className="text-red-500">*</span>
    </Label>
    <Input id={id} type={type} value={value} onChange={onChange} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
