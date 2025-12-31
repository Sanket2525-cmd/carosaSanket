
import DealersPage from "@/components/dealers/DealersPage";
import MainLayout from "@/components/layout/MainLayout";


// app/sell/page.jsx
export const metadata = { title: "Dealer | CAROSA" };

export default function SellPage() {
  return (
    <>
      <MainLayout>
        <DealersPage />
      </MainLayout>
    </>
  );
}