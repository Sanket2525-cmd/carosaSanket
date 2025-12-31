"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import missions from "../../data/Mission.json";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function OurMission() {
  return (
    <>
      <section className="missionOurMain padding-Y-X">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">The Heart of Our Mission</h1>
                </div>
              </div>
            </Col>
          </Row>

          {/* ✅ Mobile View - Swiper */}
          <div className="d-block d-md-none">
            <Swiper
              className="mission-swiper"
              spaceBetween={15}
              slidesPerView={1.15} // 👈 shows next card slightly
              loop={false}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              modules={[Navigation, Autoplay]}
            >
              {missions.map((items, index) => (
                <SwiperSlide key={index}>
                  <div className="cardParent bg-white rounded-3 p-4 d-flex flex-column w-100 h-100">
                    <div className="d-flex align-items-center gap-4 pb-3">
                      <div className="ratting d-flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Link href="#" key={i}>
                            <div className="rattingBox d-flex align-items-center justify-content-center">
                              <FontAwesomeIcon icon={faStar} className="startIcon" />
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="verify d-flex gap-2 align-items-center">
                        <div className="verifyTik d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon={faCheck} className="verifyCheck" />
                        </div>
                        <div className="verifyTitle">
                          <span className="fSize-2 fw-normal">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="ratersTitle flex-grow-1">
                      <h6 className="fSize-3 fw-semibold pb-1 mb-1">{items.missionTitle}</h6>
                      {/* <p className="mb-0 fSize-2 fw-normal pb-1 text-black">{items.subTitle}</p> */}
                      <p className="fSize-2 fw-normal pb-1 text-black">
                        {items.missionDiscription}
                      </p>
                    </div>

                    <p className="fSize-3 fw-medium m-0 personName text-end mt-auto">{items.person}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ✅ Desktop & Tablet View - Grid */}
          <div className="d-none d-md-block">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-3 pb-3">
              {missions.map((items, index) => (
                <div className="col d-flex" key={index}>
                  <div className="cardParent bg-white rounded-3 p-4 d-flex flex-column w-100 h-100">
                    <div className="d-flex align-items-center gap-4 pb-3">
                      <div className="ratting d-flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Link href="#" key={i}>
                            <div className="rattingBox d-flex align-items-center justify-content-center">
                              <FontAwesomeIcon icon={faStar} className="startIcon" />
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="verify d-flex gap-2 align-items-center">
                        <div className="verifyTik d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon icon={faCheck} className="verifyCheck" />
                        </div>
                        <div className="verifyTitle">
                          <span className="fSize-2 fw-normal">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="ratersTitle flex-grow-1">
                      <h6 className="fSize-3 fw-semibold pb-1 mb-1">{items.missionTitle}</h6>
                      {/* <p className="mb-0 fSize-2 fw-normal pb-1 text-black">{items.subTitle}</p> */}
                      <p className="fSize-2 fw-normal pb-1 text-black">
                        {items.missionDiscription}
                      </p>
                    </div>

                    <p className="fSize-3 fw-medium m-0 text-end personName mt-auto">{items.person}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default OurMission;
