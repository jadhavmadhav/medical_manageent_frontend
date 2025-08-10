"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isLoggedIn ? "/dashboard" : "/login");
  }, [isLoggedIn, router]);

  return null;
}
