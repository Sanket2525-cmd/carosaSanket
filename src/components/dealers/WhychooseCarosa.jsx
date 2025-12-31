"use client";

import { Col, Container, Row } from "react-bootstrap";
import choseCarosa from "@/data/WhyChoseCarosaDealer.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

function WhychooseCarosa() {
  return (
    <>
      <section className="whyChoseCarosa padding-Y-X mt-xl-0">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold m-0">
                    Why Choose <span className="car">CAR</span>
                    <span className="osa">OSA</span>
                  </h1>
                </div>
              </div>
            </Col>

            {/* ✅ Mobile View - Swiper Slider */}
            <div className="d-block d-md-none awiperNew">
              <Swiper
                className="whychoose-swiper"
                spaceBetween={15}
                slidesPerView={1} // 👈 show next card slightly
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                modules={[Autoplay, Navigation]}
              >
                {choseCarosa.map((items, index) => (
                  <SwiperSlide key={index}>
                    <div className="carosaChose rounded-3 newchoose">
                      <div className="work-image-wrap2">
                        <img
                          src={items.image}
                          alt={items.title}
                          className="w-100 rounded-top object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="choseCaptions px-3 py-2">
                        <h3 className="work-title fw-medium">{items.title}</h3>
                        <p className="work-desc fw-normal">
                          {items.description}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ✅ Tablet & Desktop View - Grid Layout */}
            <div className="d-none d-md-block">
              <Row>
                {choseCarosa.map((items, index) => (
                  <Col xl={2} md={4} xs={12} key={index} className="mb-4">
                    <div className="carosaChose rounded-3 newchoose">
                      <div className="work-image-wrap2">
                        <img
                          src={items.image}
                          alt={items.title}
                          className="w-100 rounded-top object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="choseCaptions px-3 py-2">
                        <h3 className="work-title fw-medium">{items.title}</h3>
                        <p className="work-desc fw-normal">
                          {items.description}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default WhychooseCarosa;
