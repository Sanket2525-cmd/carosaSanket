"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Home from "@/components/home/Home";
import HomeLayout from "@/components/layout/HomeLayout";
// import AuthTest from "@/components/AuthTest";

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

 useEffect(() => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    // Redirect only if NOT already on dealer-dashboard
    if (
      currentPath === "/" &&
      isAuthenticated &&
      user?.role !== "Dealer"
    ) {
      router.replace("/"); // ✅ use replace instead of push
    }
  }
}, [isAuthenticated, user?.role, router]);

  // If dealer is logged in and we're on homepage, show homepage (no redirect)
  return (
    <HomeLayout>
      <Home />
      {/* Development only - Remove in production */}
      {/* {process.env.NODE_ENV === "development" && <AuthTest />} */}
    </HomeLayout>
  );
}
