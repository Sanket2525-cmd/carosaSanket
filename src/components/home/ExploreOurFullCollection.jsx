import React, { useRef, useEffect } from 'react'
import { Col, Container, Row } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import Link from 'next/link';
import CarsCard from './CarsCard';

// Shared data ref to prevent duplicate API calls
const sharedCarsDataRef = { data: null, loading: false };

function ExploreOurFullCollection() {
  // This component now renders its own CarsCard but will share data with RecentlyViewedCars
  // through the deduplication mechanism in CarService.getAllCars()
  return (
    <>
      <section className="recentlyViewCarHere padding-Y-X ">
        <Container fluid>
          <Row className="px-md-3 px-0">
            <Col xs={12} className="pb-2 px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">Explore Our Full Collection</h1>
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
            {/* Use same props as RecentlyViewedCars - deduplication will handle duplicate calls */}
            <CarsCard slider={true} limit={20} useAPI={true}/>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default ExploreOurFullCollection;
