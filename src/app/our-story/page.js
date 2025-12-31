import OurStory from "@/components/ourstory/OurStory";

export const metadata = {
  title: "Our Story - Carosa | Building Confidence on Wheels",
  description:
    "Learn about Carosa’s journey — built on trust, transparency, and technology. Discover how we’re transforming India’s pre-owned car industry with a customer-first approach and cutting-edge innovation.",
  openGraph: {
    title: "Our Story - Carosa | Building Confidence on Wheels",
    description:
      "Discover Carosa’s story — a vision to redefine India’s pre-owned car market through innovation, transparency, and trust. Learn how we’re driving confidence on wheels.",
    url: "https://www.carosa.in/our-story",
    siteName: "Carosa",
    locale: "en_IN",
    type: "website",
  },
};
export default function Page() {
  
  return <OurStory />;
}
