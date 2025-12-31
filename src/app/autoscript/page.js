import Autoscript from "@/components/autoscript/Autoscript";


export const metadata = {
  title: "AutoScript Blog & News - Carosa | Latest Car Updates, Tips & Automotive Insights",
  description:
    "Read AutoScript by Carosa — Your go-to source for car news, expert tips, maintenance guides, reviews, finance insights, and the latest automotive trends in India.",
  openGraph: {
    title: "AutoScript Blog & News - Carosa | Expert Tips, Reviews & Latest Car Industry Updates",
    description:
      "Stay updated with AutoScript, Carosa’s official blog covering car reviews, maintenance tips, automotive news, buying guides, and finance insights for Indian car owners.",
    url: "https://www.carosa.in/autoscript",
    siteName: "Carosa",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <Autoscript />;
}