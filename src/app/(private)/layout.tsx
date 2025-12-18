"use client";
import { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EnterpriseProvider } from "@/lib/context/EnterpriseContext";
import { NavBar } from "@/components/nav-bar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <EnterpriseProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen w-full overflow-hidden">
          <header className="flex h-16 shrink-0 items-center bg-primary">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />

              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <NavBar />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-[100%] overflow-y-scroll">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </EnterpriseProvider>
  );
}
