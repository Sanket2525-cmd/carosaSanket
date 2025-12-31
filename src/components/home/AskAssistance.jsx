"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import gupshup from "../../data/GupSup.json";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function AskAssistance() {
  return (
    <>
      <section className="askAssistanceMain padding-Y-X mt-xl-5">
        <Container fluid>
          <Row>
            {/* ===== LEFT SIDE: Ask for Assistance ===== */}
            <Col xl={4} className="mb-xl-0 mb-4">
              <Row className="h-100">
                <Col xs={12} className="pb-3">
                  <div className="d-flex justify-content-between align-items-center h-100">
                    <div className="webMainTitle">
                      <h1 className="fSize-11 fw-bold">Ask For Assistance</h1>
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="asksMainParent px-4 py-5 h-100">
                    <div className="here pb-5">
                      <Link href="https://wa.me/9355530033">
                        <div className="socialAsker d-flex align-items-center gap-3">
                          <img src="/images/whatsaapchat.png" alt="" />
                          <div className="socialText">
                            <h6 className="m-0 fSize-4 fw-semibold pb-1">
                              Ask us on WhatsApp!
                            </h6>
                            <p className="m-0 fSize-3 fw-normal">
                              Get instant support via experts
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="here pb-5">
                      <Link href="tel:+91 9355530033">
                        <div className="socialAsker d-flex align-items-center gap-3">
                          <img src="/images/callback.png" alt="" />
                          <div className="socialText">
                            <h6 className="m-0 fSize-4 fw-semibold pb-1">
                              Request a callback
                            </h6>
                            <p className="m-0 fSize-3 fw-normal">
                              Our team will contact you shortly!
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="here">
                      <Link href="mailto:support@carosa.in">
                        <div className="socialAsker d-flex align-items-center gap-3">
                          <img src="/images/request.png" alt="" />
                          <div className="socialText">
                            <h6 className="m-0 fSize-4 fw-semibold pb-1">
                              Email us now!
                            </h6>
                            <p className="m-0 fSize-3 fw-normal">
                              Our team is ready to assist you instantly
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            {/* ===== RIGHT SIDE: Gaadi ki Gup-Shup ===== */}
            <Col xl={8}>
              <Row className="h-100">
                <Col xs={12} className="pb-3">
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="webMainTitle">
                      <h1 className="fSize-11 fw-bold m-0">
                        Gaadi ki Gup-Shup by <span className="car">CAR</span>
                        <span className="osa">OSA</span>
                      </h1>
                    </div>
                  </div>
                </Col>

                {/* ✅ Mobile View: Swiper Slider */}
                <div className="d-block d-sm-none">
                  <Swiper
                    className="gupshup-swiper"
                    spaceBetween={15}
                    slidesPerView={1.2} // 👈 shows next card slightly
                    loop={false}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    modules={[Navigation, Autoplay]}
                  >
                    {gupshup.map((items, index) => (
                      <SwiperSlide key={index}>
                        <Link
                          href={items.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-dark"
                        >
                          <div className="gupshupCardParent h-100">
                            <div className="card border-0 h-100">
                              <img
                                src={items.image}
                                alt={items.discriptions}
                                className="w-100 "
                                loading="lazy"
                              />
                              <div className="card-body position-relative">
                                <p className="m-0 fSize-3 fw-medium  text-wrap">
                                  {items.discriptions}
                                </p>
                                <div className="dottetDropdown">
                                  <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    className="dotVartical text-dark"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* ✅ Tablet & Desktop View: Grid Layout */}
                <div className="d-none d-sm-block">
                  <Row>
                    {gupshup.map((items, index) => (
                      <Col xl={3} sm={6} key={index} className="mb-xl-0 mb-3">
                        <Link
                          href={items.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-dark"
                        >
                          <div className="gupshupCardParent h-100">
                            <div className="card border-0 h-100">
                              <img
                                src={items.image}
                                alt={items.discriptions}
                                className="w-100 "
                                loading="lazy"
                              />
                              <div className="card-body position-relative">
                                <p className="m-0 fSize-3 fw-medium pe-4 text-wrap">
                                  {items.discriptions}
                                </p>
                                <div className="dottetDropdown">
                                  <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    className="dotVartical text-dark"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default AskAssistance;
