import React, { useState } from "react";
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

interface NewEntityModalProps {
  entityType: "patient" | "doctor";
  open: boolean;
  enterpriseId: string;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const NewEntityModal = ({
  entityType,
  open,
  enterpriseId,
  setOpen,
  onSubmit,
}: NewEntityModalProps) => {
  const [formData, setFormData] = useState<any>({
    enterpriseId,
    name: "",
    ...(entityType === "patient"
      ? { mobile_number: "", age: "", gender: "Male", address: "" }
      : {
          mobile_number: "",
          specialization: "",
          hospital: "",
          email: "",
          address: "",
        }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, gender: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setOpen(false);
    setFormData({
      name: "",
      enterpriseId,
      ...(entityType === "patient"
        ? { mobile_number: "", age: "", gender: "Male", address: "" }
        : {
            mobile_number: "",
            specialization: "",
            hospital: "",
            email: "",
            address: "",
          }),
    });
  };

  const renderFormFields = () => {
    if (entityType === "patient") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              id="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter doctor name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              id="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Enter specialization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital (Optional)</Label>
            <Input
              id="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="Enter hospital name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
        </>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add New {entityType === "patient" ? "Patient" : "Doctor"}
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new{" "}
            {entityType === "patient" ? "patient" : "doctor"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">{renderFormFields()}</div>
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
