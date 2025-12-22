"use client";

import { useState } from "react";
import {
  Search,
  CircleUser,
  LogOut,
  Settings,
  User,
  Bell,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const NavBar = () => {
  const [search, setSearch] = useState("");
  const { logout } = useAuth();
  const router = useRouter()
  const notificationCount = 3;

  const handleLogout = () => {
    logout()
  };

  const handleProfile = () => {
    router.push('/profile')
  }

  const handleViewNotification = () => {
    router.push('/notification')
  }

  return (
    <div className="flex items-center justify-end flex-1 gap-10">
      {/* 🔍 Search */}
      <div className="relative w-full max-w-md rounded-md border bg-background">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients, doctors..."
          className="pl-9 border-0 focus-visible:ring-0"
        />
      </div>

      {/* 👉 Right Section */}
      <div className="flex items-center gap-3">
        {/* 🌗 Dark Mode Toggle */}
        <Button variant="outline" size="icon">
          <ThemeToggle />
        </Button>

        {/* 🔔 Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                  {notificationCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem>New patient registered</DropdownMenuItem>
            <DropdownMenuItem>Appointment scheduled</DropdownMenuItem>
            <DropdownMenuItem>Payment received</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-center text-sm text-muted-foreground" onClick={handleViewNotification}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 👤 User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleUser size={26} className="cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={handleProfile}>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 font-semibold text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
