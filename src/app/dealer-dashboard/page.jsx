"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Dashboard from '@/components/dealers/Dashboard';

function DealerDashboardContent() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Wait a bit for auth state to initialize from localStorage
    const timer = setTimeout(() => {
      setAuthChecked(true);
      // Only redirect if we're certain about auth state
      if (isAuthenticated === true && user?.role && user.role !== 'Dealer') {
        router.push('/dashboard');
      } else if (isAuthenticated === false && user === null) {
        // Only redirect if confirmed not authenticated
        router.push('/');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.role, router]);

  // Show loading while checking auth
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // Don't render if user is not a dealer
  if (isAuthenticated === true && user?.role && user.role !== 'Dealer') {
    return <div>Redirecting...</div>;
  }

  // Don't render if not authenticated
  if (isAuthenticated === false && user === null) {
    return <div>Redirecting...</div>;
  }

  return <Dashboard />;
}

export default function DealerDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DealerDashboardContent />
    </Suspense>
  );
}
