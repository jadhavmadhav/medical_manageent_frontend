




"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "./useSettings";
import { OrganizationSettings } from "./organization-settings";
import { NotificationSettings } from "./notification-settings";
import { BillingSettings } from "./billing-settings";
import { SecuritySettings } from "./security-settings";
import {
    Building2,
    Bell,
    Shield,
    Users,
    CreditCard,
    Sliders,
    Save,
} from "lucide-react";
import { UserSettings } from "./user-settings";

const SettingView = () => {
    const settings = useSettings();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Settings</h1>

            <Tabs defaultValue="organization">
                <TabsList>
                    <TabsTrigger value="organization"> <Building2 className="w-4 h-4 mr-2" /> Organization</TabsTrigger>
                    <TabsTrigger value="users"> <Users className="w-4 h-4 mr-2" /> Users </TabsTrigger>
                    <TabsTrigger value="notifications"> <Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
                    <TabsTrigger value="billing"> <CreditCard className="w-4 h-4 mr-2" />Billing</TabsTrigger>
                    <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
                </TabsList>

                <TabsContent value="organization">
                    <OrganizationSettings settings={settings} />
                </TabsContent>
                <TabsContent value="users">
                    <UserSettings />
                </TabsContent>
                <TabsContent value="notifications">
                    <NotificationSettings settings={settings} />
                </TabsContent>
                <TabsContent value="billing">
                    <BillingSettings settings={settings} />
                </TabsContent>
                <TabsContent value="security">
                    <SecuritySettings />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingView;
