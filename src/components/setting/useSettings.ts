import { useState } from "react";

export const useSettings = () => {
  // Organization
  const [storeName, setStoreName] = useState("MedTrax Pharmacy");
  const [storeEmail, setStoreEmail] = useState("store@medtrax.com");
  const [storePhone, setStorePhone] = useState("+91 98765 43210");
  const [storeAddress, setStoreAddress] = useState(
    "123 Main Street, Mumbai, Maharashtra 400001"
  );
  const [gstNumber, setGstNumber] = useState("27AABCU9603R1ZM");
  const [licenseNumber, setLicenseNumber] = useState("MH-MUM-12345");

  // Billing
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(true);
  const [defaultDiscount, setDefaultDiscount] = useState("0");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(false);

  const saveOrganization = () => {
    console.log("Saving organization settings");
    // API call here
  };

  return {
    storeName,
    setStoreName,
    storeEmail,
    setStoreEmail,
    storePhone,
    setStorePhone,
    storeAddress,
    setStoreAddress,
    gstNumber,
    setGstNumber,
    licenseNumber,
    setLicenseNumber,

    autoInvoice,
    setAutoInvoice,
    gstEnabled,
    setGstEnabled,
    defaultDiscount,
    setDefaultDiscount,

    emailNotifications,
    setEmailNotifications,
    expiryAlerts,
    setExpiryAlerts,
    lowStockAlerts,
    setLowStockAlerts,
    paymentAlerts,
    setPaymentAlerts,

    saveOrganization,
  };
};
