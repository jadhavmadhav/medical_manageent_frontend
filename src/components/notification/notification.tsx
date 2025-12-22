 "use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  AlertCircle,
  DollarSign,
  CreditCard,
  ShoppingCart,
  TrendingDown,
  Clock,
  UserCheck,
  PackageCheck,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Enhanced notification data with more types
const notificationsData = [
  {
    id: 1,
    category: "payment",
    type: "customer_payment",
    title: "Payment Received",
    message: "Ramesh Kumar paid ₹15,000 for Invoice #INV-2024-001",
    amount: "₹15,000",
    amountType: "credit",
    customer: "Ramesh Kumar",
    time: "2 minutes ago",
    read: false,
    priority: "high",
    icon: DollarSign,
    color: "emerald",
  },
  {
    id: 2,
    category: "payment",
    type: "supplier_payment",
    title: "Supplier Payment Due",
    message: "Payment of ₹45,000 due to Mahalaxmi Seeds & Fertilizers",
    amount: "₹45,000",
    amountType: "debit",
    supplier: "Mahalaxmi Seeds",
    dueDate: "Tomorrow",
    time: "15 minutes ago",
    read: false,
    priority: "high",
    icon: CreditCard,
    color: "red",
  },
  {
    id: 3,
    category: "pending",
    type: "customer_pending",
    title: "Pending Payment Alert",
    message: "Suresh Patil has ₹8,500 pending payment overdue by 5 days",
    amount: "₹8,500",
    amountType: "pending",
    customer: "Suresh Patil",
    overdueBy: "5 days",
    time: "1 hour ago",
    read: false,
    priority: "medium",
    icon: Clock,
    color: "orange",
  },
  {
    id: 4,
    category: "stock",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Urea Fertilizer (50kg) - Only 8 bags remaining",
    product: "Urea Fertilizer 50kg",
    quantity: "8 bags",
    threshold: "10 bags",
    time: "2 hours ago",
    read: false,
    priority: "high",
    icon: TrendingDown,
    color: "amber",
  },
  {
    id: 5,
    category: "stock",
    type: "out_of_stock",
    title: "Out of Stock",
    message: "BT Cotton Seeds - Completely out of stock",
    product: "BT Cotton Seeds",
    time: "3 hours ago",
    read: false,
    priority: "critical",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 6,
    category: "purchase",
    type: "new_purchase",
    title: "New Purchase Order",
    message: "Purchase order #PO-2024-156 created for ₹1,25,000",
    amount: "₹1,25,000",
    poNumber: "PO-2024-156",
    supplier: "Jain Irrigation",
    time: "4 hours ago",
    read: true,
    priority: "medium",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    id: 7,
    category: "purchase",
    type: "purchase_delivered",
    title: "Purchase Delivered",
    message: "Order #PO-2024-152 delivered successfully. 50 items received.",
    poNumber: "PO-2024-152",
    items: "50 items",
    time: "5 hours ago",
    read: true,
    priority: "low",
    icon: PackageCheck,
    color: "emerald",
  },
  {
    id: 8,
    category: "stock",
    type: "expiry_alert",
    title: "Product Expiry Warning",
    message: "12 items expiring in next 7 days. Review inventory now.",
    expiringItems: "12 items",
    expiryDate: "7 days",
    time: "6 hours ago",
    read: true,
    priority: "medium",
    icon: Calendar,
    color: "purple",
  },
  {
    id: 9,
    category: "pending",
    type: "supplier_pending",
    title: "Overdue Supplier Payment",
    message: "Payment to Krishna Traders overdue by 3 days - ₹22,000",
    amount: "₹22,000",
    supplier: "Krishna Traders",
    overdueBy: "3 days",
    time: "1 day ago",
    read: true,
    priority: "high",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 10,
    category: "payment",
    type: "customer_payment",
    title: "Partial Payment Received",
    message: "Vijay Agro paid ₹5,000 (Partial) for Invoice #INV-2024-089",
    amount: "₹5,000",
    amountType: "credit",
    customer: "Vijay Agro",
    time: "1 day ago",
    read: true,
    priority: "low",
    icon: DollarSign,
    color: "emerald",
  },
];

const NotificationView = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeTab, setActiveTab] = useState<string>("all");
  const observerRefs = useRef<Map<number, IntersectionObserver>>(new Map());

  // Cleanup observers on unmount
  useEffect(() => {
    return () => {
      observerRefs.current.forEach((observer) => observer.disconnect());
      observerRefs.current.clear();
    };
  }, []);

  // Create intersection observer for a notification
  const createObserver = (id: number) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Mark as read when notification enters viewport
            const notification = notifications.find((n) => n.id === id);
            if (notification && !notification.read) {
              // Delay marking as read by 1 second to ensure user sees it
              setTimeout(() => {
                markAsRead(id);
              }, 1000);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of notification is visible
        rootMargin: "0px",
      }
    );

    return observer;
  };

  // Callback ref for notification cards
  const notificationRef = (element: HTMLDivElement | null, id: number) => {
    if (!element) {
      // Cleanup observer if element is removed
      const observer = observerRefs.current.get(id);
      if (observer) {
        observer.disconnect();
        observerRefs.current.delete(id);
      }
      return;
    }

    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.read) {
      return; // Don't observe if already read
    }

    // Create new observer for this notification
    const observer = createObserver(id);
    observer.observe(element);
    observerRefs.current.set(id, observer);
  };

  const categories = [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: notifications.filter(n => !n.read).length },
    { value: "payment", label: "Payments", count: notifications.filter(n => n.category === "payment").length },
    { value: "pending", label: "Pending", count: notifications.filter(n => n.category === "pending").length },
    { value: "stock", label: "Stock Alerts", count: notifications.filter(n => n.category === "stock").length },
    { value: "purchase", label: "Purchases", count: notifications.filter(n => n.category === "purchase").length },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.category === activeTab;
  });

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    
    // Cleanup observer after marking as read
    const observer = observerRefs.current.get(id);
    if (observer) {
      observer.disconnect();
      observerRefs.current.delete(id);
    }
  };

  const toggleRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getColorClasses = (color: string, variant: "bg" | "text" | "border" | "hover") => {
    const colors: any = {
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-100",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        hover: "hover:bg-red-100",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        hover: "hover:bg-orange-100",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        hover: "hover:bg-amber-100",
      },
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-100",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-100",
      },
    };
    return colors[color]?.[variant] || "";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: "bg-red-100 text-red-700 border-red-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      medium: "bg-blue-100 text-blue-700 border-blue-300",
      low: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Modern Header */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20"></div>
          <Card className="relative border-0 shadow-2xl  backdrop-blur-xl overflow-hidden">
            <CardContent className="relative p-6 md:p-2 md:px-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-primary to-primary/0 p-4 rounded-2xl shadow-xl">
                      <Bell className="h-8 w-8 text-white" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text ">
                      Notifications
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">
                      {unreadCount > 0 
                        ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                        : "You're all caught up!"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllAsRead}
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Card className="border-0 shadow-lg bg-secondary  backdrop-blur-sm">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-6 gap-2  p-1.5 h-auto rounded-xl">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 px-4 text-sm font-medium transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.label}</span>
                      <Badge className="bg-gray-200 text-gray-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 h-5 min-w-5 flex items-center justify-center text-xs px-2">
                        {cat.count}
                      </Badge>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="border-0 shadow-lg  backdrop-blur-sm">
              <CardContent className="p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                    <Bell className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-foreground mb-3">
                    No Notifications
                  </h3>
                  <p className="text-muted-foreground max-w-md text-lg">
                    No notifications in this category. You'll be notified here when something important happens.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  ref={(el) => notificationRef(el, notification.id)}
                  className={`border-0 shadow-md hover:shadow-xl transition-all duration-300 group ${
                    !notification.read
                      ? "bg-gradient-to-r from-blue-50 via-purple-50/50 to-pink-50/30 ring-2 ring-blue-200/50"
                      : " backdrop-blur-sm"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Icon with gradient background */}
                      <div className="flex-shrink-0">
                        <div className={`p-3.5 rounded-2xl ${getColorClasses(notification.color, "bg")} ${getColorClasses(notification.color, "border")} border-2 shadow-sm`}>
                          <Icon className={`h-6 w-6 ${getColorClasses(notification.color, "text")}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <span className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
                              )}
                            </h3>
                            <Badge className={`${getPriorityBadge(notification.priority)} border text-xs px-2 py-0.5`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3 text-base leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Meta Information Cards */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {notification.amount && (
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                              notification.amountType === "credit" 
                                ? "bg-emerald-50 border border-emerald-200"
                                : notification.amountType === "debit"
                                ? "bg-red-50 border border-red-200"
                                : "bg-orange-50 border border-orange-200"
                            }`}>
                              {notification.amountType === "credit" ? (
                                <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`font-bold text-sm ${
                                notification.amountType === "credit"
                                  ? "text-emerald-700"
                                  : notification.amountType === "debit"
                                  ? "text-red-700"
                                  : "text-orange-700"
                              }`}>
                                {notification.amount}
                              </span>
                            </div>
                          )}
                          {notification.customer && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                              <UserCheck className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">{notification.customer}</span>
                            </div>
                          )}
                          {notification.supplier && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                              <Package className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-700">{notification.supplier}</span>
                            </div>
                          )}
                          {notification.overdueBy && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">Overdue: {notification.overdueBy}</span>
                            </div>
                          )}
                          {notification.product && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                              <Package className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-700">{notification.product}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleRead(notification.id)}
                            className={`h-9 gap-2 text-sm font-medium text-muted-foreground ${
                              !notification.read
                                ? "hover:bg-blue-50 hover:text-blue-700"
                                : "hover:bg-orange-50 hover:text-orange-700"
                            }`}
                          >
                            <CheckCheck className="h-4 w-4" />
                            {!notification.read ? "Mark as read" : "Mark as unread"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-9 gap-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 text-muted-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationView;