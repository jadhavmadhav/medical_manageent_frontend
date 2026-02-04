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
// import { useEffect, useState, useCallback } from "react";
// import html2canvas from "html2canvas-pro";  // <-- FIXED: Use pro version for oklch support
// import jsPDF from "jspdf";
// import { Loader2, Download } from "lucide-react";

// // === Types ===
// interface Item {
//   item: string;
//   quantity: number;
//   sellingPrice: number;
//   cgst: number;
//   sgst: number;
//   locker: string;
// }

// interface Bill {
//   _id: string;
//   customerName: string;
//   customerAddress: string;
//   mobileNumber: string;
//   date: string;
//   discountAmount: number;
//   totalAmount: number;
//   items: Item[];
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
// }

// export const DownloadInvoice = ({ id }: DownloadInvoiceProps) => {
//   const [billDetails, setBillDetails] = useState<InvoiceDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   // Fetch invoice when dialog opens
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
//     if (isDialogOpen) {
//       fetchInvoice();
//     } else {
//       setBillDetails(null); // Reset on close
//     }
//   }, [isDialogOpen, fetchInvoice]);

//   // === PDF Download Function (Now Works with oklch Colors) ===
//   const handleDownloadPDF = async () => {
//     if (!billDetails) return;

//     setIsDownloading(true);

//     // Critical: Wait for DOM to fully render (especially fonts, layout)
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

//       // First page
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;

//       // Add new pages if content overflows
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
//   };

//   return (
//     <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <AlertDialogTrigger asChild>
//         {/* <Button  className="flex w-full items-center gap-2 cursor-pointer"> */}
//         <div>

//           <Download className="w-4 h-4" />
//           Download
//         </div>
//         {/* </Button> */}
//       </AlertDialogTrigger>

//       <AlertDialogContent className="min-w-[90vw] max-h-[90vh] p-0 flex flex-col overflow-auto">
//         <AlertDialogHeader className="p-6 border-b bg-gray-50">
//           <AlertDialogTitle className="text-2xl font-bold text-gray-900">
//             Invoice Preview
//           </AlertDialogTitle>
//         </AlertDialogHeader>

//         {/* Printable Area */}
//         <div id="print-area" className="bg-white text-gray-800 p-10 flex-1  overflow-auto">
//           {isLoading && (
//             <div className="flex flex-col items-center justify-center h-96">
//               <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
//               <p className="mt-4 text-lg">Loading invoice details...</p>
//             </div>
//           )}

//           {!isLoading && billDetails && (
//             <>
//               {/* Header */}
//               <div className="flex justify-between items-start mb-8 border-b pb-6">
//                 <div>
//                   <h1 className="text-3xl font-bold text-blue-700">
//                     {billDetails.enterprise.name}
//                   </h1>
//                   <p className="text-sm text-gray-600 mt-2">
//                     {billDetails.enterprise.address}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Email: {billDetails.enterprise.email} | Phone: {billDetails.enterprise.mobileNumber}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <h2 className="text-4xl font-bold text-gray-900">INVOICE</h2>
//                   <p className="text-sm mt-3">
//                     <span className="font-semibold">Invoice #:</span> {billDetails.bill._id}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-semibold">Date:</span> {dateFormatter(billDetails.bill.date)}
//                   </p>
//                 </div>
//               </div>

//               {/* Bill To */}
//               <div className="mb-8 p-5 bg-gray-50 rounded-lg border">
//                 <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
//                 <p className="font-medium">{billDetails.bill.customerName}</p>
//                 <p className="text-gray-700">{billDetails.bill.customerAddress}</p>
//                 <p className="text-gray-700">Phone: {billDetails.bill.mobileNumber}</p>
//               </div>

//               {/* Items Table */}
//               <table className="w-full mb-8 border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-3 text-left">#</th>
//                     <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
//                     <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
//                     <th className="border border-gray-300 px-4 py-3 text-right">Price</th>
//                     <th className="border border-gray-300 px-4 py-3 text-center">GST %</th>
//                     {/* <th className="border border-gray-300 px-4 py-3 text-center">Locker</th> */}
//                     <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {billDetails.bill.items.map((item, index) => {
//                     const total = item.quantity * item.sellingPrice;
//                     const gstPercent = (Number(item.cgst) || 0) + (Number(item.sgst) || 0);
//                     return (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
//                         <td className="border border-gray-300 px-4 py-3">{item.item}</td>
//                         <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
//                         <td className="border border-gray-300 px-4 py-3 text-right">₹{item.sellingPrice.toFixed(2)}</td>
//                         <td className="border border-gray-300 px-4 py-3 text-center">{gstPercent}%</td>
//                         {/* <td className="border border-gray-300 px-4 py-3 text-center">{item.locker}</td> */}
//                         <td className="border border-gray-300 px-4 py-3 text-right font-medium">₹{total.toFixed(2)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//               {/* Totals */}
//               <div className="flex justify-end mb-8">
//                 <div className="w-full max-w-md border border-gray-300 rounded-lg overflow-hidden">
//                   {billDetails.bill.discountAmount > 0 && (
//                     <div className="flex justify-between px-6 py-3 bg-red-50">
//                       <span className="font-medium">Discount</span>
//                       <span className="font-medium text-red-600">-₹{billDetails.bill.discountAmount.toFixed(2)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between px-6 py-4 bg-blue-50 text-lg font-bold">
//                     <span>GRAND TOTAL</span>
//                     <span>₹{billDetails.bill.totalAmount.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="border-t pt-6 text-center text-sm text-gray-600">
//                 <p className="font-semibold mb-2">Thank you for your business!</p>
//                 <p>Full payment is due upon receipt. Late payments may incur additional charges.</p>
//               </div>
//             </>
//           )}

//           {!isLoading && !billDetails && (
//             <div className="text-center py-20 text-red-500">
//               <p className="text-xl">Failed to load invoice. Please try again.</p>
//             </div>
//           )}
//         </div>

//         {/* Footer Buttons */}
//         <AlertDialogFooter className="p-6 border-t bg-gray-50">
//           <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//             Close
//           </Button>
//           <Button
//             onClick={handleDownloadPDF}
//             disabled={isDownloading || isLoading || !billDetails}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
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
// };
























// download-invoice.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getInvoiceDetails } from "@/services/patient-bills";
import { dateFormatter } from "@/utils/constants";
import { useEffect, useState, useCallback, memo } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Loader2, Download } from "lucide-react";

// === Types ===
interface Item {
  item: string;
  quantity: number;
  sellingPrice: number;
  cgst: number;
  sgst: number;
  locker?: string;
}

interface Bill {
  _id: string;
  customerName: string;
  customerAddress: string;
  mobileNumber: string;
  date: string;
  discountAmount: number;
  totalAmount: number;
  items: Item[];
}

interface Enterprise {
  name: string;
  address: string;
  mobileNumber: string;
  email: string;
}

interface InvoiceDetails {
  bill: Bill;
  enterprise: Enterprise;
}

interface DownloadInvoiceProps {
  id: string;
  children?: React.ReactNode;
}

// Memoized table row component
const InvoiceTableRow = memo(({ item, index }: { item: Item; index: number }) => {
  const total = item.quantity * item.sellingPrice;
  const gstPercent = (Number(item.cgst) || 0) + (Number(item.sgst) || 0);

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
      <td className="border border-gray-300 px-4 py-3">{item.item}</td>
      <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
      <td className="border border-gray-300 px-4 py-3 text-right">₹{item.sellingPrice.toFixed(2)}</td>
      <td className="border border-gray-300 px-4 py-3 text-center">{gstPercent}%</td>
      <td className="border border-gray-300 px-4 py-3 text-right font-medium">₹{total.toFixed(2)}</td>
    </tr>
  );
});

InvoiceTableRow.displayName = "InvoiceTableRow";

export const DownloadInvoice = memo(({ id, children }: DownloadInvoiceProps) => {
  const [billDetails, setBillDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    if (isDialogOpen) {
      fetchInvoice();
    } else {
      setBillDetails(null);
    }
  }, [isDialogOpen, fetchInvoice]);

  const handleDownloadPDF = useCallback(async () => {
    if (!billDetails) return;

    setIsDownloading(true);

    // Wait for DOM to render
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

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Invoice_${billDetails.bill._id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [billDetails]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="min-w-[90vw] max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <AlertDialogHeader className="p-6 border-b bg-gray-50 shrink-0">
          <AlertDialogTitle className="text-2xl font-bold text-gray-900">
            Invoice Preview
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex-1 overflow-auto">
          <div id="print-area" className="bg-white text-gray-800 p-10">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="mt-4 text-lg">Loading invoice details...</p>
              </div>
            )}

            {!isLoading && billDetails && (
              <>
                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b pb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-700">
                      {billDetails.enterprise.name}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                      {billDetails.enterprise.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {billDetails.enterprise.email} | Phone:{" "}
                      {billDetails.enterprise.mobileNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-sm mt-3">
                      <span className="font-semibold">Invoice #:</span> {billDetails.bill._id}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Date:</span>{" "}
                      {dateFormatter(billDetails.bill.date)}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8 p-5 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                  <p className="font-medium">{billDetails.bill.customerName}</p>
                  <p className="text-gray-700">{billDetails.bill.customerAddress}</p>
                  <p className="text-gray-700">Phone: {billDetails.bill.mobileNumber}</p>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8 border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left">#</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
                      <th className="border border-gray-300 px-4 py-3 text-right">Price</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">GST %</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billDetails.bill.items.map((item, index) => (
                      <InvoiceTableRow key={index} item={item} index={index} />
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-full max-w-md border border-gray-300 rounded-lg overflow-hidden">
                    {billDetails.bill.discountAmount > 0 && (
                      <div className="flex justify-between px-6 py-3 bg-red-50">
                        <span className="font-medium">Discount</span>
                        <span className="font-medium text-red-600">
                          -₹{billDetails.bill.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between px-6 py-4 bg-blue-50 text-lg font-bold">
                      <span>GRAND TOTAL</span>
                      <span>₹{billDetails.bill.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 text-center text-sm text-gray-600">
                  <p className="font-semibold mb-2">Thank you for your business!</p>
                  <p>Full payment is due upon receipt. Late payments may incur additional charges.</p>
                </div>
              </>
            )}

            {!isLoading && !billDetails && (
              <div className="text-center py-20 text-red-500">
                <p className="text-xl">Failed to load invoice. Please try again.</p>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter className="p-6 border-t bg-gray-50 shrink-0">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading || isLoading || !billDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white"
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