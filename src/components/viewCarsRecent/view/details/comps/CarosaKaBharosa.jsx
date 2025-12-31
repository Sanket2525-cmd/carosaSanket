"use client";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
// import "swiper/css/pagination";

import carosaBharosa from "../../../../../data/CarosaBharosa.json";

function CarosaKaBharosa() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // mobile breakpoint
    };
    handleResize(); // run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CardItem = ({ items, index }) => (
    <div
      className="cardMain min_cardMain bg-white p-3 d-flex flex-column align-items-center justify-content-center text-center h-100"
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={{ borderRadius: "12px" }}
    >
      <img
        src={hoveredIndex === index && items.hoverImage ? items.hoverImage : items.image}
        alt={items.title}
        className="pb-3"
        height={45}
      />
      <p className="m-0 fSize-4 fw-semibold text-wrap">{items.title}</p>
      <span className="fSize-3 fw-normal span__card__inner">{items.descr}</span>
    </div>
  );

  return (
    <>
      <Row className="mt-4">
        <Col xs={12} className="pb-1">
          <div className="hdTile car-bharosa-title  text-md-start">
            <h6 className="fsSize-7-5 fw-bold pt-4">
              Car<span className="acc-osa fw-semibold">osa</span> ka Bhar
              <span className="acc-osa fw-semibold">osa</span>
            </h6>
            <p className="fSize-4 fw-normal" style={{ color: "#737373" }}>
              Trusted benefits & assurances for every Carosa vehicle
            </p>
          </div>
        </Col>
      </Row>

      {/* ✅ Mobile: Swiper Slider / Desktop: Grid */}
      {isMobile ? (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={15}
          slidesPerView={1.2}
          className="p-1 pb-4"
        >
          {carosaBharosa.map((items, index) => (
            <SwiperSlide key={index}>
              <CardItem items={items} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-6 g-2 g-lg-3 pb-3">
          {carosaBharosa.map((items, index) => (
            <div className="col" key={index}>
              <CardItem items={items} index={index} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default CarosaKaBharosa;
