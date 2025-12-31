import HomeBanner from "@/components/home/HomeBanner";
import MainLayout from "@/components/layout/MainLayout";
import SellBanner from "@/components/seller/SellBanner";
import SellCarsPages from "@/components/seller/SellCarsPages";

// app/sell/page.jsx
export const metadata = { title: "Sell Your Car | CAROSA" };

export default function SellPage() {
  return (
    <>
      <MainLayout>
        <SellCarsPages />
      </MainLayout>
    </>
  );
}
