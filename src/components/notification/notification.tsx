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
  Pill,
  Activity,
  FileText,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Thermometer,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Medical store notification data
const notificationsData = [
  {
    id: 1,
    category: "payment",
    type: "customer_payment",
    title: "Payment Received",
    message: "Dr. Sharma paid ₹3,500 for Invoice #INV-2024-1234",
    amount: "₹3,500",
    amountType: "credit",
    customer: "Dr. Sharma",
    time: "2 minutes ago",
    read: false,
    priority: "high",
    icon: DollarSign,
    color: "emerald",
  },
  {
    id: 2,
    category: "stock",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Paracetamol 500mg - Only 50 tablets remaining",
    product: "Paracetamol 500mg",
    quantity: "50 tablets",
    threshold: "100 tablets",
    time: "15 minutes ago",
    read: false,
    priority: "high",
    icon: TrendingDown,
    color: "amber",
  },
  {
    id: 3,
    category: "stock",
    type: "expiry_alert",
    title: "Medicine Expiry Alert",
    message: "8 medicines expiring within 30 days. Review stock immediately.",
    expiringItems: "8 medicines",
    expiryDate: "30 days",
    time: "30 minutes ago",
    read: false,
    priority: "critical",
    icon: Calendar,
    color: "red",
  },
  {
    id: 4,
    category: "pending",
    type: "customer_pending",
    title: "Pending Payment",
    message: "City Hospital has ₹25,000 pending for last month's supplies",
    amount: "₹25,000",
    amountType: "pending",
    customer: "City Hospital",
    overdueBy: "7 days",
    time: "1 hour ago",
    read: false,
    priority: "medium",
    icon: Clock,
    color: "orange",
  },
  {
    id: 5,
    category: "purchase",
    type: "new_purchase",
    title: "New Purchase Order",
    message: "Purchase order #PO-2024-456 created for ₹85,000 from Sun Pharma",
    amount: "₹85,000",
    poNumber: "PO-2024-456",
    supplier: "Sun Pharma",
    time: "2 hours ago",
    read: false,
    priority: "medium",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    id: 6,
    category: "stock",
    type: "out_of_stock",
    title: "Out of Stock",
    message: "Insulin Injection 100IU - Completely out of stock",
    product: "Insulin Injection 100IU",
    time: "3 hours ago",
    read: false,
    priority: "critical",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 7,
    category: "payment",
    type: "supplier_payment",
    title: "Supplier Payment Due",
    message: "Payment of ₹1,20,000 due to Cipla Pharmaceuticals tomorrow",
    amount: "₹1,20,000",
    amountType: "debit",
    supplier: "Cipla Pharmaceuticals",
    dueDate: "Tomorrow",
    time: "4 hours ago",
    read: true,
    priority: "high",
    icon: CreditCard,
    color: "red",
  },
  {
    id: 8,
    category: "purchase",
    type: "purchase_delivered",
    title: "Medicine Stock Delivered",
    message: "Order #PO-2024-445 delivered. 120 items received and verified.",
    poNumber: "PO-2024-445",
    items: "120 items",
    time: "5 hours ago",
    read: true,
    priority: "low",
    icon: PackageCheck,
    color: "emerald",
  },
  {
    id: 9,
    category: "stock",
    type: "prescription_alert",
    title: "Prescription Medicine Alert",
    message: "Schedule H drug dispensed: Alprazolam 0.5mg - Customer ID: C-4567",
    product: "Alprazolam 0.5mg",
    customer: "Customer C-4567",
    time: "6 hours ago",
    read: true,
    priority: "medium",
    icon: FileText,
    color: "purple",
  },
  {
    id: 10,
    category: "pending",
    type: "supplier_pending",
    title: "Overdue Supplier Payment",
    message: "Payment to Mankind Pharma overdue by 5 days - ₹45,000",
    amount: "₹45,000",
    supplier: "Mankind Pharma",
    overdueBy: "5 days",
    time: "1 day ago",
    read: true,
    priority: "high",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: 11,
    category: "stock",
    type: "cold_storage",
    title: "Cold Storage Temperature Alert",
    message: "Refrigerator temperature at 12°C. Required: 2-8°C. Check immediately!",
    temperature: "12°C",
    time: "1 day ago",
    read: true,
    priority: "critical",
    icon: Thermometer,
    color: "red",
  },
  {
    id: 12,
    category: "payment",
    type: "customer_payment",
    title: "Insurance Claim Approved",
    message: "Insurance claim #CLM-2024-789 approved - ₹18,500 to be credited",
    amount: "₹18,500",
    amountType: "credit",
    customer: "Health Insurance Co.",
    time: "2 days ago",
    read: true,
    priority: "low",
    icon: CheckCircle,
    color: "emerald",
  },
  {
    id: 13,
    category: "stock",
    type: "batch_recall",
    title: "Batch Recall Notice",
    message: "Urgent: Batch #BT-4567 of Antibiotic XYZ recalled by manufacturer",
    product: "Antibiotic XYZ",
    batchNumber: "BT-4567",
    time: "2 days ago",
    read: true,
    priority: "critical",
    icon: AlertCircle,
    color: "red",
  },
  {
    id: 14,
    category: "purchase",
    type: "order_delayed",
    title: "Purchase Order Delayed",
    message: "Order #PO-2024-432 from Zydus delayed. New ETA: 3 days",
    poNumber: "PO-2024-432",
    supplier: "Zydus Cadila",
    time: "3 days ago",
    read: true,
    priority: "medium",
    icon: Truck,
    color: "orange",
  },
  {
    id: 15,
    category: "stock",
    type: "high_demand",
    title: "High Demand Alert",
    message: "Cough Syrup sales increased by 200% in last 7 days. Consider restocking.",
    product: "Cough Syrup",
    trend: "+200%",
    time: "3 days ago",
    read: true,
    priority: "medium",
    icon: Activity,
    color: "blue",
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
          <Card className="relative border-0 shadow-2xl backdrop-blur-xl overflow-hidden">
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
                    <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
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
        <Card className="border-0 shadow-lg bg-secondary backdrop-blur-sm">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-6 gap-2 p-1.5 h-auto rounded-xl">
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
            <Card className="border-0 shadow-lg backdrop-blur-sm">
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
                      : "backdrop-blur-sm"
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
                              <Pill className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-700">{notification.product}</span>
                            </div>
                          )}
                          {notification.batchNumber && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                              <Package className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">Batch: {notification.batchNumber}</span>
                            </div>
                          )}
                          {notification.temperature && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                              <Thermometer className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">Temp: {notification.temperature}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleRead(notification.id)}
                            className={`h-9 gap-2 text-sm font-medium text-muted-foreground transition-colors ${
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
                            className="h-9 gap-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 text-muted-foreground transition-colors"
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