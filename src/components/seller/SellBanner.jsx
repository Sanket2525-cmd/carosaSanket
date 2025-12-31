"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InteractiveLocationMap from "./InteractiveLocationMap";
import DriveHubLocationMap from "./DriveHubLocationMap";

// CurrentLocationDisplay Component: Displays the interactive map with user's live location
const CurrentLocationDisplay = () => (
  <InteractiveLocationMap />
);

// DeliveryLocationDisplay Component: Displays the drive hub location map with dropdown
const DeliveryLocationDisplay = () => (
  <DriveHubLocationMap />
);


function SellBanner() {
  // 'activeTab' state to track which tab is currently active ('current' or 'delivery')
  const [activeTab, setActiveTab] = useState('current');

  return (
    <>
      <section className="sellBannerMain position-relative">
        <div className="bannerHere">
          <img
            src="/images/sellbanner.png"
            alt=""
            className="w-100 object-fit-cover"
            height={730}
          />
        </div>
        <Container
          fluid
          className="position-absolute top-50 start-50 translate-middle padding-Y-X mt-xl-5 mt-2"
        >
          <Row>
            {/* Left side content */}
            <Col xl={8}>
              <div className="sellBannerContant">
                <h1 className="text-white text-center fSize-16 fw-bold">
                  Sell Your Car with 
                  <br />
                 Carosa Ka Bharosa
                </h1>
              </div>
            </Col>

            {/* --- Dynamic Location/Map Component Start --- */}
            <Col xl={4}>
              <div
                className="map p-3 p-sm-4 bg-white rounded-4"
                style={{ overflow: "hidden" }}
              >
                {/* Location Toggle/Tab Button Container */}
                <div
                  className="locationToggle d-flex p-1 mb-3 rounded-5"
                  style={{ backgroundColor: "#e9ecef" }}
                >
                  {/* Your Current Location Button */}
                  <div
                    className="flex-grow-1 text-center py-2 px-3 rounded-5 cursor-pointer"
                    style={{
                      backgroundColor: activeTab === 'current' ? 'white' : 'transparent',
                      color: activeTab === 'current' ? '#343a40' : '#6c757d',
                      boxShadow: activeTab === 'current' ? '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' : 'none',
                      fontWeight: '400',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveTab('current')} // Update state on click
                  >
                    Your Current Location
                  </div>

                  {/* Delivery Location Button */}
                  <div
                    className="flex-grow-1 text-center py-2 px-3 rounded-5 cursor-pointer"
                    style={{
                      backgroundColor: activeTab === 'delivery' ? 'white' : 'transparent',
                      color: activeTab === 'delivery' ? '#343a40' : '#6c757d',
                      boxShadow: activeTab === 'delivery' ? '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' : 'none',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveTab('delivery')} // Update state on click
                  >
                    Drive Hub Location
                  </div>
                </div>

                {/* --- Dynamic Content Display --- */}
                <div className="dynamicContentArea">
                  {/* Display component based on activeTab state */}
                  {activeTab === 'current' ? (
                    <CurrentLocationDisplay />
                  ) : (
                    <DeliveryLocationDisplay />
                  )}
                </div>

                {/* Create Listing Button */}
                <div
                  className=" d-flex align-items-center justify-content-center "
                >
                  <Link
                    href="/RegistrationYourCar"
                    className="text-white fSize-4  fw-medium text-decoration-none py-3 rounded-3 createListingBtn mt-3 w-100 text-center"
                  >
                    Create Listing
                  </Link>
                </div>
              </div>
            </Col>
            {/* --- Dynamic Location/Map Component End --- */}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default SellBanner;