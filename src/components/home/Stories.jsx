"use client";

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import stories from "../../data/StoriesBharosa.json";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function Stories() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      <section className="storiesMain padding-Y-X ">
        <Container fluid>
          <Row className="pt-lg-0 pt-">
            <Col xs={12} className="pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">Stories of Bhar<span className="acc-osa fw-semibold">osa</span></h1>
                </div>
              </div>
            </Col>

            {isMobile ? (
              // ✅ Mobile View - Swiper Slider
              <Swiper spaceBetween={12} slidesPerView={1.2} grabCursor={true}>
                {stories.map((items, index) => (
                  <SwiperSlide key={index}>
                    <div className="storyCardParent">
                      <div className="card border-0">
                        <div className="imagelyr position-relative mb-2">
                          <img
                            src={items.image}
                            alt=""
                            className="w-100 object-fit-cover"
                            height={400}
                            loading="lazy"
                          />
                        </div>

                        <div className="card-body border-0 pb-4 position-relative">
                          <div className="storiesTitle d-flex gap-2 align-items-center pb-2">
                            <div className="storyUserProfile">
                              <img
                                src="/images/storyUserImg.png"
                                alt=""
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <div className="titleStory d-flex gap-2 align-items-center">
                              <p className="m-0 fSize-4 fw-semibold">
                                {items.userName}
                              </p>
                              <p className="m-0 fSize-4 fw-semibold">
                                | {items.state}
                              </p>
                            </div>
                          </div>
                          <p className="m-0 fSize-3 fw-normal text-black">
                            {items.storiesTitle}
                          </p>
                          <div className="storyPlayBtn d-flex align-items-center justify-content-center">
                            <Link href="">
                              <img
                                src="/images/palyBtn.png"
                                alt=""
                                className="object-fit-cover"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              // ✅ Desktop View - Normal Grid
              stories.map((items, index) => (
                <Col
                  xxl={3}
                  lg={6}
                  sm={6}
                  xs={12}
                  key={index}
                  className="mb-xl-0 mb-3"
                >
                  <div className="storyCardParent ">
                    <div className="card border-0">
                      <div className="imagelyr position-relative mb-2">
                        <img
                          src={items.image}
                          alt=""
                          className="w-100 object-fit-cover"
                          height={400}
                        />
                      </div>

                      <div className="card-body border-0 pb-4 position-relative">
                        <div className="storiesTitle d-flex gap-2 align-items-center pb-2">
                          <div className="storyUserProfile">
                            <img
                              src="/images/storyUserImg.png"
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div className="titleStory d-flex gap-2 align-items-center">
                            <p className="m-0 fSize-4 fw-semibold">
                              {items.userName}
                            </p>
                            <p className="m-0 fSize-4 fw-semibold">
                              | {items.state}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="m-0 fSize-3 fw-normal text-black">
                            {items.storiesTitle}
                          </p>
                        </div>
                        <div className="storyPlayBtn d-flex align-items-center justify-content-center">
                          <Link href="">
                            <img
                              src="/images/palyBtn.png"
                              alt=""
                              className="object-fit-cover"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Stories;
