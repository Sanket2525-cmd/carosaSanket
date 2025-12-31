"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function Advertisement() {
  const desktopImages = [
    { src: "/images/Carosa-Website-Banner1.jpg", link: "#" },
    { src: "/images/Carosa-Website-Banner2.jpg", link: "#" },
    { src: "/images/Carosa-Website-Banner3.jpg", link: "https://www.instagram.com/reel/DP8dITbETOT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "/images/Carosa-Website-Banner4.jpg", link: "#" },
    { src: "/images/Carosa-Website-Banner5.jpg", link: "#" },
  ];

  const mobileImages = [
    { src: "/images/bannerads1.png", link: "#" },
    { src: "/images/bannerads2.png", link: "https://www.instagram.com/reel/DP8dITbETOT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
    { src: "/images/bannerads3.png", link: "#" },
    { src: "/images/bannerads4.png", link: "#" },
    { src: "/images/Carosa-Website-Banner5.jpg", link: "#" },
  ];

  const [images, setImages] = useState(desktopImages);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setImages(mobileImages);
      } else {
        setImages(desktopImages);
      }
    };

    handleResize(); // check once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="Branding padding-Y-X">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10}>
            <div className="brandingImages rounded-4 overflow-hidden">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={1000}
              >
                {images.map((item, index) => (
                  <SwiperSlide key={index}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={item.src}
                        alt={`brand-slide-${index}`}
                        className="branding-img rounded-4 w-100"
                        loading="lazy"
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Advertisement;
