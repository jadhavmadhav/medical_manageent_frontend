import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export const SecuritySettings = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span>Login Alerts</span>
                    <Switch defaultChecked />
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                    <Input type="password" placeholder="Current Password" />
                    <Input type="password" placeholder="New Password" />
                </div>

                <Button variant="outline">Update Password</Button>
            </CardContent>
        </Card>
    );
};
