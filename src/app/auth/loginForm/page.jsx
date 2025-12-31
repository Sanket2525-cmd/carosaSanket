// `/auth/loginForm` page: reuse the common LoginModal popup design
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { useAuthStore } from "@/store/authStore";

export default function LoginFormPage() {
  const [show, setShow] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Agar user already login hai to is page pe aate hi redirect kar do
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleClose = () => {
    setShow(false);
    router.push("/");
  };

  return <LoginModal show={show} handleClose={handleClose} />;
}
