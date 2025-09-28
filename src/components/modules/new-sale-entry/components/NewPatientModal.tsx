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

interface NewPatientModalProps {
  newPatientModalOpen: boolean;
  setNewPatientModalOpen: (open: boolean) => void;
  newPatientName: string;
  setNewPatientName: (name: string) => void;
  newPatientPhone: string;
  setNewPatientPhone: (phone: string) => void;
  newPatientAge: string;
  setNewPatientAge: (age: string) => void;
  newPatientGender: string;
  setNewPatientGender: (gender: string) => void;
  addNewPatient: () => void;
}

const NewPatientModal = ({
  newPatientModalOpen,
  setNewPatientModalOpen,
  newPatientName,
  setNewPatientName,
  newPatientPhone,
  setNewPatientPhone,
  newPatientAge,
  setNewPatientAge,
  newPatientGender,
  setNewPatientGender,
  addNewPatient,
}: NewPatientModalProps) => {
  return (
    <Dialog open={newPatientModalOpen} onOpenChange={setNewPatientModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the details for the new patient.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Full Name</Label>
            <Input
              id="patient-name"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-phone">Phone Number</Label>
            <Input
              id="patient-phone"
              value={newPatientPhone}
              onChange={(e) => setNewPatientPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-age">Age</Label>
              <Input
                id="patient-age"
                type="number"
                value={newPatientAge}
                onChange={(e) => setNewPatientAge(e.target.value)}
                placeholder="Age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-gender">Gender</Label>
              <Select
                value={newPatientGender}
                onValueChange={setNewPatientGender}
              >
                <SelectTrigger id="patient-gender">
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setNewPatientModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={addNewPatient}>Add Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientModal;
