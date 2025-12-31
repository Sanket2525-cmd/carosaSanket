"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function PromoCardSlider({
  items = [
    { id: 1, img: "/images/bannerads1.png", alt: "Promo 1", url: "#" },
    { id: 2, img: "/images/bannerads2.png", alt: "Promo 2", url: "https://www.instagram.com/reel/DP8dITbETOT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { id: 3, img: "/images/bannerads3.png", alt: "Promo 3", url: "#" },
    { id: 4, img: "/images/bannerads4.png", alt: "Promo 4", url: "#" },
  ],
}) {
  const slides = items.length < 5 ? [...items, ...items] : items;

  return (
    <div className="promoSlider-wrap mb-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={true}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 10, spaceBetween: 16 },
          992: { slidesPerView: 2.8, spaceBetween: 18 },
          1200: { slidesPerView: 3.3, spaceBetween: 20 },
          1400: { slidesPerView: 3.5, spaceBetween: 22 },
        }}
      >
        {slides.map((it, index) => (
          <SwiperSlide key={`${it.id}-${index}`}>
            <Link href={it.url ?? "#"} className="promoCard">
              <img
                src={it.img}
                alt={it.alt}
                className="promoCard-img"
                loading={it.id === 1 ? "eager" : "lazy"}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
