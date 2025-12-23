import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const NotificationSettings = ({ settings }: any) => {
  const {
    emailNotifications,
    setEmailNotifications,
    expiryAlerts,
    setExpiryAlerts,
    lowStockAlerts,
    setLowStockAlerts,
    paymentAlerts,
    setPaymentAlerts,
  } = settings;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingToggle
          label="Email Notifications"
          value={emailNotifications}
          onChange={setEmailNotifications}
        />
        <SettingToggle
          label="Expiry Alerts"
          value={expiryAlerts}
          onChange={setExpiryAlerts}
        />
        <SettingToggle
          label="Low Stock Alerts"
          value={lowStockAlerts}
          onChange={setLowStockAlerts}
        />
        <SettingToggle
          label="Payment Alerts"
          value={paymentAlerts}
          onChange={setPaymentAlerts}
        />
      </CardContent>
    </Card>
  );
};

const SettingToggle = ({ label, value, onChange }: any) => (
  <div className="flex justify-between items-center">
    <span>{label}</span>
    <Switch checked={value} onCheckedChange={onChange} />
  </div>
);
