"use client";

import React, { Suspense } from "react";
import Dashboard from "@/components/dealers/Dashboard";

const DealersDashboardPageContent = () => {
  return (
    <div className="dealers-dashboard-page">
      <Dashboard />
    </div>
  );
};

const DealersDashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DealersDashboardPageContent />
    </Suspense>
  );
};

export default DealersDashboardPage;
