 "use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Plus } from "lucide-react"; 

interface VendorSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (vendorInfo: any) => void;
}

const VendorSelectionDialog = ({ open, onClose, onSave }: VendorSelectionDialogProps) => {
 
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    companyName: "",
    mobileNumber: "",
    email: "",
    address: "",
    gstNumber: ""
  });
  const [purchaseInfo, setPurchaseInfo] = useState({
    purchaseDate: new Date().toISOString().split('T')[0],
    paymentMethod: "",
    paymentStatus: "pending"
  });

  const handleSave = () => {
    if (showNewVendorForm) {
      // Validate new vendor
      if (!newVendor.name || !newVendor.mobileNumber) {
        alert("Please fill required vendor fields");
        return;
      }
      
      const vendorData = {
        ...newVendor,
        ...purchaseInfo,
        isNew: true
      };
      onSave(vendorData);
    } else {
      // Validate existing vendor selection
      if (!selectedVendor) {
        alert("Please select a vendor");
        return;
      }
      
      const selectedVendorData ={}
      //  vendors.find(v => v.id === selectedVendor);
      const vendorData = {
        ...selectedVendorData,
        ...purchaseInfo,
        isNew: false
      };
      onSave(vendorData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Vendor Information</DialogTitle>
        </DialogHeader>
        
        {!showNewVendorForm ? (
          <>
            <div className="space-y-4">
              <Select
                value={selectedVendor}
                onValueChange={setSelectedVendor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {
                  // vendors
                  [0,1].map(vendor => (
                    <SelectItem key={vendor?.id} value={vendor?.id}>
                      {vendor?.name} ({vendor?.companyName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setShowNewVendorForm(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Vendor
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="font-medium">New Vendor Details</h3>
              
              <Input
                placeholder="Vendor Name *"
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
              />
              
              <Input
                placeholder="Company Name"
                value={newVendor.companyName}
                onChange={(e) => setNewVendor({...newVendor, companyName: e.target.value})}
              />
              
              <Input
                placeholder="Mobile Number *"
                value={newVendor.mobileNumber}
                onChange={(e) => setNewVendor({...newVendor, mobileNumber: e.target.value})}
              />
              
              <Input
                placeholder="Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
              />
              
              <Input
                placeholder="Address"
                value={newVendor.address}
                onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
              />
              
              <Input
                placeholder="GST Number"
                value={newVendor.gstNumber}
                onChange={(e) => setNewVendor({...newVendor, gstNumber: e.target.value})}
              />

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowNewVendorForm(false)}
              >
                Back to Vendor List
              </Button>
            </div>
          </>
        )}

        {/* Purchase Information (shown in both modes) */}
        <div className="space-y-4 pt-4">
          <h3 className="font-medium">Purchase Information</h3>
          
          <Input
            type="date"
            value={purchaseInfo.purchaseDate}
            onChange={(e) => setPurchaseInfo({...purchaseInfo, purchaseDate: e.target.value})}
          />
          
          <Select
            value={purchaseInfo.paymentMethod}
            onValueChange={(value) => setPurchaseInfo({...purchaseInfo, paymentMethod: value})}
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
            onValueChange={(value) => setPurchaseInfo({...purchaseInfo, paymentStatus: value})}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorSelectionDialog;