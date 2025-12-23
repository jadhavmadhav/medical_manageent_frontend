// // "use client";

// // import { useState } from "react";
// // import {
// //   Search,
// //   CircleUser,
// //   LogOut,
// //   Settings,
// //   User,
// //   Bell,
// // } from "lucide-react";

// // import { Input } from "@/components/ui/input";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { ThemeToggle } from "./theme-toggle";
// // import { useAuth } from "@/context/auth-context";
// // import { useRouter } from "next/navigation";
// // import { Button } from "./ui/button";

// // export const NavBar = () => {
// //   const [search, setSearch] = useState("");
// //   const { logout } = useAuth();
// //   const router = useRouter()
// //   const notificationCount = 3;

// //   const handleLogout = () => {
// //     logout()
// //   };

// //   const handleProfile = () => {
// //     router.push('/profile')
// //   }

// //   const handleViewNotification = () => {
// //     router.push('/notification')
// //   }

// //   return (
// //     <div className="flex items-center justify-end flex-1 gap-10">
// //       {/* 🔍 Search */}
// //       <div className="relative w-full max-w-md rounded-md border bg-background">
// //         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //         <Input
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           placeholder="Search patients, doctors..."
// //           className="pl-9 border-0 focus-visible:ring-0"
// //         />
// //       </div>

// //       {/* 👉 Right Section */}
// //       <div className="flex items-center gap-3">
// //         {/* 🌗 Dark Mode Toggle */}
// //         <Button variant="outline" size="icon">
// //           <ThemeToggle />
// //         </Button>

// //         {/* 🔔 Notifications */}
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <div className="relative cursor-pointer">
// //               <Bell className="h-5 w-5" />
// //               {notificationCount > 0 && (
// //                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
// //                   {notificationCount}
// //                 </span>
// //               )}
// //             </div>
// //           </DropdownMenuTrigger>

// //           <DropdownMenuContent align="end" className="w-64">
// //             <DropdownMenuItem>New patient registered</DropdownMenuItem>
// //             <DropdownMenuItem>Appointment scheduled</DropdownMenuItem>
// //             <DropdownMenuItem>Payment received</DropdownMenuItem>

// //             <DropdownMenuSeparator />

// //             <DropdownMenuItem className="text-center text-sm text-muted-foreground" onClick={handleViewNotification}>
// //               View all notifications
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>

// //         {/* 👤 User Menu */}
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <CircleUser size={26} className="cursor-pointer" />
// //           </DropdownMenuTrigger>

// //           <DropdownMenuContent align="end" className="w-48">
// //             <DropdownMenuItem className="gap-2" onClick={handleProfile}>
// //               <User className="h-4 w-4" />
// //               Profile
// //             </DropdownMenuItem>

// //             <DropdownMenuItem className="gap-2">
// //               <Settings className="h-4 w-4" />
// //               Settings
// //             </DropdownMenuItem>

// //             <DropdownMenuSeparator />

// //             <DropdownMenuItem
// //               className="gap-2 font-semibold text-red-500 focus:text-red-500"
// //               onClick={handleLogout}
// //             >
// //               <LogOut className="h-4 w-4" />
// //               Logout
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>
// //       </div>
// //     </div>
// //   );
// // };




// "use client";
// import { useState } from "react";
// import {
//   Search,
//   CircleUser,
//   LogOut,
//   Settings,
//   User,
//   Bell,
//   Package,
//   DollarSign,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ThemeToggle } from "./theme-toggle";
// import { useAuth } from "@/context/auth-context";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// // Sample notification data
// const recentNotifications = [
//   {
//     id: 1,
//     type: "payment",
//     title: "Payment Received",
//     message: "Dr. Sharma paid ₹3,500",
//     time: "2 min ago",
//     icon: DollarSign,
//     color: "text-emerald-600",
//     bgColor: "bg-emerald-50",
//     read: false,
//   },
//   {
//     id: 2,
//     type: "stock",
//     title: "Low Stock Alert",
//     message: "Paracetamol - 50 tablets left",
//     time: "15 min ago",
//     icon: Package,
//     color: "text-amber-600",
//     bgColor: "bg-amber-50",
//     read: false,
//   },
//   {
//     id: 3,
//     type: "alert",
//     title: "Medicine Expiry",
//     message: "8 items expiring in 30 days",
//     time: "30 min ago",
//     icon: AlertCircle,
//     color: "text-red-600",
//     bgColor: "bg-red-50",
//     read: false,
//   },
// ];

// export const NavBar = () => {
//   const [search, setSearch] = useState("");
//   const { logout } = useAuth();
//   const router = useRouter();

//   const unreadCount = recentNotifications.filter((n) => !n.read).length;

//   const handleLogout = () => {
//     logout();
//   };

//   const handleProfile = () => {
//     router.push("/profile");
//   };

//   const handleViewNotification = () => {
//     router.push("/notification");
//   };

//   const clearSearch = () => {
//     setSearch("");
//   };

//   return (
//     <div className="flex items-center justify-end flex-1 gap-4 lg:gap-10">
//       {/* 🔍 Enhanced Search */}
//       <div className="relative w-full max-w-md">
//         <div className="relative rounded-lg border bg-background shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search medicines, customers..."
//             className="pl-9 pr-9 border-0 focus-visible:ring-0 h-10"
//           />
//           {search && (
//             <button
//               onClick={clearSearch}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 👉 Right Section */}
//       <div className="flex items-center gap-2 lg:gap-3">
//         {/* 🌗 Dark Mode Toggle */}
//         <Button variant="outline" size="icon" className="h-9 w-9 shadow-sm">
//           <ThemeToggle />
//         </Button>

//         {/* 🔔 Enhanced Notifications */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon"
//               className="relative h-9 w-9 shadow-sm"
//             >
//               <Bell className="h-4 w-4" />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse shadow-lg">
//                   {unreadCount}
//                 </span>
//               )}
//             </Button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="end" className="w-80 p-0">
//             <div className="flex items-center justify-between p-4 border-b bg-muted/30">
//               <div>
//                 <h3 className="font-semibold text-sm">Notifications</h3>
//                 <p className="text-xs text-muted-foreground">
//                   You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
//                 </p>
//               </div>
//               {unreadCount > 0 && (
//                 <Badge variant="secondary" className="bg-blue-100 text-blue-700">
//                   {unreadCount} New
//                 </Badge>
//               )}
//             </div>

//             <div className="max-h-80 overflow-y-auto">
//               {recentNotifications.length > 0 ? (
//                 recentNotifications.map((notification) => {
//                   const Icon = notification.icon;
//                   return (
//                     <DropdownMenuItem
//                       key={notification.id}
//                       className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0"
//                     >
//                       <div className="flex gap-3 w-full">
//                         <div className={`p-2 rounded-lg ${notification.bgColor} flex-shrink-0`}>
//                           <Icon className={`h-4 w-4 ${notification.color}`} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between gap-2 mb-1">
//                             <p className="font-medium text-sm leading-tight">
//                               {notification.title}
//                             </p>
//                             {!notification.read && (
//                               <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
//                             )}
//                           </div>
//                           <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
//                             {notification.message}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {notification.time}
//                           </p>
//                         </div>
//                       </div>
//                     </DropdownMenuItem>
//                   );
//                 })
//               ) : (
//                 <div className="p-8 text-center">
//                   <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
//                   <p className="text-sm text-muted-foreground">
//                     No notifications yet
//                   </p>
//                 </div>
//               )}
//             </div>

//             <DropdownMenuSeparator className="m-0" />
//             <DropdownMenuItem
//               className="p-3 text-center text-sm font-medium text-primary cursor-pointer hover:bg-muted/50"
//               onClick={handleViewNotification}
//             >
//               View all notifications
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* 👤 Enhanced User Menu */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="h-9 px-2 shadow-sm hover:shadow-md transition-all"
//             >
//               <div className="flex items-center gap-2">
//                 <Avatar className="h-6 w-6">
//                   <AvatarImage src="/avatar.png" />
//                   <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
//                     AU
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="text-sm font-medium hidden lg:block">
//                   Admin User
//                 </span>
//               </div>
//             </Button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent align="end" className="w-56 p-2">
//             <DropdownMenuLabel className="p-3">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-semibold leading-none">Admin User</p>
//                 <p className="text-xs text-muted-foreground">
//                   admin@medtrax.in
//                 </p>
//               </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem
//               className="gap-3 p-3 cursor-pointer rounded-md"
//               onClick={handleProfile}
//             >
//               <div className="p-1.5 bg-blue-50 rounded-md">
//                 <User className="h-4 w-4 text-blue-600" />
//               </div>
//               <span>My Profile</span>
//             </DropdownMenuItem>

//             <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-md">
//               <div className="p-1.5 bg-purple-50 rounded-md">
//                 <Settings className="h-4 w-4 text-purple-600" />
//               </div>
//               <span>Settings</span>
//             </DropdownMenuItem>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem
//               className="gap-3 p-3 font-semibold text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-md"
//               onClick={handleLogout}
//             >
//               <div className="p-1.5 bg-red-50 rounded-md">
//                 <LogOut className="h-4 w-4" />
//               </div>
//               <span>Logout</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// };




"use client";
import { useState } from "react";
import {
  Search,
  CircleUser,
  LogOut,
  Settings,
  User,
  Bell,
  Package,
  DollarSign,
  AlertCircle,
  X,
  Clock,
  TrendingUp,
  Pill,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

// Sample notification data
const recentNotifications = [
  {
    id: 1,
    type: "payment",
    title: "Payment Received",
    message: "Dr. Sharma paid ₹3,500",
    time: "2 min ago",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    read: false,
  },
  {
    id: 2,
    type: "stock",
    title: "Low Stock Alert",
    message: "Paracetamol - 50 tablets left",
    time: "15 min ago",
    icon: Package,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Medicine Expiry",
    message: "8 items expiring in 30 days",
    time: "30 min ago",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    read: false,
  },
];

// Sample search results
const searchCategories = [
  {
    title: "Medicines",
    icon: Pill,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    items: [
      { id: 1, name: "Paracetamol 500mg", subtext: "Stock: 150 tablets", price: "₹5/tablet" },
      { id: 2, name: "Amoxicillin 250mg", subtext: "Stock: 80 capsules", price: "₹12/capsule" },
      { id: 3, name: "Cetirizine 10mg", subtext: "Stock: 200 tablets", price: "₹3/tablet" },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    items: [
      { id: 4, name: "Dr. Rajesh Sharma", subtext: "Phone: +91 98765 43210", price: "₹15,000 pending" },
      { id: 5, name: "City Hospital", subtext: "Phone: +91 98765 43211", price: "₹25,000 pending" },
    ],
  },
  {
    title: "Recent Orders",
    icon: FileText,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    items: [
      { id: 6, name: "Invoice #INV-2024-1234", subtext: "Dr. Sharma - Today", price: "₹3,500" },
      { id: 7, name: "Invoice #INV-2024-1233", subtext: "City Hospital - Yesterday", price: "₹12,000" },
    ],
  },
];

const recentSearches = [
  "Paracetamol",
  "Dr. Sharma",
  "Invoice #INV-2024-1234",
  "Insulin",
];

export const NavBar = () => {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const unreadCount = recentNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleViewNotification = () => {
    router.push("/notification");
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearch("");
  };

  return (
    <>
      <div className="flex items-center justify-end flex-1 gap-4 lg:gap-10">
        {/* 🔍 Enhanced Search - Click to open modal */}
        <div className="relative w-full max-w-md">
          <div
            onClick={handleSearchClick}
            className="relative rounded-lg border bg-background shadow-sm cursor-pointer hover:border-primary/50 transition-all"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value=""
              readOnly
              placeholder="Search medicines, customers... (Ctrl+K)"
              className="pl-9 border-0 focus-visible:ring-0 h-10 cursor-pointer"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* 👉 Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* 🌗 Dark Mode Toggle */}
          <Button variant="outline" size="icon" className="h-9 w-9 shadow-sm">
            <ThemeToggle />
          </Button>

          {/* 🔔 Enhanced Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-9 w-9 shadow-sm"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div>
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {unreadCount} New
                  </Badge>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-0"
                      >
                        <div className="flex gap-3 w-full">
                          <div className={`p-2 rounded-lg ${notification.bgColor} flex-shrink-0`}>
                            <Icon className={`h-4 w-4 ${notification.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-medium text-sm leading-tight">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>

              <DropdownMenuSeparator className="m-0" />
              <DropdownMenuItem
                className="p-3 text-center text-sm font-medium text-primary cursor-pointer hover:bg-muted/50"
                onClick={handleViewNotification}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 👤 Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-2 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      AU
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden lg:block">
                    Admin User
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@medtrax.in
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-3 p-3 cursor-pointer rounded-md"
                onClick={handleProfile}
              >
                <div className="p-1.5 bg-blue-50 rounded-md">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span>My Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-md">
                <div className="p-1.5 bg-purple-50 rounded-md">
                  <Settings className="h-4 w-4 text-purple-600" />
                </div>
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-3 p-3 font-semibold text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-md"
                onClick={handleLogout}
              >
                <div className="p-1.5 bg-red-50 rounded-md">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🔍 Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0">
          <DialogHeader className="p-4 pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines, customers, orders..."
                className="pl-11 pr-10 h-12 text-base border-0 focus-visible:ring-0 bg-muted/30"
                autoFocus
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[500px]">
            {!search ? (
              // Recent Searches
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Recent Searches
                  </h3>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSearch(item)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Search Results
              <div className="p-4 space-y-6">
                {searchCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.title}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-md ${category.bgColor}`}>
                          <CategoryIcon className={`h-4 w-4 ${category.color}`} />
                        </div>
                        <h3 className="text-sm font-semibold">
                          {category.title}
                        </h3>
                        <Badge variant="secondary" className="ml-auto">
                          {category.items.length}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={handleSearchClose}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm mb-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.subtext}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-sm font-semibold text-muted-foreground">
                                {item.price}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* No Results */}
                {search.length > 2 && searchCategories.every(cat => cat.items.length === 0) && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">No results found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-3 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                    ↑↓
                  </kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                    ↵
                  </kbd>
                  <span>to select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  esc
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};