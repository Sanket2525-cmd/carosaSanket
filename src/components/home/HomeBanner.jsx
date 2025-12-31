"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useAuthStore } from "@/store/authStore";
import "swiper/css";
import "swiper/css/pagination";
import "../../styles/homebanner.css";

export default function HomeBanner() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const slides = [
    {
      img: "/images/carosabanner-1.jpg",
      eyebrow: "Your Trusted Platform",
      title: (
        <>
          Your All-In-One Car  <br className="d-md-block d-none"/>    Marketplace
        
      

        </>
      ),
      sub: "Buy certified cars or sell for the best value — quick, transparent, and hassle-free.",
      buttons: "both", 
    },
    {
      img: "/images/carosabanner-4.jpg",
      eyebrow: "Sell in minutes",
      title: (
        <>
          Get Best <br />
          Price Instantly
        </>
      ),
      sub: "Free inspection • Quick payment • Doorstep pickup.",
      buttons: "single",
      singleVariant: "sell",
      singleText: "Sell Now",
    },
    {
      img: "/images/carosabanner-3.png",
      eyebrow: "Assured & trusted",
      title: (
        <>
          CAROSA Certified <br />
          Vehicles
        </>
      ),
      sub: "250-point inspection, warranty & easy financing.",
      buttons: "single",
      singleVariant: "buy", 
      singleHref: "/recentCar",
      singleText: "Buy Now",
    },
  ];

  const renderButtons = (cfg) => {
    // Determine sell href based on user role
    const getSellHref = () => {
      if (isAuthenticated && user?.role === 'Dealer') {
        return "/dealers";
      }
      return "/sell";
    };

    if (cfg.buttons === "both") {
      return (
        <div className="d-flex align-items-center gap-sm-5 gap-3 pt-4">
          <div className="bookBtn">
            <Link href="/recentCar" className="fSize-7 fw-bold buyBtn buy-button">
              Buy Now{" "}
              <img src="/images/arrowRight.png" alt="" width={14} className="ms-2" />
            </Link>
          </div>

          <div className="bookBtn">
            <Link
              href={getSellHref()}
              className={`fSize-7 fw-bold buyBtn sell-button ${
                pathname === "/sell" ? "active-class" : ""
              }`}
            >
              Sell Now{" "}
              <img src="/images/arrowRight.png" alt="" width={14} className="ms-2" />
            </Link>
          </div>
        </div>
      );
    }

    const isBuy = cfg.singleVariant === "buy";
    // For sell buttons, always use getSellHref() to check user role
    // For buy buttons, use provided href or default to "/recentCar"
    const href = isBuy ? (cfg.singleHref || "/recentCar") : getSellHref();
    const text = cfg.singleText || (isBuy ? "Buy Now" : "Sell Now");
    const cls = `fSize-7 fw-bold buyBtn ${isBuy ? "buy-button" : "sell-button"} ${
      !isBuy && pathname === "/sell" ? "active-class" : ""
    }`;

    return (
      <div className="d-flex align-items-center gap-sm-5 gap-3 pt-4">
        <div className="bookBtn">
          <Link href={href} className={cls}>
            {text}{" "}
            <img src="/images/arrowRight.png" alt="" width={14} className="ms-2" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="homeBanner">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="banner-swiper"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="slide">
              <Image src={s.img} alt={`banner-${i}`} fill priority={i === 0} className="bg-img" />
              <div className="left-glass" />
              <div className="content-wrap">
                <div className="content">
                  {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
                  <h1 className="title">{s.title}</h1>
                  {s.sub && <p className="sub">{s.sub}</p>}
                  {renderButtons(s)}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
