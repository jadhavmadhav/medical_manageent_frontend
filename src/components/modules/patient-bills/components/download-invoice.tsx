// // download-invoice.tsx
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { getInvoiceDetails } from "@/services/patient-bills";
// import { dateFormatter } from "@/utils/constants";
// import { useEffect, useState, useCallback, memo } from "react";
// import html2canvas from "html2canvas-pro";
// import jsPDF from "jspdf";
// import { Loader2, Download } from "lucide-react";
// import { Patient, Product } from "@/types/new-sale-entry";

// // === Types ===
// interface Item {
//   item: string;
//   quantity: number;
//   sellingPrice: number;
//   cgst: number;
//   sgst: number;
//   locker?: string;
// }

// interface Bill {
//   _id: string;
//   customerName: string;
//   customerAddress: string;
//   mobileNumber: string;
//   date: string;
//   discountAmount: number;
//   totalAmount: number;
//   items: Product[];
//   patient?: Patient
// }

// interface Enterprise {
//   name: string;
//   address: string;
//   mobileNumber: string;
//   email: string;
// }

// interface InvoiceDetails {
//   bill: Bill;
//   enterprise: Enterprise;
// }

// interface DownloadInvoiceProps {
//   id: string;
//   open?: boolean;
//   close?: () => void;
//   children?: React.ReactNode;
// }

// // Memoized table row component
// const InvoiceTableRow = memo(({ item, index }: { item: Product; index: number }) => {
//   const total = Number(item?.quantity || 0) * item.sellingPrice;
//   const gstPercent = (Number(item.cgst) || 0) + (Number(item.sgst) || 0);

//   return (
//     <tr className="">
//       <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
//       <td className="border border-gray-300 px-4 py-3">{item.name}</td>
//       <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity} {item.unit?.baseUnit}</td>
//       <td className="border border-gray-300 px-4 py-3 text-right">₹{item.sellingPrice.toFixed(2)}</td>
//       <td className="border border-gray-300 px-4 py-3 text-center">{gstPercent}%</td>
//       <td className="border border-gray-300 px-4 py-3 text-right font-medium">₹{total.toFixed(2)}</td>
//     </tr>
//   );
// });

// InvoiceTableRow.displayName = "InvoiceTableRow";

// export const DownloadInvoice = memo(({ id, open, close, children }: DownloadInvoiceProps) => {
//   const [billDetails, setBillDetails] = useState<InvoiceDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const fetchInvoice = useCallback(async () => {
//     if (!id) return;

//     setIsLoading(true);
//     try {
//       const response = await getInvoiceDetails(id);
//       setBillDetails(response?.result || null);
//     } catch (error) {
//       console.error("Failed to fetch invoice:", error);
//       setBillDetails(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (open) {
//       fetchInvoice();
//     } else {
//       setBillDetails(null);
//     }
//   }, [open, fetchInvoice]);

//   const handleDownloadPDF = useCallback(async () => {
//     if (!billDetails) return;

//     setIsDownloading(true);

//     // Wait for DOM to render
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const element = document.getElementById("print-area");
//     if (!element) {
//       alert("Invoice content not ready. Please try again.");
//       setIsDownloading(false);
//       return;
//     }

//     try {
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         windowWidth: element.scrollWidth + 100,
//         scrollY: -window.scrollY,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pdfWidth;
//       const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pdfHeight;
//       }

//       pdf.save(`Invoice_${billDetails.bill._id}.pdf`);
//     } catch (err) {
//       console.error("PDF generation failed:", err);
//       alert("Failed to generate PDF. Please try again.");
//     } finally {
//       setIsDownloading(false);
//     }
//   }, [billDetails]);

 

//   return (
//     <AlertDialog open={open} onOpenChange={close}>
//       <AlertDialogContent
//         className="min-w-[90vw] max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white text-black dark:bg-white dark:text-black"
//       >

//         <AlertDialogHeader className="p-6 border-b shrink-0">
//           <AlertDialogTitle className="text-2xl font-bold ">
//             Invoice Preview
//           </AlertDialogTitle>
//         </AlertDialogHeader>

//         <div className="flex-1 overflow-auto ">
//           <div id="print-area" className="p-10">
//             {isLoading && (
//               <div className="flex flex-col items-center justify-center h-96">
//                 <Loader2 className="w-10 h-10 animate-spin" />
//                 <p className="mt-4 text-lg">Loading invoice details...</p>
//               </div>
//             )}

//             {!isLoading && billDetails && (
//               <>
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-8 border-b pb-6">
//                   <div>
//                     <h1 className="text-3xl font-bold">
//                       {billDetails.enterprise.name}
//                     </h1>
//                     <p className="text-sm text-muted-foreground mt-2">
//                       {billDetails.enterprise.address}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Email: {billDetails.enterprise.email} | Phone:{" "}
//                       {billDetails.enterprise.mobileNumber}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <h2 className="text-4xl font-bold ">INVOICE</h2>
//                     <p className="text-sm mt-3">
//                       <span className="font-semibold text-muted-foreground">Invoice #:</span>
//                       <span className="text-muted-foreground font-normal"> {billDetails.bill._id}
//                       </span>
//                     </p>
//                     <p className="text-sm">
//                       <span className="font-semibold text-muted-foreground">Date:</span>{" "}

//                       <span className="text-muted-foreground font-normal">

//                         {dateFormatter(billDetails.bill.date)}
//                       </span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Bill To */}
//                 <div className="mb-8 p-5 rounded-lg border">
//                   <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
//                   <p className="font-medium">{billDetails?.bill?.patient?.patientName}</p>
//                   <p className="text-gray-700">{billDetails?.bill?.patient?.patientAddress}</p>
//                   <p className="text-muted-foreground">Mobile No: {billDetails?.bill?.patient?.patientMobileNumber}</p>
//                 </div>

//                 {/* Items Table */}
//                 <table className="w-full mb-8 border-collapse text-sm">
//                   <thead>
//                     <tr className="">
//                       <th className="border border-gray-300 px-4 py-3 text-left">#</th>
//                       <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right">Price</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center">GST %</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {billDetails.bill.items.map((item, index) => (
//                       <InvoiceTableRow key={index} item={item} index={index} />
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Totals */}
//                 <div className="flex justify-end mb-8">
//                   <div className="w-full max-w-md border rounded-lg overflow-hidden">
//                     {billDetails.bill.discountAmount > 0 && (
//                       <div className="flex justify-between px-6 py-3 bg-red-50">
//                         <span className="font-medium">Discount</span>
//                         <span className="font-medium text-red-600">
//                           -₹{billDetails.bill.discountAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     )}
//                     <div className="flex justify-between px-6 py-4 text-lg font-bold">
//                       <span>GRAND TOTAL</span>
//                       <span>₹{billDetails.bill.totalAmount.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="border-t pt-6 text-center text-sm text-gray-600">
//                   <p className="font-semibold mb-2">Thank you for your business!</p>
//                   <p>Full payment is due upon receipt. Late payments may incur additional charges.</p>
//                 </div>
//               </>
//             )}

//             {!isLoading && !billDetails && (
//               <div className="text-center py-20 text-red-500">
//                 <p className="text-xl">Failed to load invoice. Please try again.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <AlertDialogFooter className="p-6 border-t  shrink-0">
//           <Button variant="outline" className="cursor-pointer" onClick={() => close && close()}>
//             Close
//           </Button>
//           <Button
//             onClick={handleDownloadPDF}
//             disabled={isDownloading || isLoading || !billDetails}
//             className=" text-white cursor-pointer"
//           >
//             {isDownloading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Generating PDF...
//               </>
//             ) : (
//               <>
//                 <Download className="mr-2 h-4 w-4" />
//                 Download PDF
//               </>
//             )}
//           </Button>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// });

// DownloadInvoice.displayName = "DownloadInvoice";
















// download-invoice.tsx
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getInvoiceDetails } from "@/services/patient-bills";
import { dateFormatter } from "@/utils/constants";
import { useEffect, useState, useCallback, memo } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Loader2, Download, X } from "lucide-react";
import type { Patient, Product } from "@/types/new-sale-entry";

// === Types ===
interface Bill {
  _id: string;
  invoiceNo?: string;
  customerName?: string;
  customerAddress?: string;
  mobileNumber?: string;
  date: string;
  discountAmount: number;
  totalAmount: number;
  items: Product[];
  patient?: Patient;
}

interface Enterprise {
  name: string;
  address: string;
  mobileNumber: string;
  email: string;
  gstNumber?: string;
}

interface InvoiceDetails {
  bill: Bill;
  enterprise: Enterprise;
}

interface DownloadInvoiceProps {
  id: string;
  open?: boolean;
  close?: () => void;
  children?: React.ReactNode;
}

// Memoized table row component
const InvoiceTableRow = memo(({ item, index }: { item: Product; index: number }) => {
  const quantity = Number(item?.quantity || 0);
  const price = Number(item?.sellingPrice || 0);
  const total = quantity * price;
  const gstPercent = (Number(item.cgst) || 0) + (Number(item.sgst) || 0);

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3 text-left">{index + 1}</td>
      <td className="px-4 py-3 text-left font-medium">{item.name}</td>
      <td className="px-4 py-3 text-center">
        {quantity} {item.unit?.baseUnit || ""}
      </td>
      <td className="px-4 py-3 text-right">₹{price.toFixed(2)}</td>
      <td className="px-4 py-3 text-center">{gstPercent}%</td>
      <td className="px-4 py-3 text-right font-semibold">₹{total.toFixed(2)}</td>
    </tr>
  );
});

InvoiceTableRow.displayName = "InvoiceTableRow";

// Loading skeleton
const InvoiceLoadingSkeleton = memo(() => (
  <div className="flex flex-col items-center justify-center h-96">
    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    <p className="mt-4 text-lg text-gray-600">Loading invoice details...</p>
  </div>
));

InvoiceLoadingSkeleton.displayName = "InvoiceLoadingSkeleton";

// Error state
const InvoiceError = memo(() => (
  <div className="text-center py-20">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
      <X className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-xl text-red-600 font-semibold">Failed to load invoice</p>
    <p className="text-sm text-gray-500 mt-2">Please try again or contact support</p>
  </div>
));

InvoiceError.displayName = "InvoiceError";

export const DownloadInvoice = memo(({ id, open, close, children }: DownloadInvoiceProps) => {
  const [billDetails, setBillDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await getInvoiceDetails(id);
      setBillDetails(response?.result || null);
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
      setBillDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (open) {
      fetchInvoice();
    } else {
      setBillDetails(null);
    }
  }, [open, fetchInvoice]);

  const handleDownloadPDF = useCallback(async () => {
    if (!billDetails) return;

    setIsDownloading(true);

    // Wait for DOM to render completely
    await new Promise((resolve) => setTimeout(resolve, 500));

    const element = document.getElementById("print-area");
    if (!element) {
      alert("Invoice content not ready. Please try again.");
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth + 100,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `Invoice_${billDetails.bill.invoiceNo || billDetails.bill._id}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [billDetails]);

  const handleClose = useCallback(() => {
    if (!isDownloading) {
      close?.();
    }
  }, [close, isDownloading]);

  // Calculate totals
  const subtotal = billDetails?.bill.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.sellingPrice || 0),
    0
  ) || 0;

  const discount = billDetails?.bill.discountAmount || 0;
  const grandTotal = billDetails?.bill.totalAmount || 0;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="min-w-[90vw] max-w-[95vw] max-h-[95vh] p-0 flex flex-col overflow-hidden bg-white text-black">
        {/* Header */}
        <AlertDialogHeader className="p-6 border-b shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Invoice Preview
            </AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isDownloading}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div id="print-area" className="bg-white p-10 max-w-[210mm] mx-auto my-6 shadow-lg">
            {isLoading && <InvoiceLoadingSkeleton />}

            {!isLoading && !billDetails && <InvoiceError />}

            {!isLoading && billDetails && (
              <>
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-blue-700 mb-2">
                      {billDetails.enterprise.name}
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {billDetails.enterprise.address}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Email:</span> {billDetails.enterprise.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {billDetails.enterprise.mobileNumber}
                    </p>
                    {billDetails.enterprise.gstNumber && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">GST No:</span> {billDetails.enterprise.gstNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold">INVOICE</h2>
                     
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-semibold text-gray-700">Invoice #:</span>{" "}
                        <span className="text-gray-900">
                          {billDetails.bill.invoiceNo || billDetails.bill._id}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Date:</span>{" "}
                        <span className="text-gray-900">{dateFormatter(billDetails.bill.date)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">Bill To:</h3>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {billDetails.bill.patient?.patientName || billDetails.bill.customerName || "N/A"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {billDetails.bill.patient?.patientAddress || billDetails.bill.customerAddress || ""}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Mobile:</span>{" "}
                      {billDetails.bill.patient?.patientMobileNumber ||
                        billDetails.bill.mobileNumber ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 w-12">#</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Description</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700 w-24">Qty</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700 w-28">Price</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700 w-20">GST</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700 w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetails.bill.items.map((item, index) => (
                        <InvoiceTableRow key={item._id || index} item={item} index={index} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end mb-8">
                  <div className="w-full max-w-sm">
                    <div className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                      {/* Subtotal */}
                      <div className="flex justify-between px-6 py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-700">Subtotal:</span>
                        <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div className="flex justify-between px-6 py-3 border-b border-gray-200 bg-red-50">
                          <span className="font-medium text-gray-700">Discount:</span>
                          <span className="font-semibold text-red-600">-₹{discount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div className="flex justify-between px-6 py-4 bg-blue-700 text-white">
                        <span className="font-bold text-lg">GRAND TOTAL:</span>
                        <span className="font-bold text-lg">₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-300 pt-6 mt-8">
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-gray-900 text-base">
                      Thank you for your business!
                    </p>
                    <p className="text-sm text-gray-600">
                      Full payment is due upon receipt. Late payments may incur additional charges.
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      This is a computer-generated invoice and does not require a signature.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="p-6 border-t bg-gray-50 shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDownloading}
            className="min-w-[100px]"
          >
            Close
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading || isLoading || !billDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

DownloadInvoice.displayName = "DownloadInvoice";