"use client";

import React, { Suspense } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
