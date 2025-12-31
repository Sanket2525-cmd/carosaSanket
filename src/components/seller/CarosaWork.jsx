"use client";

import { Container, Row, Col } from "react-bootstrap";
import workData from "@/data/Work.json";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function CarosaWork() {
  return (
    <>
      <section className="work-section padding-Y-X">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold m-0">
                    How <span className="car">CAR</span>
                    <span className="osa">OSA</span> Works
                  </h1>
                </div>
              </div>
            </Col>
          </Row>

          {/* ✅ Mobile View - Swiper Slider */}
          <div className="d-block d-md-none">
            <Swiper
              className="carosaWork-swiper"
              spaceBetween={15}
              slidesPerView={1.1} // 👈 shows next card slightly
              loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              modules={[Autoplay, Navigation]}
            >
              {workData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="work-card bg-white rounded-3 overflow-hidden">
                    <div className="work-image-wrap">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-100 rounded-top"
                        height="400"
                        loading="lazy"
                      />
                    </div>

                    <div className="work-caption text-center pt-4 px-3 pb-3">
                      <h3 className="work-title fSize-6 fw-semibold">
                        {item.title}
                      </h3>
                      <p className="work-desc fSize-4 fw-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ✅ Tablet & Desktop View - Grid Layout */}
          <div className="d-none d-md-block">
            <div className="work-panel bg-white p-3 mb-4">
              <Row>
                {workData.map((item) => (
                  <Col key={item.id} xs={12} md={6} lg={3} className="mb-3">
                    <div className="work-card">
                      <div className="work-image-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-100 rounded-top"
                          height="400"
                          loading="lazy"
                        />
                      </div>

                      <div className="work-caption text-center pt-4">
                        <h3 className="work-title fSize-6 fw-semibold">
                          {item.title}
                        </h3>
                        <p className="work-desc fSize-4 fw-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          {/* ✅ Watch Button (common for all views) */}
          <Row>
            <Col xs={12}>
              <div className="watchWorksBtn d-flex justify-content-center">
                <Link
                  href=""
                  className="watchBtn py-3 px-4 rounded-3 text-white fSize-3 fw-normal"
                >
                  Watch how it works{" "}
                  <img
                    src="/images/watchBtn.png"
                    width={20}
                    height={20}
                    className="ms-2"
                  />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default CarosaWork;
