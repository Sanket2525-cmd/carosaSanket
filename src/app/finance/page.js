import Finance from "@/components/finance/Finance";

export const metadata = {
  title: "Carosa Finance - Smart Car Loans & Hassle-Free Financing | Confidence on Wheels",
  description:
    "Get easy and transparent car financing with Carosa Finance. Enjoy quick approvals, low interest rates, and flexible EMI options designed to put you confidently behind the wheel.",
  openGraph: {
    title: "Carosa Finance - Smart Car Loans & Hassle-Free Financing | Confidence on Wheels",
    description:
      "Discover Carosa Finance — your trusted partner for quick, transparent, and affordable car loans. Simplify your car ownership journey with flexible finance solutions.",
    url: "https://www.carosa.in/finance",
    siteName: "Carosa",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <Finance />;
}
