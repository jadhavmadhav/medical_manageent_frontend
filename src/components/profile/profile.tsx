


// "use client";

// import { useState } from "react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import {
//   BadgeCheck,
//   Camera,
//   CheckCircle2,
//   Lock,
//   Mail,
//   Pencil,
//   Phone,
//   Save,
//   ShieldCheck,
//   User,
//   X,
// } from "lucide-react";

// const BRAND = "#00BFA5";
// const BRAND_DARK = "#00a896";

// const ProfileView = () => {
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "Admin User",
//     email: "admin@medtrax.in",
//     mobile: "9876543210",
//     role: "Administrator",
//   });

//   const handleSave = () => {
//     console.log("Saved Profile:", formData);
//     setIsEditing(false);
//   };

//   return (
//     <div className="min-h-full">
//       <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">

//         {/* ================= HEADER ================= */}
//         <Card className="border-0 shadow-lg">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//               <div className="flex items-center gap-5">
//                 {/* Avatar */}
//                 <div className="relative group">
//                   <Avatar className="h-28 w-28 border-4 border-white shadow">
//                     <AvatarImage src="/avatar.png" />
//                     <AvatarFallback
//                       className="text-white text-2xl font-semibold"
//                       style={{ backgroundColor: BRAND }}
//                     >
//                       {formData.name.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>

//                   {isEditing && (
//                     <button
//                       type="button"
//                       onClick={() => alert("Upload avatar")}
//                       className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                     >
//                       <Camera className="h-6 w-6 text-white mb-1" />
//                       <span className="text-xs text-white">Upload</span>
//                     </button>
//                   )}
//                 </div>

//                 {/* User Info */}
//                 <div>
//                   <h1 className="text-2xl font-bold">{formData.name}</h1>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span
//                       className="flex items-center gap-1 px-3 py-1 rounded-full text-sm border"
//                       style={{
//                         backgroundColor: "#e6f7f4",
//                         color: BRAND,
//                         borderColor: BRAND,
//                       }}
//                     >
//                       <BadgeCheck className="h-4 w-4" />
//                       {formData.role}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Edit Button */}
//               <Button
//                 variant={isEditing ? "outline" : "default"}
//                 onClick={() => setIsEditing(!isEditing)}
//                 className={!isEditing ? "text-white" : ""}
//                 style={
//                   !isEditing
//                     ? {
//                       background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
//                     }
//                     : {}
//                 }
//               >
//                 {isEditing ? (
//                   <>
//                     <X className="h-4 w-4 mr-2" />
//                     Cancel
//                   </>
//                 ) : (
//                   <>
//                     <Pencil className="h-4 w-4 mr-2" />
//                     Edit Profile
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ================= CONTENT ================= */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* ========= PERSONAL INFO ========= */}
//           <Card className="lg:col-span-2 border-0 shadow-md">
//             <CardContent className="p-6 space-y-6">
//               <h2 className="text-xl font-semibold flex items-center gap-2">
//                 <User className="h-5 w-5" style={{ color: BRAND }} />
//                 Personal Information
//               </h2>

//               <Separator />

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSave();
//                 }}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-5"
//               >
//                 {/* Name */}
//                 <div>
//                   <Label>Full Name</Label>
//                   <Input
//                     value={formData.name}
//                     disabled={!isEditing}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <Label className="flex items-center gap-1">
//                     Email
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                   </Label>
//                   <Input value={formData.email} disabled />
//                 </div>

//                 {/* Mobile */}
//                 <div>
//                   <Label className="flex items-center gap-1">
//                     Mobile
//                     <CheckCircle2 className="h-4 w-4 text-green-500" />
//                   </Label>
//                   <Input
//                     value={formData.mobile}
//                     disabled={!isEditing}
//                     onChange={(e) =>
//                       setFormData({ ...formData, mobile: e.target.value })
//                     }
//                   />
//                 </div>

//                 {/* Role */}
//                 <div>
//                   <Label>Role</Label>
//                   <Input value={formData.role} disabled />
//                 </div>

//                 {isEditing && (
//                   <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setIsEditing(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       type="submit"
//                       className="text-white"
//                       style={{
//                         background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
//                       }}
//                     >
//                       <Save className="h-4 w-4 mr-2" />
//                       Save Changes
//                     </Button>
//                   </div>
//                 )}
//               </form>
//             </CardContent>
//           </Card>

//           {/* ========= SECURITY ========= */}
//           <div className="space-y-6">
//             <Card className="border-0 shadow-md">
//               <CardContent className="p-6 space-y-4">
//                 <h2 className="text-lg font-semibold flex items-center gap-2">
//                   <ShieldCheck className="h-5 w-5" style={{ color: BRAND }} />
//                   Security
//                 </h2>

//                 <Separator />

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
//                     <span className="flex items-center gap-2">
//                       <Mail className="h-4 w-4" /> Email Verified
//                     </span>
//                     <CheckCircle2 className="text-green-600" />
//                   </div>

//                   <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
//                     <span className="flex items-center gap-2">
//                       <Phone className="h-4 w-4" /> Mobile Verified
//                     </span>
//                     <CheckCircle2 className="text-green-600" />
//                   </div>
//                 </div>

//                 <Button variant="outline" className="w-full mt-3">
//                   <Lock className="h-4 w-4 mr-2" />
//                   Change Password
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* ========= STATUS ========= */}
//             <Card
//               className="border-0 shadow-md text-white"
//               style={{
//                 background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
//               }}
//             >
//               <CardContent className="p-6 space-y-3">
//                 <h3 className="text-lg font-semibold">Account Status</h3>
//                 <div className="flex justify-between">
//                   <span>Profile Complete</span>
//                   <span className="font-bold">100%</span>
//                 </div>
//                 <div className="w-full bg-white/30 h-2 rounded-full">
//                   <div className="h-2 bg-white rounded-full w-full" />
//                 </div>
//                 <p className="text-xs opacity-90">
//                   Your account is fully verified and secure.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileView;


















"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  Lock,
  Mail,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { AvatarUploadModal } from "./avatar-upload-modal";
import { ChangePasswordModal } from "./change-password-modal";
 

const BRAND = "#00BFA5";
const BRAND_DARK = "#00a896";

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@medtrax.in",
    mobile: "9876543210",
    role: "Administrator",
  });

  const handleSave = () => {
    console.log("Saved profile:", formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* Avatar + Info */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-white shadow">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback
                      className="text-white text-2xl font-semibold"
                      style={{ backgroundColor: BRAND }}
                    >
                      {formData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setOpenAvatar(true)}
                      className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <Camera className="h-6 w-6 text-white mb-1" />
                      <span className="text-xs text-white">Upload</span>
                    </button>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{formData.name}</h1>
                  <span
                    className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-sm border"
                    style={{
                      backgroundColor: "#e6f7f4",
                      color: BRAND,
                      borderColor: BRAND,
                    }}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {formData.role}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className={!isEditing ? "text-white" : ""}
                style={
                  !isEditing
                    ? {
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                      }
                    : {}
                }
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ========= PERSONAL INFO ========= */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" style={{ color: BRAND }} />
                Personal Information
              </h2>

              <Separator />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Name */}
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="flex items-center gap-1">
                    Email
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Label>
                  <Input value={formData.email} disabled />
                </div>

                {/* Mobile */}
                <div>
                  <Label className="flex items-center gap-1">
                    Mobile
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Label>
                  <Input
                    value={formData.mobile}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                  />
                </div>

                {/* Role */}
                <div>
                  <Label>Role</Label>
                  <Input value={formData.role} disabled />
                </div>

                {isEditing && (
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="text-white"
                      style={{
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* ========= RIGHT SIDE ========= */}
          <div className="space-y-6">

            {/* Security */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" style={{ color: BRAND }} />
                  Security
                </h2>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Verified
                    </span>
                    <CheckCircle2 className="text-green-600" />
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Mobile Verified
                    </span>
                    <CheckCircle2 className="text-green-600" />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setOpenPassword(true)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card
              className="border-0 shadow-md text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
              }}
            >
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-semibold">Account Status</h3>
                <div className="flex justify-between">
                  <span>Profile Complete</span>
                  <span className="font-bold">100%</span>
                </div>
                <div className="w-full bg-white/30 h-2 rounded-full">
                  <div className="h-2 bg-white rounded-full w-full" />
                </div>
                <p className="text-xs opacity-90">
                  Your account is fully verified and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <ChangePasswordModal
        open={openPassword}
        onClose={() => setOpenPassword(false)}
      />

      <AvatarUploadModal
        open={openAvatar}
        onClose={() => setOpenAvatar(false)}
        currentName={formData.name}
      />
    </div>
  );
};

export default ProfileView;
