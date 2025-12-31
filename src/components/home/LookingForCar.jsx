"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import lookForCar from "../../data/LookingForCar.json";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

function LookingForCar() {
  const { user, isAuthenticated } = useAuthStore();

  // Determine the href based on slug and user role
  const getHref = (slug) => {
    // If it's the sell car section and user is a dealer, redirect to dealers page
    if (slug === "sell" && isAuthenticated && user?.role === 'Dealer') {
      return "/dealers";
    }
    // Otherwise use the slug as is (it will be prefixed with / in the Link)
    return `/${slug}`;
  };

  return (
    <>
      <section className="loogingForCarHere padding-Y-X">
        <Container fluid>
          <Row>
            {lookForCar.map((items, index) => (
              <Col xl={6} lg={6} md={12} key={index} className="mb-lg-0 mb-3">
                <div className="carBody position-relative rounded-4">
                  <img
                    src={items.image}
                    alt=""
                    className="w-100 h-100 object-fit-cover rounded-4"
                    loading="lazy"
                  />
                  <div className="titles pe-5">
                    <h2 className="text-white fSize-11 fw-bold">{items.heading}</h2>
                    <p className="text-white fSize-5 fw-semibold text-wrap">{items.paragraph}</p>
                    <div className="bookBtn mt-5">
                        <Link href={getHref(items.slug)} className="fSize-5 fw-semibold buyBtn buy-button">Get Started <img src="/images/arrowRight.png" alt="" width={14} className="ms-2"/></Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default LookingForCar;
