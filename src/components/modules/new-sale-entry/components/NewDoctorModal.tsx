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
import { Button } from "@/components/ui/button";

interface NewDoctorModalProps {
  newDoctorModalOpen: boolean;
  setNewDoctorModalOpen: (open: boolean) => void;
  newDoctorName: string;
  setNewDoctorName: (name: string) => void;
  newDoctorSpecialization: string;
  setNewDoctorSpecialization: (specialization: string) => void;
  newDoctorContact: string;
  setNewDoctorContact: (contact: string) => void;
  addNewDoctor: () => void;
}

const NewDoctorModal = ({
  newDoctorModalOpen,
  setNewDoctorModalOpen,
  newDoctorName,
  setNewDoctorName,
  newDoctorSpecialization,
  setNewDoctorSpecialization,
  newDoctorContact,
  setNewDoctorContact,
  addNewDoctor
}: NewDoctorModalProps) => {
  return (
    <Dialog open={newDoctorModalOpen} onOpenChange={setNewDoctorModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Enter the details for the new doctor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Full Name</Label>
            <Input
              id="doctor-name"
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
              placeholder="Enter doctor name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-specialization">Specialization</Label>
            <Input
              id="doctor-specialization"
              value={newDoctorSpecialization}
              onChange={(e) => setNewDoctorSpecialization(e.target.value)}
              placeholder="Enter specialization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-contact">Contact Information</Label>
            <Input
              id="doctor-contact"
              value={newDoctorContact}
              onChange={(e) => setNewDoctorContact(e.target.value)}
              placeholder="Phone number or email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setNewDoctorModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={addNewDoctor}>Add Doctor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewDoctorModal;