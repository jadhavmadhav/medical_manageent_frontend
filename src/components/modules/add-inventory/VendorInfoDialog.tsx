"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createNewVendor, getAllVendors } from "@/services/vendors";
import { toast } from "sonner";

interface VendorSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (vendorInfo: any) => void;
  enterpriseId: string;
}

const VendorSelectionDialog = ({
  open,
  onClose,
  onSave,
  enterpriseId,
}: VendorSelectionDialogProps) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    companyName: "",
    mobileNumber: "",
    email: "",
    address: "",
    gstNumber: "",
  });
  const [purchaseInfo, setPurchaseInfo] = useState({
    purchaseDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    paymentStatus: "pending",
  });

  // Fetch vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ["vendors", enterpriseId],
    queryFn: () => getAllVendors({ enterpriseId }),
    enabled: !!enterpriseId && open,
  });

  // Create vendor mutation
  const createVendorMutation = useMutation({
    mutationFn: createNewVendor,
    onSuccess: (newVendorData) => {
      toast.success("Vendor created successfully");
      console.log("Vendor created successfully", newVendorData);
      // After creating vendor, proceed with purchase info
      const vendorData = {
        ...newVendorData?.data,
        ...purchaseInfo,
        isNew: true,
      };
      onSave(vendorData);
    },
    onError: (error) => {
      toast.error("Failed to create vendor");
      console.error("Vendor creation error:", error);
    },
  });

  const handleSaveExistingVendor = () => {
    if (!selectedVendorId) {
      toast.error("Please select a vendor");
      return;
    }

    const selectedVendor = vendorsData?.data?.find(
      (vendor: any) => vendor._id === selectedVendorId
    );

    console.log("selectedVendor", { selectedVendor, data: vendorsData.data });

    if (!selectedVendor) {
      toast.error("Selected vendor not found");
      return;
    }

    const vendorData = {
      ...selectedVendor,
      ...purchaseInfo,
      isNew: false,
    };
    onSave(vendorData);
  };

  const handleCreateAndSaveVendor = () => {
    // Validate new vendor
    if (!newVendor.name.trim() || !newVendor.mobileNumber.trim()) {
      toast.error(
        "Please fill required vendor fields (Name and Mobile Number)"
      );
      return;
    }

    if (!purchaseInfo.paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    // Create vendor first
    createVendorMutation.mutate({
      ...newVendor,
      enterpriseId,
    });
  };

  const handleBackToVendorList = () => {
    setShowNewVendorForm(false);
    setNewVendor({
      name: "",
      companyName: "",
      mobileNumber: "",
      email: "",
      address: "",
      gstNumber: "",
    });
  };

  const vendors = vendorsData?.data || [];
  const isLoading = isLoadingVendors || createVendorMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            Vendor Information
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!showNewVendorForm ? (
          <div className="space-y-4">
            <Select
              value={selectedVendorId}
              onValueChange={setSelectedVendorId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor: any) => (
                  <SelectItem key={vendor._id} value={vendor._id}>
                    {vendor.name}{" "}
                    {vendor.companyName && `- ${vendor.companyName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowNewVendorForm(true)}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add New Vendor
            </Button>

            {/* Purchase Information for existing vendor */}
            <div className="space-y-4 pt-4">
              <h3 className="font-medium">Purchase Information</h3>

              <Input
                type="date"
                value={purchaseInfo.purchaseDate}
                onChange={(e) =>
                  setPurchaseInfo({
                    ...purchaseInfo,
                    purchaseDate: e.target.value,
                  })
                }
                disabled={isLoading}
              />

              <Select
                value={purchaseInfo.paymentMethod}
                onValueChange={(value) =>
                  setPurchaseInfo({ ...purchaseInfo, paymentMethod: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={purchaseInfo.paymentStatus}
                onValueChange={(value) =>
                  setPurchaseInfo({ ...purchaseInfo, paymentStatus: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveExistingVendor}
                disabled={
                  isLoading || !selectedVendorId || !purchaseInfo.paymentMethod
                }
              >
                Save Purchase
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">New Vendor Details</h3>

            <Input
              placeholder="Vendor Name *"
              value={newVendor.name}
              onChange={(e) =>
                setNewVendor({ ...newVendor, name: e.target.value })
              }
              disabled={isLoading}
            />

            <Input
              placeholder="Company Name"
              value={newVendor.companyName}
              onChange={(e) =>
                setNewVendor({ ...newVendor, companyName: e.target.value })
              }
              disabled={isLoading}
            />

            <Input
              placeholder="Mobile Number *"
              value={newVendor.mobileNumber}
              onChange={(e) =>
                setNewVendor({ ...newVendor, mobileNumber: e.target.value })
              }
              disabled={isLoading}
            />

            <Input
              placeholder="Email"
              value={newVendor.email}
              onChange={(e) =>
                setNewVendor({ ...newVendor, email: e.target.value })
              }
              type="email"
              disabled={isLoading}
            />

            <Input
              placeholder="Address"
              value={newVendor.address}
              onChange={(e) =>
                setNewVendor({ ...newVendor, address: e.target.value })
              }
              disabled={isLoading}
            />

            <Input
              placeholder="GST Number"
              value={newVendor.gstNumber}
              onChange={(e) =>
                setNewVendor({ ...newVendor, gstNumber: e.target.value })
              }
              disabled={isLoading}
            />

            {/* Purchase Information for new vendor */}
            <div className="space-y-4 pt-4">
              <h3 className="font-medium">Purchase Information</h3>

              <Input
                type="date"
                value={purchaseInfo.purchaseDate}
                onChange={(e) =>
                  setPurchaseInfo({
                    ...purchaseInfo,
                    purchaseDate: e.target.value,
                  })
                }
                disabled={isLoading}
              />

              <Select
                value={purchaseInfo.paymentMethod}
                onValueChange={(value) =>
                  setPurchaseInfo({ ...purchaseInfo, paymentMethod: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={purchaseInfo.paymentStatus}
                onValueChange={(value) =>
                  setPurchaseInfo({ ...purchaseInfo, paymentStatus: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleBackToVendorList}
                disabled={isLoading}
              >
                Back to Vendor List
              </Button>
              <Button
                onClick={handleCreateAndSaveVendor}
                disabled={
                  isLoading ||
                  !newVendor.name ||
                  !newVendor.mobileNumber ||
                  !purchaseInfo.paymentMethod
                }
              >
                {createVendorMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Vendor & Save"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorSelectionDialog;
