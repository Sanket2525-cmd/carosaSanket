// app/layout.jsx  (NO "use client" here)
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";          // global CSS for app/ routes
import "../styles/responsive.css";
import "../styles/dashboard.css";    
import "../styles/sarwar.css";    // dashboard specific styles
import Header from "../components/navigation/Header"
import Footer from "../components/navigation/Footer";
import { SocketProvider } from "../contexts/SocketProvider";
import { FilterDataProvider } from "../contexts/FilterDataContext";
import LeadModalWrapper from "../components/modals/LeadModalWrapper";
import { Montserrat } from "next/font/google";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"], // jo weights chahiye
  style: ["normal", "italic"], // optional
  variable: "--font-montserrat" // CSS variable bana dega
});

export const metadata = {
  title: "CAROSA: Buy & Sell Used Cars | Car Loan | New Cars",
  description: "Buy & sell used cars, explore new cars, and get car loans.",
   icons: {
    icon: "/favicon.ico", // path public folder ke andar ka
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
        <head>
        {/* Google Ads Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17755227935"
        />
        <Script id="google-ads">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17755227935');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <SocketProvider>
          <FilterDataProvider>
            <Header/>                                                                                                                                                                                                                                                                                                                                                  
            <main>{children}</main>
            <Footer/>
            <LeadModalWrapper />
          </FilterDataProvider>
        </SocketProvider>
      </body>
    </html>
  );                                                      
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
