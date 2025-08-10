// "use client";

// import { useState, useRef, useEffect, KeyboardEvent } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// interface Person {
//   _id?: string;
//   name: string;
//   mobile_number: string;
//   address: string;
// }

// interface Doctor {
//   _id?: string;
//   name: string;
//   hospital: string;
//   mobile_number: string;
//   specialization: string;
//   address: string;
// }

// interface StepPatientDoctorProps {
//   hasScheduleItems: boolean;
//   patientSearch: string;
//   doctorSearch: string;
//   patient: Person;
//   doctor: Doctor;
//   patients: Person[];
//   doctors: Doctor[];
//   setPatientSearch: (value: string) => void;
//   setDoctorSearch: (value: string) => void;
//   setPatient: (p: Person) => void;
//   setDoctor: (d: Doctor) => void;
// }

// export const StepPatientDoctor = ({
//   hasScheduleItems,
//   patientSearch,
//   doctorSearch,
//   patient,
//   doctor,
//   patients,
//   doctors,
//   setPatientSearch,
//   setDoctorSearch,
//   setPatient,
//   setDoctor,
// }: StepPatientDoctorProps) => {
//   const [open, setOpen] = useState({ patient: false, doctor: false });
//   const [highlight, setHighlight] = useState({ patient: -1, doctor: -1 });

//   const patientRef = useRef<HTMLInputElement>(null);
//   const doctorRef = useRef<HTMLInputElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen({ patient: false, doctor: false });
//         setHighlight({ patient: -1, doctor: -1 });
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleKeyDown = (
//     e: KeyboardEvent<HTMLInputElement>,
//     type: "patient" | "doctor",
//     data: any[],
//     selectFn: (val: any) => void
//   ) => {
//     if (!open[type]) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setHighlight((prev) => ({
//           ...prev,
//           [type]: (prev[type] + 1) % data.length,
//         }));
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setHighlight((prev) => ({
//           ...prev,
//           [type]: (prev[type] - 1 + data.length) % data.length,
//         }));
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (highlight[type] >= 0) {
//           selectFn(data[highlight[type]]);
//         }
//         break;
//       case "Escape":
//       case "Tab":
//         setOpen((prev) => ({ ...prev, [type]: false }));
//         break;
//     }
//   };

//   const handleSelect = (
//     selected: any,
//     type: "patient" | "doctor",
//     setSearch: (s: string) => void,
//     setPerson: (p: any) => void
//   ) => {
//     setPerson(selected);
//     setSearch(selected.name);
//     setOpen((prev) => ({ ...prev, [type]: false }));
//     setHighlight((prev) => ({ ...prev, [type]: -1 }));
//   };

//   const renderInputCard = (
//     type: "patient" | "doctor",
//     label: string,
//     placeholder: string,
//     searchValue: string,
//     setSearch: (v: string) => void,
//     data: any[],
//     person: any,
//     setPerson: (p: any) => void,
//     ref: React.RefObject<HTMLInputElement>
//   ) => (
//     <Card className="p-6 shadow-md border rounded-xl bg-white space-y-4">
//       <Label htmlFor={`${type}-search`} className="text-base font-semibold">
//         {label} Name
//       </Label>
//       <div className="relative" ref={dropdownRef}>
//         <div className="relative">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             id={`${type}-search`}
//             ref={ref}
//             value={searchValue}
//             onChange={(e) => setSearch(e.target.value)}
//             onFocus={() =>
//               setOpen((prev) => ({ ...prev, [type]: data.length > 0 }))
//             }
//             onKeyDown={(e) =>
//               handleKeyDown(e, type, data, (val) =>
//                 handleSelect(val, type, setSearch, setPerson)
//               )
//             }
//             placeholder={placeholder}
//             className="pl-10"
//           />
//         </div>
//         {open[type] && data.length > 0 && (
//           <div className="absolute z-50 w-full mt-2 bg-white shadow-lg rounded-md border border-gray-200">
//             <ScrollArea className="max-h-48 overflow-y-auto rounded-md">
//               {data.map((item, index) => (
//                 <div
//                   key={item._id}
//                   onClick={() => handleSelect(item, type, setSearch, setPerson)}
//                   onMouseEnter={() =>
//                     setHighlight((prev) => ({ ...prev, [type]: index }))
//                   }
//                   className={cn(
//                     "px-3 py-2.5 cursor-pointer flex justify-between items-center text-sm",
//                     highlight[type] === index ? "bg-blue-100" : "hover:bg-muted"
//                   )}
//                 >
//                   <span className="font-medium text-gray-800">{item.name}</span>
//                   <span className="text-xs text-gray-500">
//                     {item.mobile_number || item.mobile_number}
//                   </span>
//                 </div>
//               ))}
//             </ScrollArea>
//           </div>
//         )}
//       </div>

//       {/* Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {type === "patient" ? (
//           <>
//             <div>
//               <Label className="text-sm">Mobile Number</Label>
//               <Input
//                 type="text"
//                 value={person.mobile_number}
//                 onChange={(e) =>
//                   setPerson({ ...person, mobile_number: e.target.value })
//                 }
//                 placeholder="Enter mobile number"
//               />
//             </div>
//             <div>
//               <Label className="text-sm">Address</Label>
//               <Input
//                 type="text"
//                 value={person.address}
//                 onChange={(e) =>
//                   setPerson({ ...person, address: e.target.value })
//                 }
//                 placeholder="Enter address"
//               />
//             </div>
//           </>
//         ) : (
//           <>
//             <div>
//               <Label className="text-sm">Hospital</Label>
//               <Input
//                 value={person.hospital}
//                 onChange={(e) =>
//                   setPerson({ ...person, hospital: e.target.value })
//                 }
//                 placeholder="Enter hospital name"
//               />
//             </div>
//             <div>
//               <Label className="text-sm">Specialization</Label>
//               <Input
//                 value={person.specialization}
//                 onChange={(e) =>
//                   setPerson({ ...person, specialization: e.target.value })
//                 }
//                 placeholder="Enter specialization"
//               />
//             </div>
//             <div>
//               <Label className="text-sm">Mobile Number</Label>
//               <Input
//                 value={person.mobile_number}
//                 onChange={(e) =>
//                   setPerson({ ...person, mobile_number: e.target.value })
//                 }
//                 placeholder="Enter mobile number"
//               />
//             </div>
//             <div>
//               <Label className="text-sm">Address</Label>
//               <Input
//                 value={person.address}
//                 onChange={(e) =>
//                   setPerson({ ...person, address: e.target.value })
//                 }
//                 placeholder="Enter address"
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </Card>
//   );

//   return (
//     <div className="space-y-8 p-6">
//       <h2 className="text-xl font-semibold text-gray-900">
//         {hasScheduleItems
//           ? "Patient & Doctor Details (Required)"
//           : "Patient & Doctor Details (Optional)"}
//       </h2>
//       <div className="grid md:grid-cols-2 gap-8">
//         {renderInputCard(
//           "patient",
//           "Patient",
//           "Search patient name...",
//           patientSearch,
//           setPatientSearch,
//           patients,
//           patient,
//           setPatient,
//           patientRef
//         )}
//         {renderInputCard(
//           "doctor",
//           "Doctor",
//           "Search doctor name...",
//           doctorSearch,
//           setDoctorSearch,
//           doctors,
//           doctor,
//           setDoctor,
//           doctorRef
//         )}
//       </div>
//     </div>
//   );
// };

"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Person {
  _id?: string;
  name: string;
  mobile_number: string;
  address: string;
}

interface Doctor {
  _id?: string;
  name: string;
  hospital: string;
  mobile_number: string;
  specialization: string;
  address: string;
}

interface StepPatientDoctorProps {
  hasScheduleItems: boolean;
  patientSearch: string;
  doctorSearch: string;
  patient: Person;
  doctor: Doctor;
  patients: Person[];
  doctors: Doctor[];
  setPatientSearch: (value: string) => void;
  setDoctorSearch: (value: string) => void;
  setPatient: (p: Person) => void;
  setDoctor: (d: Doctor) => void;
}

export const StepPatientDoctor = ({
  hasScheduleItems,
  patientSearch,
  doctorSearch,
  patient,
  doctor,
  patients,
  doctors,
  setPatientSearch,
  setDoctorSearch,
  setPatient,
  setDoctor,
}: StepPatientDoctorProps) => {
  const [open, setOpen] = useState({ patient: false, doctor: false });
  const [highlight, setHighlight] = useState({ patient: -1, doctor: -1 });

  const patientRef = useRef<HTMLInputElement>(null);
  const doctorRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen({ patient: false, doctor: false });
        setHighlight({ patient: -1, doctor: -1 });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    type: "patient" | "doctor",
    data: any[],
    selectFn: (val: any) => void,
    searchValue: string
  ) => {
    if (!open[type]) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlight((prev) => ({
          ...prev,
          [type]: (prev[type] + 1) % data.length,
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((prev) => ({
          ...prev,
          [type]: (prev[type] - 1 + data.length) % data.length,
        }));
        break;
      case "Enter":
        e.preventDefault();
        if (highlight[type] >= 0 && data.length > 0) {
          selectFn(data[highlight[type]]);
        } else {
          const newEntry =
            type === "patient"
              ? { name: searchValue, mobile_number: "", address: "" }
              : {
                  name: searchValue,
                  hospital: "",
                  specialization: "",
                  mobile_number: "",
                  address: "",
                };
          selectFn(newEntry);
        }
        break;
      case "Escape":
      case "Tab":
        setOpen((prev) => ({ ...prev, [type]: false }));
        break;
    }
  };

  const handleSelect = (
    selected: any,
    type: "patient" | "doctor",
    setSearch: (s: string) => void,
    setPerson: (p: any) => void
  ) => {
    setPerson(selected);
    setSearch(selected.name);
    setOpen((prev) => ({ ...prev, [type]: false }));
    setHighlight((prev) => ({ ...prev, [type]: -1 }));
  };

  const renderInputCard = (
    type: "patient" | "doctor",
    label: string,
    placeholder: string,
    searchValue: string,
    setSearch: (v: string) => void,
    data: any[],
    person: any,
    setPerson: (p: any) => void,
    ref: React.RefObject<HTMLInputElement | null>
  ) => (
    <Card className="p-6 shadow-md border rounded-xl bg-white space-y-4">
      <Label htmlFor={`${type}-search`} className="text-base font-semibold">
        {label} Name
      </Label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id={`${type}-search`}
            ref={ref}
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() =>
              setOpen((prev) => ({ ...prev, [type]: data.length > 0 }))
            }
            onKeyDown={(e) =>
              handleKeyDown(
                e,
                type,
                data,
                (val) => handleSelect(val, type, setSearch, setPerson),
                searchValue
              )
            }
            onBlur={() => {
              if (!person.name || person.name !== searchValue) {
                const newEntry =
                  type === "patient"
                    ? { name: searchValue, mobile_number: "", address: "" }
                    : {
                        name: searchValue,
                        hospital: "",
                        specialization: "",
                        mobile_number: "",
                        address: "",
                      };
                setPerson(newEntry);
              }
              setOpen((prev) => ({ ...prev, [type]: false }));
            }}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        {open[type] && (
          <div className="absolute z-50 w-full mt-2 bg-white shadow-lg rounded-md border border-gray-200">
            <ScrollArea className="max-h-48 overflow-y-auto rounded-md">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <div
                    key={item._id || index}
                    onClick={() =>
                      handleSelect(item, type, setSearch, setPerson)
                    }
                    onMouseEnter={() =>
                      setHighlight((prev) => ({ ...prev, [type]: index }))
                    }
                    className={cn(
                      "px-3 py-2.5 cursor-pointer flex justify-between items-center text-sm",
                      highlight[type] === index
                        ? "bg-blue-100"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.mobile_number || ""}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No matches found
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {type === "patient" ? (
          <>
            <div>
              <Label className="text-sm">Mobile Number</Label>
              <Input
                type="text"
                value={person.mobile_number}
                onChange={(e) =>
                  setPerson({ ...person, mobile_number: e.target.value })
                }
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <Label className="text-sm">Address</Label>
              <Input
                type="text"
                value={person.address}
                onChange={(e) =>
                  setPerson({ ...person, address: e.target.value })
                }
                placeholder="Enter address"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label className="text-sm">Hospital</Label>
              <Input
                value={person.hospital}
                onChange={(e) =>
                  setPerson({ ...person, hospital: e.target.value })
                }
                placeholder="Enter hospital name"
              />
            </div>
            <div>
              <Label className="text-sm">Specialization</Label>
              <Input
                value={person.specialization}
                onChange={(e) =>
                  setPerson({ ...person, specialization: e.target.value })
                }
                placeholder="Enter specialization"
              />
            </div>
            <div>
              <Label className="text-sm">Mobile Number</Label>
              <Input
                value={person.mobile_number}
                onChange={(e) =>
                  setPerson({ ...person, mobile_number: e.target.value })
                }
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <Label className="text-sm">Address</Label>
              <Input
                value={person.address}
                onChange={(e) =>
                  setPerson({ ...person, address: e.target.value })
                }
                placeholder="Enter address"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {hasScheduleItems
          ? "Patient & Doctor Details (Required)"
          : "Patient & Doctor Details (Optional)"}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {renderInputCard(
          "patient",
          "Patient",
          "Search patient name...",
          patientSearch,
          setPatientSearch,
          patients,
          patient,
          setPatient,
          patientRef
        )}
        {renderInputCard(
          "doctor",
          "Doctor",
          "Search doctor name...",
          doctorSearch,
          setDoctorSearch,
          doctors,
          doctor,
          setDoctor,
          doctorRef
        )}
      </div>
    </div>
  );
};
