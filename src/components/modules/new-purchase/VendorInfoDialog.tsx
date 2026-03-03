 "use client";

import {
  Dialog,
  DialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Plus,
  Loader2,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  ChevronsUpDown,
  Check,
  Search,
  X,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createNewVendor, getAllVendors } from "@/services/vendors";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VendorSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (vendorInfo: any) => void;
  enterpriseId: string;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

const LabeledField = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const VendorSelectionDialog = ({
  open,
  onClose,
  onSave,
  enterpriseId,
}: VendorSelectionDialogProps) => {
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorOpen, setVendorOpen] = useState(false);
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search: instant reset on clear, 300ms delay otherwise
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery === "") {
      // Immediately reset so the full list comes back without delay
      setDebouncedSearch("");
    } else {
      debounceRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

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

  // ── Data ───────────────────────────────────────────────────────────────────

  const shouldSearch = debouncedSearch === "" || debouncedSearch.length >= 2;

  const { data: vendorsData, isLoading: isLoadingVendors, isFetching: isFetchingVendors } = useQuery({
    queryKey: ["vendors", enterpriseId, debouncedSearch],
    queryFn: () => getAllVendors({ enterpriseId, search: debouncedSearch }),
    enabled: !!enterpriseId && open && shouldSearch,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });

  const vendors: any[] = useMemo(() => vendorsData?.data ?? [], [vendorsData]);

  const selectedVendor = useMemo(
    () => vendors.find((v) => v._id === selectedVendorId),
    [vendors, selectedVendorId]
  );

  const createVendorMutation = useMutation({
    mutationFn: createNewVendor,
    onSuccess: (res) => {
      toast.success("Vendor created successfully");
      onSave({ ...res?.data, ...purchaseInfo, isNew: true });
    },
    onError: () => toast.error("Failed to create vendor"),
  });

  const isLoading = isLoadingVendors || createVendorMutation.isPending;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSaveExisting = () => {
    if (!selectedVendorId) return toast.error("Please select a vendor");
    if (!selectedVendor) return toast.error("Selected vendor not found");
    if (!purchaseInfo.paymentMethod) return toast.error("Please select a payment method");
    onSave({ ...selectedVendor, ...purchaseInfo, isNew: false });
  };

  const handleCreateAndSave = () => {
    if (!newVendor.name.trim() || !newVendor.mobileNumber.trim())
      return toast.error("Vendor name and mobile number are required");
    if (!purchaseInfo.paymentMethod)
      return toast.error("Please select a payment method");
    createVendorMutation.mutate({ ...newVendor, enterpriseId });
  };

  const resetAndBack = () => {
    setShowNewVendorForm(false);
    setNewVendor({ name: "", companyName: "", mobileNumber: "", email: "", address: "", gstNumber: "" });
  };

  const setV = (k: string, v: string) => setNewVendor((p) => ({ ...p, [k]: v }));
  const setP = (k: string, v: string) => setPurchaseInfo((p) => ({ ...p, [k]: v }));

  // ── Shared: purchase section ───────────────────────────────────────────────

  const PurchaseInfoSection = (
    <div className="space-y-3 bg-muted/40 rounded-xl p-4 border border-border">
      <LabeledField label="Purchase Date">
        <Input
          type="date"
          value={purchaseInfo.purchaseDate}
          onChange={(e) => setP("purchaseDate", e.target.value)}
          disabled={isLoading}
          className="h-9 text-sm"
        />
      </LabeledField>

      <div className="grid grid-cols-2 gap-3">
        <LabeledField label="Payment Method">
          <Select value={purchaseInfo.paymentMethod} onValueChange={(v) => setP("paymentMethod", v)} disabled={isLoading}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </LabeledField>

        <LabeledField label="Payment Status">
          <Select value={purchaseInfo.paymentStatus} onValueChange={(v) => setP("paymentStatus", v)} disabled={isLoading}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending"> Pending</SelectItem>
              <SelectItem value="paid"> Paid</SelectItem>
              <SelectItem value="partial"> Partial</SelectItem>
            </SelectContent>
          </Select>
        </LabeledField>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl gap-0">

        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-base font-bold leading-tight">
            {showNewVendorForm ? "New Vendor" : "Select Vendor"}
          </DialogTitle>
          <p className="text-muted-foreground text-xs mt-0.5">
            {showNewVendorForm
              ? "Add vendor details and payment info"
              : "Choose a vendor for this purchase bill"}
          </p>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Processing...</p>
            </div>
          </div>
        )}

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">

          {/* ── SELECT EXISTING VENDOR ──────────────────────────────── */}
          {!showNewVendorForm ? (
            <>
              {/* Searchable combobox */}
              <LabeledField label="Vendor">
                <Popover open={vendorOpen} onOpenChange={(o) => {
                  setVendorOpen(o);
                  if (!o) setSearchQuery("");
                }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={vendorOpen}
                      disabled={isLoading}
                      className={cn(
                        "w-full h-10 justify-between font-normal text-sm",
                        !selectedVendorId && "text-muted-foreground"
                      )}
                    >
                      {selectedVendor ? (
                        <div className="flex items-center gap-2 min-w-0">
                          
                          <span className="truncate font-medium text-foreground">
                            {selectedVendor.name}
                          </span>
                          {selectedVendor.companyName && (
                            <span className="text-muted-foreground text-xs shrink-0">
                              — {selectedVendor.companyName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>{isLoadingVendors ? "Loading..." : "Search & select vendor"}</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0 shadow-lg"
                    align="start"
                    sideOffset={4}
                  >
                    {/* Search input — drives API call via debounce */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, company, mobile..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")}>
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Subtle fetch indicator — shows only on refetch, not initial load */}
                    <div className={cn(
                      "h-0.5 bg-primary/30 overflow-hidden transition-all",
                      isFetchingVendors && !isLoadingVendors ? "opacity-100" : "opacity-0"
                    )}>
                      <div className="h-full bg-primary animate-[shimmer_1s_ease-in-out_infinite] w-1/3" />
                    </div>

                    <div className="max-h-56 overflow-scroll scrollbar-thin">
                      {isLoadingVendors ? (
                        // Only show full skeleton on very first load (no previous data)
                        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading vendors...
                        </div>
                      ) : searchQuery.length === 1 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Type one more character to search...
                        </div>
                      ) : vendors.length === 0 ? (
                        <div className="py-6 text-center">
                          <p className="text-sm text-muted-foreground">No vendors found.</p>
                          <button
                            className="mt-2 text-xs font-semibold text-primary hover:underline"
                            onClick={() => {
                              setVendorOpen(false);
                              setSearchQuery("");
                              setShowNewVendorForm(true);
                            }}
                          >
                            + Add new vendor
                          </button>
                        </div>
                      ) : (
                        vendors.map((vendor) => (
                          <button
                            key={vendor._id}
                            onClick={() => {
                              setSelectedVendorId(vendor._id === selectedVendorId ? "" : vendor._id);
                              setVendorOpen(false);
                              setSearchQuery("");
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors",
                              selectedVendorId === vendor._id && "bg-primary/5"
                            )}
                          >
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-muted-foreground">
                                {vendor.name.trim().charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-semibold text-foreground truncate">
                                {vendor.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {vendor.companyName && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {vendor.companyName}
                                  </span>
                                )}
                                {vendor.mobileNumber && (
                                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                                    {vendor.mobileNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4 shrink-0 text-primary",
                                selectedVendorId === vendor._id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </LabeledField>

              {/* Add new shortcut */}
              <button
                onClick={() => setShowNewVendorForm(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add New Vendor
              </button>

              {PurchaseInfoSection}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 h-10">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveExisting}
                  disabled={isLoading || !selectedVendorId || !purchaseInfo.paymentMethod}
                  className="flex-1 h-10"
                >
                  Confirm Purchase
                </Button>
              </div>
            </>
          ) : (

            /* ── NEW VENDOR FORM ─────────────────────────────────────── */
            <>
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Vendor Information
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Vendor Name *" icon={User}>
                    <Input
                      placeholder="Full name"
                      value={newVendor.name}
                      onChange={(e) => setV("name", e.target.value)}
                      disabled={isLoading}
                      className="h-9 text-sm"
                    />
                  </LabeledField>
                  <LabeledField label="Company Name" icon={Building2}>
                    <Input
                      placeholder="Optional"
                      value={newVendor.companyName}
                      onChange={(e) => setV("companyName", e.target.value)}
                      disabled={isLoading}
                      className="h-9 text-sm"
                    />
                  </LabeledField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Mobile *" icon={Phone}>
                    <Input
                      placeholder="+91 XXXXX XXXXX"
                      value={newVendor.mobileNumber}
                      onChange={(e) => setV("mobileNumber", e.target.value)}
                      disabled={isLoading}
                      className="h-9 text-sm"
                    />
                  </LabeledField>
                  <LabeledField label="Email" icon={Mail}>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      value={newVendor.email}
                      onChange={(e) => setV("email", e.target.value)}
                      disabled={isLoading}
                      className="h-9 text-sm"
                    />
                  </LabeledField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Address" icon={MapPin}>
                    <Input
                      placeholder="Street, City, State"
                      value={newVendor.address}
                      onChange={(e) => setV("address", e.target.value)}
                      disabled={isLoading}
                      className="h-9 text-sm"
                    />
                  </LabeledField>
                  <LabeledField label="GST Number" icon={Hash}>
                    <Input
                      placeholder="22AAAAA0000A1Z5"
                      value={newVendor.gstNumber}
                      onChange={(e) => setV("gstNumber", e.target.value.toUpperCase())}
                      disabled={isLoading}
                      className="h-9 text-sm font-mono uppercase"
                    />
                  </LabeledField>
                </div>
              </div>

              {PurchaseInfoSection}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={resetAndBack} disabled={isLoading} className="gap-2 h-10">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleCreateAndSave}
                  disabled={
                    isLoading ||
                    !newVendor.name.trim() ||
                    !newVendor.mobileNumber.trim() ||
                    !purchaseInfo.paymentMethod
                  }
                  className="flex-1 h-10"
                >
                  {createVendorMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Vendor...
                    </>
                  ) : (
                    "Create Vendor & Save Bill"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorSelectionDialog;