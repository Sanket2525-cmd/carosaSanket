"use client";

import MainLayout from "@/components/layout/MainLayout";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Safer client-only import:
const NegotiationPage = dynamic(
  () => import("@/components/viewCarsRecent/view/details/makeBestOffer/NegotiationPage.jsx"),
  { ssr: false }
);

function SellerNegotiationContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId');
  const negotiationId = searchParams.get('negotiationId');
  
  return (
    <MainLayout>
      <NegotiationPage 
        userType="seller" 
        carId={carId}
        negotiationId={negotiationId}
      />
    </MainLayout>
  );
}

export default function SellerNegotiationPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </MainLayout>
    }>
      <SellerNegotiationContent />
    </Suspense>
  );
}


