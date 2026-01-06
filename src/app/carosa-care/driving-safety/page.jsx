import DrivingSafety from "@/components/carosa-care/driving-safety";

export const metadata = {
  title: "Drive Safety Assistant | Carosa",
  description:
    "Practical driving safety tips, emergency assistance and safety checks to make every drive safer with Carosa.",
  openGraph: {
    title: "Drive Safety Assistant | Carosa",
    description:
      "Driving safety tips, emergency tools and roadside assistance by Carosa.",
    url: "https://www.carosa.in/carosa-care/driving-safety",
    siteName: "Carosa",
    locale: "en_IN",
    type: "website",
  },
};

export default function DrivingSafetyPage() {
  return <DrivingSafety />;
}
