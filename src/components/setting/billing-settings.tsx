import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const BillingSettings = ({ settings }: any) => {
  const {
    autoInvoice,
    setAutoInvoice,
    gstEnabled,
    setGstEnabled,
    defaultDiscount,
    setDefaultDiscount,
  } = settings;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Toggle label="Auto Invoice" value={autoInvoice} onChange={setAutoInvoice} />
        <Toggle label="Enable GST" value={gstEnabled} onChange={setGstEnabled} />

        <div>
          <Label>Default Discount (%)</Label>
          <Input
            type="number"
            value={defaultDiscount}
            onChange={(e) => setDefaultDiscount(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Toggle = ({ label, value, onChange }: any) => (
  <div className="flex justify-between items-center">
    <span>{label}</span>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);
