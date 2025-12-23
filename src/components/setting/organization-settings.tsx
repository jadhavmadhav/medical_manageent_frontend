import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export const OrganizationSettings = ({ settings }: any) => {
  const {
    storeName,
    setStoreName,
    storeEmail,
    setStoreEmail,
    storePhone,
    setStorePhone,
    storeAddress,
    setStoreAddress,
    gstNumber,
    setGstNumber,
    licenseNumber,
    setLicenseNumber,
    saveOrganization,
  } = settings;

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Store & business information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Store Name</Label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
          </div>
          <div>
            <Label>GST Number</Label>
            <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Address</Label>
          <Textarea value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
        </div>

        <div>
          <Label>Drug License</Label>
          <Input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>

        <Button onClick={saveOrganization}>
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
