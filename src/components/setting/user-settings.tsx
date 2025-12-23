"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Pencil, ShieldCheck } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
};

const USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@medtrax.in",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@medtrax.in",
    role: "MANAGER",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@medtrax.in",
    role: "STAFF",
    status: "ACTIVE",
  },
];

export const UserSettings = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User & Role Management</CardTitle>
          <CardDescription>
            Manage MedTrax users and permissions
          </CardDescription>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {USERS.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Role & Actions */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>

              <Badge
                className={
                  user.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {user.status}
              </Badge>

              <Button variant="ghost" size="sm">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Separator />

        <p className="text-xs text-muted-foreground">
          ⚠️ Only Admin users can add, edit, or deactivate users.
        </p>
      </CardContent>
    </Card>
  );
};
