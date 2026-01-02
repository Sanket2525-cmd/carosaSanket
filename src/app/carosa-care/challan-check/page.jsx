import Challancheck from "@/components/carosa-care/challan-check";

export const metadata = {
  title: "FASTag Recharge - Instant Recharge for All Banks | Carosa",
  description:
    "Recharge your FASTag instantly for all major banks including SBI, ICICI, HDFC, Paytm and more. Secure, quick, and hassle-free FASTag recharge with zero extra charges.",
  openGraph: {
    title: "FASTag Recharge - Instant Recharge for All Banks | Carosa",
    description:
      "Recharge your FASTag instantly for all major banks. Secure, quick, and hassle-free FASTag recharge.",
    url: "https://www.carosa.in/carosa-care/fastag-recharge",
    siteName: "Carosa",
    locale: "en_IN",
    type: "website",
  },
};

export default function ChallanCheckSectionPage() {
  return <Challancheck />;
}

