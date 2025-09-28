// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";

// import { X, User, Stethoscope } from "lucide-react";

// // Import components
// import { Card } from "@/components/ui/card";
// import BillItemsTable from "./components/BillItemsTable";
// import Instructions from "./components/Instructions";
// import BillSummary from "./components/BillSummary";
// import MedicineSearch from "./components/MedicineSearch";
// import NewDoctorModal from "./components/NewDoctorModal";
// import NewPatientModal from "./components/NewPatientModal";
// import PatientSelectionModal from "./components/PatientSelectionModal";
// import DoctorSelectionModal from "./components/DoctorSelectionModal";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   createDoctor,
//   createNewBill,
//   createPatient,
//   getAllInventories,
//   searchDoctors,
//   searchPatients,
// } from "@/services/new-sale-entry";

// // TypeScript interfaces
// export interface Patient {
//   id: number;
//   name: string;
//   phone: string;
//   address?: string;
//   age: number;
//   gender: string;
// }

// export interface Doctor {
//   id: number;
//   name: string;
//   specialization: string;
//   contact: string;
// }

// export interface Product {
//   _id: string;
//   item: string;
//   cgst: string;
//   sgst: string;
//   buyingPrice: number;
//   sellingPrice: number;
//   status: string;
//   expiryDate: string;
//   vendorId: string;
//   billNumber: string;
//   gstPercent: number;
//   buyingDate: string;
//   availableQuantity: number;
// }

// export interface BillItem {
//   // product: Product;
//   quantity: number;
//   discount: number;
//   total: number;
// }

// export interface SaleData {
//   patient: Patient | null;
//   doctor: Doctor | null;
//   billItems: BillItem[];
//   paymentStatus: string;
//   paymentMode: string;
//   subtotal: number;
//   totalTax: number;
//   grandTotal: number;
//   billNumber?: string;
//   date: string;
// }

// const NewSaleEntryView = ({ enterpriseId }: { enterpriseId: string }) => {
//   // Refs for focus management
//   const medicineSearchRef = useRef<HTMLInputElement>(null);

//   // State management
//   // const [patients, setPatients] = useState<Patient[]>(initialPatients);
//   // const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);

//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [billItems, setBillItems] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [paymentMode, setPaymentMode] = useState<string>("cash");
//   const [paymentStatus, setPaymentStatus] = useState<string>("unpaid");
//   const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
//   const [showInstructions, setShowInstructions] = useState<boolean>(false);

//   // Modal states
//   const [patientModalOpen, setPatientModalOpen] = useState<boolean>(false);
//   const [doctorModalOpen, setDoctorModalOpen] = useState<boolean>(false);
//   const [newPatientModalOpen, setNewPatientModalOpen] =
//     useState<boolean>(false);
//   const [newDoctorModalOpen, setNewDoctorModalOpen] = useState<boolean>(false);

//   // Form states
//   const [newPatientName, setNewPatientName] = useState<string>("");
//   const [newPatientPhone, setNewPatientPhone] = useState<string>("");
//   const [newPatientAge, setNewPatientAge] = useState<string>("");
//   const [newPatientGender, setNewPatientGender] = useState<string>("Male");
//   const [newDoctorName, setNewDoctorName] = useState<string>("");
//   const [newDoctorSpecialization, setNewDoctorSpecialization] =
//     useState<string>("");
//   const [newDoctorContact, setNewDoctorContact] = useState<string>("");

//   // Calculate totals
//   const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
//   const totalTax = billItems.reduce((sum, item) => {
//     const taxAmount = (item.total * item.taxRate || 0) / 100;
//     return sum + taxAmount;
//   }, 0);
//   const grandTotal = subtotal + totalTax;

//   const { data: inventories = [] } = useQuery({
//     queryKey: ["Inventory-for-bill", enterpriseId],
//     queryFn: () => getAllInventories({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   const { data: patients = [] } = useQuery({
//     queryKey: ["patients", enterpriseId],
//     queryFn: () => searchPatients({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   const { data: doctors = [] } = useQuery({
//     queryKey: ["doctors", enterpriseId],
//     queryFn: () => searchDoctors({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   console.log("inventories-->", patients);

//   // Filter products based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredProducts([]);
//       setHighlightedIndex(-1);
//     } else {
//       const filtered = inventories.filter(
//         (product: Product) =>
//           product.item.toLowerCase().includes(searchTerm.toLowerCase())
//         // ||   product?.saltComposition
//         //     .toLowerCase()
//         //     .includes(searchTerm.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//       setHighlightedIndex(0);
//     }
//   }, [searchTerm, inventories]);

//   // Focus on medicine search field on component mount
//   useEffect(() => {
//     if (medicineSearchRef.current) {
//       medicineSearchRef.current.focus();
//     }
//   }, []);

//   // Handle keyboard navigation in search results
//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (filteredProducts.length === 0) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setHighlightedIndex((prev) =>
//           prev < filteredProducts.length - 1 ? prev + 1 : prev
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (
//           highlightedIndex >= 0 &&
//           highlightedIndex < filteredProducts.length
//         ) {
//           addProductToBill(filteredProducts[highlightedIndex]);
//         }
//         break;
//       case "Escape":
//         setFilteredProducts([]);
//         setHighlightedIndex(-1);
//         break;
//     }
//   };

//   // Add product to bill (new items added to top)
//   const addProductToBill = (product: Product) => {
//     const existingItemIndex = billItems.findIndex(
//       (item: any) => item._id === product._id
//     );

//     if (existingItemIndex >= 0) {
//       // Increase quantity if product already exists in bill
//       const updatedItems = [...billItems];
//       const existingItem = updatedItems[existingItemIndex];
//       updatedItems[existingItemIndex] = {
//         ...existingItem,
//         quantity: existingItem.quantity + 1,
//         total:
//           (existingItem.quantity + 1) *
//           (existingItem.sellingPrice - existingItem.discount),
//       };
//       // setBillItems(updatedItems);
//     } else {
//       // Add new product to the top of the bill
//       setBillItems([
//         {
//           ...product,
//           quantity: 1,
//           discount: 0,
//           total: Number(product?.sellingPrice),
//         },
//         ...billItems,
//       ]);
//     }

//     setSearchTerm("");
//     setFilteredProducts([]);
//     setHighlightedIndex(-1);

//     // Refocus on medicine search after adding product
//     setTimeout(() => {
//       if (medicineSearchRef.current) {
//         medicineSearchRef.current.focus();
//       }
//     }, 100);
//   };

//   // Update item quantity with validation
//   const updateQuantity = (productId: number, newQuantity: string) => {
//     if (isNaN(Number(newQuantity))) return;
//     const product = inventories?.find((p: any) => p._id === productId);

//     console.log("update", { productId, newQuantity, product });
//     if (product && Number(newQuantity) > product.availableQuantity) {
//       alert(`Cannot exceed available stock of ${product.availableQuantity}`);
//       return;
//     }

//     const updatedItems = billItems.map((item: any) =>
//       item._id === productId
//         ? {
//             ...item,
//             quantity: Number(newQuantity),
//             total: Number(newQuantity) * (item.sellingPrice - item.discount),
//           }
//         : item
//     );
//     setBillItems(updatedItems);
//   };

//   // Update item discount with validation
//   const updateDiscount = (productId: number, newDiscount: string) => {
//     if (isNaN(Number(newDiscount))) return;

//     const product = inventories.find((p: any) => p.id === productId);
//     if (product && Number(newDiscount) > product.sellingPrice) {
//       alert(`Discount cannot exceed product price of ₹${product.sellingPrice}`);
//       return;
//     }

//     const updatedItems = billItems.map((item: any) =>
//       item._id === productId
//         ? {
//             ...item,
//             discount: Number(newDiscount),
//             total: item.quantity * (item.sellingPrice - Number(newDiscount)),
//           }
//         : item
//     );
//     setBillItems(updatedItems);
//   };

//   // Remove item from bill
//   const removeItem = (productId: number) => {
//     setBillItems(billItems.filter((item: any) => item._id !== productId));
//   };

//   // Reset form
//   const resetForm = () => {
//     setSelectedPatient(null);
//     setSelectedDoctor(null);
//     setBillItems([]);
//     setPaymentMode("cash");
//     setPaymentStatus("unpaid");

//     // Focus back on medicine search
//     setTimeout(() => {
//       if (medicineSearchRef.current) {
//         medicineSearchRef.current.focus();
//       }
//     }, 100);
//   };

//   // Collect all sale data
//   const collectSaleData = (patientResponse: any): SaleData => {
//     // const billNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
//     const date = new Date();

//     return {
//       enterpriseId: enterpriseId,
//       patient: patientResponse,
//       doctor: selectedDoctor,
//       items: billItems,
//       status: paymentStatus,
//       paymentMode,
//       subtotal,
//       totalTax,
//       grandTotal,
//       // billNumber,
//       date,
//     };
//   };

//   // Complete sale
//   const completeSale = () => {
//     if (billItems.length === 0) {
//       alert("Please add at least one medicine to the bill");
//       return;
//     }

//     createNewPatient(selectedPatient);
//   };

//   // Add new patient
//   const addNewPatient = () => {
//     if (newPatientName && newPatientPhone && newPatientAge) {
//       const newPatient: Patient = {
//         id: Math.max(...patients?.map((p) => p.id)) + 1,
//         name: newPatientName,
//         phone: newPatientPhone,
//         age: parseInt(newPatientAge),
//         gender: newPatientGender,
//       };
//       // setPatients([...patients, newPatient]);
//       setSelectedPatient(newPatient);
//       setNewPatientName("");
//       setNewPatientPhone("");
//       setNewPatientAge("");
//       setNewPatientGender("Male");
//       setNewPatientModalOpen(false);
//     }
//   };

//   // Add new doctor
//   const addNewDoctor = () => {
//     if (newDoctorName && newDoctorSpecialization) {
//       const newDoctor: Doctor = {
//         id: Math.max(...doctors.map((d: any) => d.id)) + 1,
//         name: newDoctorName,
//         specialization: newDoctorSpecialization,
//         contact: newDoctorContact,
//       };

//       createNewDoctor({
//         enterpriseId,
//         name: newDoctorName ?? "",
//         specialization: newDoctorSpecialization ?? "",
//         mobile_number: newDoctorContact ?? "",
//         hospital: "",
//         address: "",
//       });
//       // setDoctors([...doctors, newDoctor]);
//       setSelectedDoctor(newDoctor);
//       setNewDoctorName("");
//       setNewDoctorSpecialization("");
//       setNewDoctorContact("");
//       setNewDoctorModalOpen(false);
//     }
//   };

//   const { mutate: createNewDoctor } = useMutation({
//     mutationFn: createDoctor,
//     onSuccess: (data) => {
//       console.log("doctor created.");
//     },
//     onError: (error) => {
//       console.log(error);
//     },
//   });

//   const { mutate: createNewPatient } = useMutation({
//     mutationFn: createPatient,
//     onSuccess: (data: any) => {
//       const patientResponse = data.result;
//       console.log("success", patientResponse);

//       createNewDoctor({
//         enterpriseId,
//         name: selectedDoctor?.name ?? "",
//         specialization: selectedDoctor?.specialization ?? "",
//         mobile_number: selectedDoctor?.contact ?? "",
//         hospital: "",
//         address: "",
//       });

//       // Collect all data
//       const saleData = collectSaleData(patientResponse);

//       // In a real application, you would send this data to your backend
//       console.log("Sale Data:", saleData);
//       createBill(saleData);
//       resetForm();
//     },
//     onError: (e) => console.log(`Error creating patient: ${e.message}`),
//   });

//   const { mutate: createBill } = useMutation({
//     mutationFn: createNewBill,
//     onSuccess: (data) => {
//       console.log(data);
//     },
//   });

//   return (
//     <div className="h-full p-4 flex flex-col">
//       <div>
//         <h1 className="text-2xl font-bold">Medical Store Sale Entry</h1>
//       </div>

//       <Card className="p-0 overflow-hidden w-full mt-4 flex-grow flex flex-col">
//         {/* Instructions Section */}
//         <Instructions
//           showInstructions={showInstructions}
//           setShowInstructions={setShowInstructions}
//         />

//         {/* Main Content */}
//         <div className="flex flex-col md:flex-row w-full flex-grow">
//           {/* Left Panel - Product Entry */}
//           <div className="flex-1 p-6 border-r border-gray-200 flex flex-col">
//             {/* Patient and Doctor Selection Buttons */}
//             <div className="flex gap-6 mb-6">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-5">
//                   {selectedPatient && (
//                     <p className="text-blue-700 font-medium">
//                       {selectedPatient.name}
//                     </p>
//                   )}
//                   <Button
//                     onClick={() => setPatientModalOpen(true)}
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-2"
//                   >
//                     <User className="h-4 w-4" />
//                     {selectedPatient ? "Change Patient" : "Select Patient"}
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center gap-5">
//                   {selectedDoctor && (
//                     <p className="text-green-700 font-medium">
//                       {selectedDoctor.name}
//                     </p>
//                   )}
//                   <Button
//                     onClick={() => setDoctorModalOpen(true)}
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-2"
//                   >
//                     <Stethoscope className="h-4 w-4" />
//                     {selectedDoctor ? "Change Doctor" : "Select Doctor"}
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Product Search */}
//             <MedicineSearch
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               filteredProducts={filteredProducts}
//               highlightedIndex={highlightedIndex}
//               handleSearchKeyDown={handleSearchKeyDown}
//               addProductToBill={addProductToBill}
//               medicineSearchRef={medicineSearchRef}
//             />

//             {/* Bill Items Table */}
//             <BillItemsTable
//               billItems={billItems}
//               updateQuantity={updateQuantity}
//               updateDiscount={updateDiscount}
//               removeItem={removeItem}
//             />
//           </div>

//           {/* Right Panel - Summary */}
//           <BillSummary
//             subtotal={subtotal}
//             totalTax={totalTax}
//             grandTotal={grandTotal}
//             paymentStatus={paymentStatus}
//             setPaymentStatus={setPaymentStatus}
//             paymentMode={paymentMode}
//             setPaymentMode={setPaymentMode}
//             resetForm={resetForm}
//             completeSale={completeSale}
//           />
//         </div>
//       </Card>

//       {/* Modals */}
//       <PatientSelectionModal
//         patientModalOpen={patientModalOpen}
//         setPatientModalOpen={setPatientModalOpen}
//         patients={patients || []}
//         selectedPatient={selectedPatient}
//         setSelectedPatient={setSelectedPatient}
//         setNewPatientModalOpen={setNewPatientModalOpen}
//       />

//       <DoctorSelectionModal
//         doctorModalOpen={doctorModalOpen}
//         setDoctorModalOpen={setDoctorModalOpen}
//         doctors={doctors}
//         selectedDoctor={selectedDoctor}
//         setSelectedDoctor={setSelectedDoctor}
//         setNewDoctorModalOpen={setNewDoctorModalOpen}
//       />

//       <NewPatientModal
//         newPatientModalOpen={newPatientModalOpen}
//         setNewPatientModalOpen={setNewPatientModalOpen}
//         newPatientName={newPatientName}
//         setNewPatientName={setNewPatientName}
//         newPatientPhone={newPatientPhone}
//         setNewPatientPhone={setNewPatientPhone}
//         newPatientAge={newPatientAge}
//         setNewPatientAge={setNewPatientAge}
//         newPatientGender={newPatientGender}
//         setNewPatientGender={setNewPatientGender}
//         addNewPatient={addNewPatient}
//       />

//       <NewDoctorModal
//         newDoctorModalOpen={newDoctorModalOpen}
//         setNewDoctorModalOpen={setNewDoctorModalOpen}
//         newDoctorName={newDoctorName}
//         setNewDoctorName={setNewDoctorName}
//         newDoctorSpecialization={newDoctorSpecialization}
//         setNewDoctorSpecialization={setNewDoctorSpecialization}
//         newDoctorContact={newDoctorContact}
//         setNewDoctorContact={setNewDoctorContact}
//         addNewDoctor={addNewDoctor}
//       />
//     </div>
//   );
// };

// export default NewSaleEntryView;

// "use client";

// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { User, Stethoscope } from "lucide-react";

// // Components
// import { Card } from "@/components/ui/card";
// import BillItemsTable from "./components/BillItemsTable";
// import Instructions from "./components/Instructions";
// import BillSummary from "./components/BillSummary";
// import MedicineSearch from "./components/MedicineSearch";
// import NewDoctorModal from "./components/NewDoctorModal";
// import NewPatientModal from "./components/NewPatientModal";
// import PatientSelectionModal from "./components/PatientSelectionModal";
// import DoctorSelectionModal from "./components/DoctorSelectionModal";

// // React Query
// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   createDoctor,
//   createNewBill,
//   createPatient,
//   getAllInventories,
//   searchDoctors,
//   searchPatients,
// } from "@/services/new-sale-entry";

// // Interfaces
// import type {
//   Patient,
//   Doctor,
//   Product,
//   BillItem,
//   SaleData,
// } from "../../../types/new-sale-entry";

// const NewSaleEntryView = ({ enterpriseId }: { enterpriseId: string }) => {
//   const medicineSearchRef = useRef<HTMLInputElement>(null);

//   // Core state
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
//   const [billItems, setBillItems] = useState<any[]>([]);

//   // Search state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);

//   // UI state
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [modals, setModals] = useState({
//     patient: false,
//     doctor: false,
//     newPatient: false,
//     newDoctor: false,
//   });

//   // Form state for new patient/doctor
//   const [newPatient, setNewPatient] = useState({
//     name: "",
//     phone: "",
//     age: "",
//     gender: "Male",
//   });
//   const [newDoctor, setNewDoctor] = useState({
//     name: "",
//     specialization: "",
//     contact: "",
//   });

//   const [payment, setPayment] = useState({
//     mode: "cash",
//     status: "unpaid",
//   });

//   // Queries
//   const { data: inventories = [] } = useQuery({
//     queryKey: ["inventories", enterpriseId],
//     queryFn: () => getAllInventories({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   const { data: patients = [] } = useQuery({
//     queryKey: ["patients", enterpriseId],
//     queryFn: () => searchPatients({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   const { data: doctors = [] } = useQuery({
//     queryKey: ["doctors", enterpriseId],
//     queryFn: () => searchDoctors({ enterpriseId }),
//     enabled: !!enterpriseId,
//     select: (data) => data?.result || [],
//   });

//   // Mutations
//   const { mutate: createDoctorMutation } = useMutation({
//     mutationFn: createDoctor,
//     onSuccess: () => console.log("Doctor created"),
//     onError: (err) => console.error(err),
//   });

//   const { mutate: createPatientMutation } = useMutation({
//     mutationFn: createPatient,
//     onSuccess: (data: any) => {
//       const patientResponse = data.result;
//       const saleData = collectSaleData(patientResponse);
//       createBillMutation(saleData);
//       resetForm();
//     },
//     onError: (e: any) => console.error(`Error creating patient: ${e.message}`),
//   });

//   const { mutate: createBillMutation } = useMutation({
//     mutationFn: createNewBill,
//     onSuccess: (data) => console.log("Bill created:", data),
//   });

//   // Derived totals
//   const subtotal = useMemo(
//     () => billItems.reduce((sum, item) => sum + item.total, 0),
//     [billItems]
//   );

//   const totalTax = useMemo(
//     () =>
//       billItems.reduce(
//         (sum, item) => sum + (item.total * (item.taxRate || 0)) / 100,
//         0
//       ),
//     [billItems]
//   );

//   const grandTotal = useMemo(() => subtotal + totalTax, [subtotal, totalTax]);

//   // Product search filter
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredProducts([]);
//       setHighlightedIndex(-1);
//       return;
//     }
//     const filtered = inventories.filter((p: Product) =>
//       p.item.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//     setHighlightedIndex(0);
//   }, [searchTerm, inventories]);

//   // Focus on mount
//   useEffect(() => {
//     medicineSearchRef.current?.focus();
//   }, []);

//   // Handlers
//   const addProductToBill = useCallback(
//     (product: Product) => {
//       const existingIndex = billItems.findIndex(
//         (i: any) => i._id === product._id
//       );

//       if (existingIndex >= 0) {
//         const updated = [...billItems];
//         const existing = updated[existingIndex];
//         updated[existingIndex] = {
//           ...existing,
//           quantity: existing.quantity + 1,
//           total:
//             (existing.quantity + 1) *
//             (existing.sellingPrice - existing.discount),
//         };
//         setBillItems(updated);
//       } else {
//         setBillItems([
//           {
//             ...product,
//             quantity: 1,
//             discount: 0,
//             total: Number(product.sellingPrice),
//           },
//           ...billItems,
//         ]);
//       }

//       setSearchTerm("");
//       setFilteredProducts([]);
//       setHighlightedIndex(-1);
//       medicineSearchRef.current?.focus();
//     },
//     [billItems]
//   );

//   const updateQuantity = useCallback(
//     (productId: string, newQty: string) => {
//       if (isNaN(Number(newQty))) return;
//       const product = inventories.find((p: any) => p._id === productId);
//       if (product && Number(newQty) > product.availableQuantity) {
//         alert(`Stock limit: ${product.availableQuantity}`);
//         return;
//       }
//       setBillItems((items) =>
//         items.map((i: any) =>
//           i._id === productId
//             ? {
//                 ...i,
//                 quantity: Number(newQty),
//                 total: Number(newQty) * (i.sellingPrice - i.discount),
//               }
//             : i
//         )
//       );
//     },
//     [inventories]
//   );

//   const updateDiscount = useCallback(
//     (productId: string, newDiscount: string) => {
//       if (isNaN(Number(newDiscount))) return;
//       setBillItems((items) =>
//         items.map((i: any) =>
//           i._id === productId
//             ? {
//                 ...i,
//                 discount: Number(newDiscount),
//                 total: i.quantity * (i.sellingPrice - Number(newDiscount)),
//               }
//             : i
//         )
//       );
//     },
//     []
//   );

//   const removeItem = useCallback(
//     (productId: string) =>
//       setBillItems((items) => items.filter((i: any) => i._id !== productId)),
//     []
//   );

//   const resetForm = useCallback(() => {
//     setSelectedPatient(null);
//     setSelectedDoctor(null);
//     setBillItems([]);
//     setPayment({ mode: "cash", status: "unpaid" });
//     medicineSearchRef.current?.focus();
//   }, []);

//   const collectSaleData = (patientResponse: any): SaleData => ({
//     enterpriseId,
//     patient: patientResponse,
//     doctor: selectedDoctor,
//     items: billItems,
//     status: payment.status,
//     paymentMode: payment.mode,
//     subtotal,
//     totalTax,
//     grandTotal,
//     date: new Date(),
//   });

//   const completeSale = () => {
//     if (billItems.length === 0) {
//       alert("Add at least one medicine");
//       return;
//     }
//     createPatientMutation(selectedPatient);
//   };

//   return (
//     <div className="h-full p-4 flex flex-col">
//       <h1 className="text-2xl font-bold">Medical Store Sale Entry</h1>

//       <Card className="p-0 overflow-hidden w-full mt-4 flex-grow flex flex-col">
//         <Instructions
//           showInstructions={showInstructions}
//           setShowInstructions={setShowInstructions}
//         />

//         <div className="flex flex-col md:flex-row flex-grow">
//           {/* Left panel */}
//           <div className="flex-1 p-6 border-r flex flex-col">
//             {/* Patient & Doctor */}
//             <div className="flex gap-6 mb-6">
//               <div className="flex items-center gap-5">
//                 {selectedPatient && (
//                   <p className="text-blue-700 font-medium">
//                     {selectedPatient.name}
//                   </p>
//                 )}
//                 <Button
//                   onClick={() => setModals((m) => ({ ...m, patient: true }))}
//                   variant="outline"
//                   size="sm"
//                 >
//                   <User className="h-4 w-4" />
//                   {selectedPatient ? "Change Patient" : "Select Patient"}
//                 </Button>
//               </div>

//               <div className="flex items-center gap-5">
//                 {selectedDoctor && (
//                   <p className="text-green-700 font-medium">
//                     {selectedDoctor.name}
//                   </p>
//                 )}
//                 <Button
//                   onClick={() => setModals((m) => ({ ...m, doctor: true }))}
//                   variant="outline"
//                   size="sm"
//                 >
//                   <Stethoscope className="h-4 w-4" />
//                   {selectedDoctor ? "Change Doctor" : "Select Doctor"}
//                 </Button>
//               </div>
//             </div>

//             <MedicineSearch
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               filteredProducts={filteredProducts}
//               highlightedIndex={highlightedIndex}
//               addProductToBill={addProductToBill}
//               medicineSearchRef={medicineSearchRef}
//             />

//             <BillItemsTable
//               billItems={billItems}
//               updateQuantity={updateQuantity}
//               updateDiscount={updateDiscount}
//               removeItem={removeItem}
//             />
//           </div>

//           {/* Right panel */}
//           <BillSummary
//             subtotal={subtotal}
//             totalTax={totalTax}
//             grandTotal={grandTotal}
//             paymentStatus={payment.status}
//             setPaymentStatus={(s) => setPayment((p) => ({ ...p, status: s }))}
//             paymentMode={payment.mode}
//             setPaymentMode={(m) => setPayment((p) => ({ ...p, mode: m }))}
//             resetForm={resetForm}
//             completeSale={completeSale}
//           />
//         </div>
//       </Card>

//       {/* Modals */}
//       <PatientSelectionModal
//         patientModalOpen={modals.patient}
//         setPatientModalOpen={(v) => setModals((m) => ({ ...m, patient: v }))}
//         patients={patients}
//         selectedPatient={selectedPatient}
//         setSelectedPatient={setSelectedPatient}
//         setNewPatientModalOpen={(v) =>
//           setModals((m) => ({ ...m, newPatient: v }))
//         }
//       />

//       <DoctorSelectionModal
//         doctorModalOpen={modals.doctor}
//         setDoctorModalOpen={(v) => setModals((m) => ({ ...m, doctor: v }))}
//         doctors={doctors}
//         selectedDoctor={selectedDoctor}
//         setSelectedDoctor={setSelectedDoctor}
//         setNewDoctorModalOpen={(v) =>
//           setModals((m) => ({ ...m, newDoctor: v }))
//         }
//       />

//       <NewPatientModal
//         newPatientModalOpen={modals.newPatient}
//         setNewPatientModalOpen={(v) =>
//           setModals((m) => ({ ...m, newPatient: v }))
//         }
//         {...newPatient}
//         setNewPatient={setNewPatient}
//       />

//       <NewDoctorModal
//         newDoctorModalOpen={modals.newDoctor}
//         setNewDoctorModalOpen={(v) =>
//           setModals((m) => ({ ...m, newDoctor: v }))
//         }
//         {...newDoctor}
//         setNewDoctor={setNewDoctor}
//       />
//     </div>
//   );
// };

// export default NewSaleEntryView;

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import BillItemsTable from "./components/BillItemsTable";
import Instructions from "./components/Instructions";
import BillSummary from "./components/BillSummary";
import MedicineSearch from "./components/MedicineSearch";
import NewEntityModal from "./components/NewEntityModal";
import PatientSelectionModal from "./components/PatientSelectionModal";
import DoctorSelectionModal from "./components/DoctorSelectionModal";

// React Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctor,
  createNewBill,
  createPatient,
  getAllInventories,
  searchDoctors,
  searchPatients,
} from "@/services/new-sale-entry";

// Interfaces
import type {
  Patient,
  Doctor,
  Product,
  BillItem,
  SaleData,
} from "../../../types/new-sale-entry";

const NewSaleEntryView = ({ enterpriseId }: { enterpriseId: string }) => {
  const medicineSearchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Core state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [billItems, setBillItems] = useState<any[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [modals, setModals] = useState({
    patient: false,
    doctor: false,
    newPatient: false,
    newDoctor: false,
  });

  const [payment, setPayment] = useState({
    mode: "cash",
    status: "unpaid",
  });

  // Queries
  const { data: inventories = [] } = useQuery({
    queryKey: ["inventories", enterpriseId],
    queryFn: () => getAllInventories({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.result || [],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients", enterpriseId],
    queryFn: () => searchPatients({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.result || [],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors", enterpriseId],
    queryFn: () => searchDoctors({ enterpriseId }),
    enabled: !!enterpriseId,
    select: (data) => data?.doctors || [],
  });

  // Mutations
  const { mutate: createDoctorMutation } = useMutation({
    mutationFn: createDoctor,
    onSuccess: (newDoctor) => {
      queryClient.invalidateQueries({ queryKey: ["doctors", enterpriseId] });
      setSelectedDoctor(newDoctor?.doctor);
      setModals((m) => ({ ...m, newDoctor: false }));
    },
    onError: (err) => console.error(err),
  });

  const { mutate: createPatientMutation } = useMutation({
    mutationFn: createPatient,
    onSuccess: (data: any) => {
      const newPatientResponse = data.result;
      queryClient.invalidateQueries({ queryKey: ["patients", enterpriseId] });
      setSelectedPatient(newPatientResponse);
      setModals((m) => ({ ...m, newPatient: false }));
      console.log("Patient created and selected:", newPatientResponse);
    },
    onError: (e: any) => console.error(`Error creating patient: ${e.message}`),
  });

  const { mutate: createBillMutation } = useMutation({
    mutationFn: createNewBill,
    onSuccess: (data) => {
      console.log("Bill created:", data);
      resetForm();
    },
  });

  // Derived totals
  const subtotal = useMemo(
    () => billItems.reduce((sum, item) => sum + item.total, 0),
    [billItems]
  );

  const totalTax = useMemo(
    () =>
      billItems.reduce(
        (sum, item) => sum + (item.total * (item.taxRate || 0)) / 100,
        0
      ),
    [billItems]
  );

  const grandTotal = useMemo(() => subtotal + totalTax, [subtotal, totalTax]);

  // Product search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = inventories.filter((p: Product) =>
      p.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setHighlightedIndex(0);
  }, [searchTerm, inventories]);

  // Focus on mount
  useEffect(() => {
    medicineSearchRef.current?.focus();
  }, []);

  // Memoized handlers
  const addProductToBill = useCallback(
    (product: Product) => {
      const existingIndex = billItems.findIndex(
        (i: any) => i._id === product._id
      );

      if (existingIndex >= 0) {
        const updated = [...billItems];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
          total:
            (existing.quantity + 1) *
            (existing.sellingPrice - existing.discount),
        };
        setBillItems(updated);
      } else {
        setBillItems([
          {
            ...product,
            quantity: 1,
            discount: 0,
            total: Number(product.sellingPrice),
          },
          ...billItems,
        ]);
      }

      setSearchTerm("");
      setFilteredProducts([]);
      setHighlightedIndex(-1);
      medicineSearchRef.current?.focus();
    },
    [billItems]
  );

  const updateQuantity = useCallback(
    (productId: string, newQty: string) => {
      if (isNaN(Number(newQty))) return;
      const product = inventories.find((p: any) => p._id === productId);
      if (product && Number(newQty) > product.availableQuantity) {
        alert(`Stock limit: ${product.availableQuantity}`);
        return;
      }
      setBillItems((items) =>
        items.map((i: any) =>
          i._id === productId
            ? {
                ...i,
                quantity: Number(newQty),
                total: Number(newQty) * (i.sellingPrice - i.discount),
              }
            : i
        )
      );
    },
    [inventories]
  );

  const updateDiscount = useCallback(
    (productId: string, newDiscount: string) => {
      if (isNaN(Number(newDiscount))) return;
      setBillItems((items) =>
        items.map((i: any) =>
          i._id === productId
            ? {
                ...i,
                discount: Number(newDiscount),
                total: i.quantity * (i.sellingPrice - Number(newDiscount)),
              }
            : i
        )
      );
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) =>
      setBillItems((items) => items.filter((i: any) => i._id !== productId)),
    []
  );

  const resetForm = useCallback(() => {
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setBillItems([]);
    setPayment({ mode: "cash", status: "unpaid" });
    medicineSearchRef.current?.focus();
  }, []);

  const collectSaleData = useCallback(
    (patientResponse: any): SaleData => ({
      enterpriseId,
      patient: patientResponse,
      doctor: selectedDoctor,
      items: billItems,
      status: payment.status,
      paymentMethod: payment.mode,
      subtotal,
      totalTax,
      grandTotal,
      date: new Date(),
    }),
    [
      enterpriseId,
      selectedDoctor,
      billItems,
      payment,
      subtotal,
      totalTax,
      grandTotal,
    ]
  );

  const handleCompleteSale = useCallback(() => {
    if (billItems.length === 0) {
      alert("Add at least one medicine");
      return;
    }
    if (!selectedPatient) {
      alert("Please select a patient before completing the sale.");
      return;
    }
    const saleData = collectSaleData(selectedPatient);
    createBillMutation(saleData);
  }, [billItems, selectedPatient, collectSaleData, createBillMutation]);

  return (
    <div className="h-full p-4 flex flex-col">
      <h1 className="text-2xl font-bold">Medical Store Sale Entry</h1>

      <Card className="p-0 overflow-hidden w-full mt-4 flex-grow flex flex-col">
        <Instructions
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />

        <div className="flex flex-col md:flex-row flex-grow">
          {/* Left panel */}
          <div className="flex-1 p-6 border-r flex flex-col">
            {/* Patient & Doctor */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-5">
                {selectedPatient && (
                  <p className="text-blue-700 font-medium">
                    {selectedPatient.name}
                  </p>
                )}
                <Button
                  onClick={() => setModals((m) => ({ ...m, patient: true }))}
                  variant="outline"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  {selectedPatient ? "Change Patient" : "Select Patient"}
                </Button>
              </div>

              <div className="flex items-center gap-5">
                {selectedDoctor && (
                  <p className="text-green-700 font-medium">
                    {selectedDoctor.name}
                  </p>
                )}
                <Button
                  onClick={() => setModals((m) => ({ ...m, doctor: true }))}
                  variant="outline"
                  size="sm"
                >
                  <Stethoscope className="h-4 w-4" />
                  {selectedDoctor ? "Change Doctor" : "Select Doctor"}
                </Button>
              </div>
            </div>

            <MedicineSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredProducts={filteredProducts}
              highlightedIndex={highlightedIndex}
              addProductToBill={addProductToBill}
              medicineSearchRef={medicineSearchRef}
            />

            <BillItemsTable
              billItems={billItems}
              updateQuantity={updateQuantity}
              updateDiscount={updateDiscount}
              removeItem={removeItem}
            />
          </div>

          {/* Right panel */}
          <BillSummary
            subtotal={subtotal}
            totalTax={totalTax}
            grandTotal={grandTotal}
            paymentStatus={payment.status}
            setPaymentStatus={(s) => setPayment((p) => ({ ...p, status: s }))}
            paymentMode={payment.mode}
            setPaymentMode={(m) => setPayment((p) => ({ ...p, mode: m }))}
            resetForm={resetForm}
            completeSale={handleCompleteSale}
          />
        </div>
      </Card>

      {/* Modals */}
      <PatientSelectionModal
        patientModalOpen={modals.patient}
        setPatientModalOpen={(v) => setModals((m) => ({ ...m, patient: v }))}
        patients={patients}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        setNewPatientModalOpen={(v) =>
          setModals((m) => ({ ...m, newPatient: v }))
        }
      />

      <DoctorSelectionModal
        doctorModalOpen={modals.doctor}
        setDoctorModalOpen={(v) => setModals((m) => ({ ...m, doctor: v }))}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        setNewDoctorModalOpen={(v) =>
          setModals((m) => ({ ...m, newDoctor: v }))
        }
      />

      <NewEntityModal
        entityType="patient"
        open={modals.newPatient}
        setOpen={(v) => setModals((m) => ({ ...m, newPatient: v }))}
        onSubmit={createPatientMutation}
        enterpriseId={enterpriseId}
      />

      <NewEntityModal
        entityType="doctor"
        open={modals.newDoctor}
        setOpen={(v) => setModals((m) => ({ ...m, newDoctor: v }))}
        onSubmit={createDoctorMutation}
        enterpriseId={enterpriseId}
      />
    </div>
  );
};

export default NewSaleEntryView;
