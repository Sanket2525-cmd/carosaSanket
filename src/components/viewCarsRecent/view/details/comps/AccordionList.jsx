"use client";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
// import "swiper/css/pagination";

function AccordionList() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); // Run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuresData = [
    {
      id: 1,
      image: "/images/whuchoose1.png",
      title: "Handpicked Vehicles",
      description:
        "Each car undergoes a detailed inspection, certification, and maintenance process to ensure it's in top condition before you drive it home.",
    },
    {
      id: 2,
      image: "/images/whychoose2.png",
      title: "Smooth Buying Journey",
      description:
        "From test drive to handover, we make the process quick, transparent, and stress-free with easy financing options and paperwork.",
    },
    {
      id: 3,
      image: "/images/whychooes3.png",
      title: "Commitment to Your Satisfaction",
      description:
        "Our support continues well beyond delivery, ensuring you have help and guidance whenever you need it.",
    },
  ];

  const bharosaFeaturesData = [
    {
      id: 1,
      image: "/images/how1.png",
      title: "Browse Online",
      description: "Explore our full car range anytime, anywhere.",
    },
    {
      id: 2,
      image: "/images/how2.png",
      title: "Book Now",
      description: "Schedule your test drive instantly with one click.",
    },
    {
      id: 3,
      image: "/images/how3.png",
      title: "Test Drive",
      description: "Experience the car before you decide.",
    },
    {
      id: 4,
      image: "/images/how4.png",
      title: "Delivery + Support",
      description:
        "Receive your car at home or our centre once payment and paperwork done.",
    },
  ];

  // Common card layout (used for both grid & slider)
  const FeatureCard = ({ feature }) => (
    <div
      className="bg-white shadow-sm h-100"
      style={{ borderRadius: "12px" }}
    >
      <img
        src={feature.image}
        alt={feature.title}
        className="w-100 object-fit-cover"
        style={{ borderRadius: "8px 8px 0 0", height: "170px" }}
      />
      <div className="p-3">
        <h6 className="fSize-6 fw-medium mb-2 text-center">{feature.title}</h6>
        <p className="fSize-3 fw-normal text-dark mb-0 text-center">
          {feature.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="facilityCarosa mt-4">
      <Accordion>
        {/* WHY CHOOSE CAROSA */}
        <Row>
          <Col xs={12} className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5 className="m-0 fSize-8 fw-semibold">
                  Why Choose{" "}
                  <span className="acc-car fw-semibold">CAR</span>
                  <span className="acc-osa fw-semibold">OSA</span>
                </h5>
              </Accordion.Header>
              <Accordion.Body>
                {isMobile ? (
                  <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={15}
                    slidesPerView={1.1}
                    className="p-1"
                  >
                    {featuresData.map((feature) => (
                      <SwiperSlide key={feature.id}>
                        <FeatureCard feature={feature} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Row>
                    {featuresData.map((feature) => (
                      <Col md={6} lg={6} xl={4} className="mb-3" key={feature.id}>
                        <FeatureCard feature={feature} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Col>

          {/* HOW CAROSA WORKS */}
          <Col xs={12}>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <h5 className="m-0 fSize-8 fw-semibold">
                  How{" "}
                  <span className="acc-car fw-semibold">CAR</span>
                  <span className="acc-osa fw-semibold">OSA</span> Works
                </h5>
              </Accordion.Header>
              <Accordion.Body>
                {isMobile ? (
                  <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={15}
                    slidesPerView={1.1}
                    className="p-1"
                  >
                    {bharosaFeaturesData.map((feature) => (
                      <SwiperSlide key={feature.id}>
                        <FeatureCard feature={feature} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Row>
                    {bharosaFeaturesData.map((feature) => (
                      <Col md={6} lg={6} xl={3}  className="mb-3" key={feature.id}>
                        <FeatureCard feature={feature} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Col>
        </Row>
      </Accordion>
    </div>
  );
}

export default AccordionList;
