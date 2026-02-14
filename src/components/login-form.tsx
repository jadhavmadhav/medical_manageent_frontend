// "use client";

// import Image from "next/image";
// // import { LoginForm } from "@/components/login-form";
// import sideImage from "@/assets/heroImage.png"; // add your image here
// import { useState } from "react";
// import { useAuth } from "@/context/auth-context";
// import { Eye, EyeOff, Lock, LogIn, Phone } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import logo from "@/assets/MedTraxLogo.png"

// export default function LoginPage() {



//   const [credential, setCredential] = useState({
//     mobile_number: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();

//   const handleLogin = async () => {
//     setIsLoading(true);
//     try {
//       await login(credential);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && credential.mobile_number && credential.password) {
//       handleLogin();
//     }
//   };
//   return (
//     <div className="h-full grid lg:grid-cols-[2fr_1fr] bg-gradient-to-br from-primary to-primary/80">

//       {/* LEFT SIDE – IMAGE & DETAILS */}
//       <div className="hidden lg:flex flex-col justify-between  p-12 text-white">
//         <div className="relative  w-full h-full rounded-2xl overflow-hidden">
//           <Image
//             src={sideImage}
//             alt="Dashboard Preview"
//             fill
//             className="object-contain rounded-2xl"
//             priority
//           />
//         </div>
//         <p className="text-xs">
//           © {new Date().getFullYear()} MedTrax. All rights reserved.
//         </p>
//       </div>

//       {/* RIGHT SIDE – LOGIN */}
//       <div className="flex items-center justify-center p-6 sm:p-10 bg-background">

//         <div className={cn("flex flex-col gap-6")}>
//           <Card className="shadow-lg border-0">
//             <CardHeader className="space-y-2 text-center pb-6">
//               <div className="mx-auto w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-2">
//                 {/* <LogIn className="h-6 w-6 text-white" /> */}
//                 <div className="relative">
//                   <Image
//                     src={logo}
//                     alt="MedTrax Logo"
//                     className="w-12 h-12 object-contain"
//                   />
//                 </div>
//               </div>
//               <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
//               <CardDescription className="text-base">
//                 Sign in to access your account
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <div className="flex flex-col gap-5">
//                 {/* Mobile Number Field */}
//                 <div className="grid gap-2">
//                   <Label htmlFor="mobile" className="text-sm font-medium">
//                     Mobile Number
//                   </Label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="mobile"
//                       type="tel"
//                       placeholder="Enter your mobile number"
//                       maxLength={10}
//                       className="pl-10 h-11"
//                       value={credential.mobile_number}
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/\D/g, "");
//                         setCredential({
//                           ...credential,
//                           mobile_number: value,
//                         });
//                       }}
//                       onKeyPress={handleKeyPress}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="grid gap-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password" className="text-sm font-medium">
//                       Password
//                     </Label>
//                     <a
//                       href="#"
//                       className="text-xs text-primary underline-offset-4 hover:underline font-medium"
//                     >
//                       Forgot password?
//                     </a>
//                   </div>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       className="pl-10 pr-10 h-11"
//                       value={credential.password}
//                       onChange={(e) => {
//                         setCredential({
//                           ...credential,
//                           password: e.target.value,
//                         });
//                       }}
//                       onKeyPress={handleKeyPress}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Login Button */}
//                 <Button
//                   variant="outline"
//                   className="w-full h-11 bg-secondary text-white font-medium shadow-md hover:shadow-lg transition-all mt-2"
//                   onClick={handleLogin}
//                   disabled={
//                     !credential.mobile_number ||
//                     !credential.password ||
//                     isLoading
//                   }
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center gap-2">
//                       <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Signing in...
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <LogIn className="h-4 w-4" />
//                       Sign In
//                     </div>
//                   )}
//                 </Button>

//                 {/* Divider - Optional for future OAuth */}
//                 {/* <div className="relative my-2">
//                <div className="absolute inset-0 flex items-center">
//                  <span className="w-full border-t" />
//                </div>
//                <div className="relative flex justify-center text-xs uppercase">
//                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
//                </div>
//              </div> */}

//                 {/* Social Login - Optional */}
//                 {/* <Button variant="outline" className="w-full h-11">
//                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                  <path
//                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                    fill="#4285F4"
//                  />
//                  <path
//                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                    fill="#34A853"
//                  />
//                  <path
//                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                    fill="#FBBC05"
//                  />
//                  <path
//                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                    fill="#EA4335"
//                  />
//                </svg>
//                Continue with Google
//              </Button> */}
//               </div>

//               {/* Sign Up Link */}
//               <div className="mt-6 text-center text-sm">
//                 Don't have an account?{" "}
//                 <a
//                   href="#"
//                   className="font-medium text-primary underline-offset-4 hover:underline"
//                 >
//                   Sign up
//                 </a>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Optional: Info Footer */}
//           <p className="text-center text-xs px-8">
//             By signing in, you agree to our{" "}
//             <a href="#" className="underline">
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a href="#" className="underline">
//               Privacy Policy
//             </a>
//           </p>
//         </div>




//       </div>

//     </div>
//   );
// }




"use client";

import Image from "next/image";
import { useState, useCallback, memo, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Eye, EyeOff, Lock, Phone, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import sideImage from "@/assets/heroImage.png";
import logo from "@/assets/MedTraxLogo.png";

// Animated background particles
const FloatingParticles = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: Math.random() * 100 + 50 + "px",
            height: Math.random() * 100 + 50 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = "FloatingParticles";

// Modern Hero Section
const HeroSection = memo(() => (
  <div className="relative h-full flex flex-col justify-between p-12 overflow-hidden">
    <FloatingParticles />

    {/* Content */}
    <div className="relative z-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span className="text-sm font-medium text-white">Healthcare Financial Excellence</span>
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight">
          Streamline Your
          <br />
          <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Medical Billing
          </span>
        </h1>
        <p className="text-lg text-white/80 max-w-md">
          Powerful analytics, seamless claims management, and intelligent automation
          for modern healthcare providers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 max-w-lg">
        {[
          { value: "99.8%", label: "Claim Accuracy" },
          { value: "40%", label: "Faster Processing" },
          { value: "24/7", label: "Support Available" },
        ].map((stat, i) => (
          <div
            key={i}
            className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${i * 100 + 300}ms` }}
          >
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/60">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Image */}
    <div className="relative w-full h-[400px] mt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
      <Image
        src={sideImage}
        alt="Medical billing dashboard preview"
        fill
        className="object-contain rounded-2xl"
        priority
        quality={90}
      />
    </div>

    {/* Footer */}
    <p className="relative z-10 text-xs text-white/60 animate-in fade-in duration-1000 delay-500">
      © {new Date().getFullYear()} MedTrax. All rights reserved.
    </p>

    <style jsx>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0) scale(1);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-20px) translateX(10px) scale(1.1);
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
));
HeroSection.displayName = "HeroSection";

// Modern Logo with animation
const Logo = memo(() => (
  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-3 shadow-lg animate-in zoom-in duration-500">
    <Image
      src={logo}
      alt="MedTrax Logo"
      className="w-12 h-12 object-contain"
      priority
    />
  </div>
));
Logo.displayName = "Logo";

export default function LoginPage() {
  const [credential, setCredential] = useState({
    mobile_number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { login, isPending, isLoggedIn } = useAuth();

  console.log("isPending", { isPending, isLoggedIn })

  useEffect(() => {
    setMounted(true);
  }, []);

  const isValidMobileNumber = useCallback((number: string) => {
    return /^\d{10}$/.test(number);
  }, []);

  const isFormValid = useCallback(() => {
    return (
      isValidMobileNumber(credential.mobile_number) &&
      credential.password.length >= 6
    );
  }, [credential, isValidMobileNumber]);

  const handleLogin = useCallback(async () => {
    if (!isFormValid()) {
      setError("Please enter valid credentials");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(credential);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }, [credential, login, isFormValid]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isFormValid() && !isLoading) {
        handleLogin();
      }
    },
    [handleLogin, isFormValid, isLoading]
  );

  const handleMobileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setCredential((prev) => ({ ...prev, mobile_number: value }));
      if (error) setError("");
    },
    [error]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredential((prev) => ({ ...prev, password: e.target.value }));
      if (error) setError("");
    },
    [error]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.2fr_1fr] bg-gradient-to-br from-primary via-primary/95 to-primary/80">
      {/* LEFT SIDE – HERO */}
      <div className="hidden lg:block text-white">
        <HeroSection />
      </div>

      {/* RIGHT SIDE – LOGIN */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div
          className={cn(
            "relative z-10 w-full max-w-md transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10 pointer-events-none" />

            <CardHeader className="space-y-3 text-center pb-8 pt-10 relative">
              <Logo />
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Sign in to your MedTrax dashboard
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pb-8 px-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-6"
              >
                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 border-red-200"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Mobile Number Field */}
                <div className="space-y-2 group">
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter your 10-digit number"
                      maxLength={10}
                      className={cn(
                        "h-12 pl-4 pr-4 text-base transition-all duration-300 border-2",
                        "focus:border-primary focus:ring-4 focus:ring-primary/10",
                        "bg-white/50 backdrop-blur-sm",
                        credential.mobile_number.length > 0 &&
                          !isValidMobileNumber(credential.mobile_number)
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      value={credential.mobile_number}
                      onChange={handleMobileChange}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading || isPending}
                      aria-describedby="mobile-error"
                      autoComplete="tel"
                      required
                    />
                    {credential.mobile_number.length === 10 &&
                      isValidMobileNumber(credential.mobile_number) && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                  </div>
                  {credential.mobile_number.length > 0 &&
                    !isValidMobileNumber(credential.mobile_number) && (
                      <p
                        id="mobile-error"
                        className="text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Please enter a valid 10-digit number
                      </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "h-12 pl-4 pr-12 text-base transition-all duration-300 border-2",
                        "focus:border-primary focus:ring-4 focus:ring-primary/10",
                        "bg-white/50 backdrop-blur-sm",
                        "border-gray-200 hover:border-gray-300"
                      )}
                      value={credential.password}
                      onChange={handlePasswordChange}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading || isPending}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading || isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all duration-300",
                    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                    "shadow-lg hover:shadow-xl hover:shadow-primary/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "group relative overflow-hidden"
                  )}
                  disabled={!isFormValid() || isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading||isPending ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      New to MedTrax?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-3 py-2"
                  >
                    Create your account
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6 px-8 animate-in fade-in duration-700 delay-300">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="underline hover:text-gray-700 transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}