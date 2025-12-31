"use client";

import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import CarsCard from "./CarsCard";



function RecentlyViewedCars({title="Recently Viewed Cars"}) {
 

  return (
    <>
      <section className="recentlyViewCarHere padding-Y-X ">
        <Container fluid>
          <Row className="px-md-3 px-0">
            <Col xs={12} className="pb-2 px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">{title}</h1>
                </div>
                <div className="viewAll">
                  <Link href="/recentCar" className="fSize-5 fw-semibold viewBtn">
                    View All{" "}
                    <img
                      src="/images/arrowRight.png"
                      alt=""
                      width={14}
                      className="ms-2"
                    />
                  </Link>
                </div>
              </div>
            </Col>
           <CarsCard slider={true} limit={20} useAPI={true}/>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default RecentlyViewedCars;
