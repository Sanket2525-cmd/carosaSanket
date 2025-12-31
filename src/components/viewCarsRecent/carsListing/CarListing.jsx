"use client";

import DealersBanner from "@/components/dealers/DealersBanner";
import Banner from "../view/details/comps/Banner";
import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import CarFilters from "./filters/CarFilters";
import CarCollectionTab from "./filters/CarCollectionTab";
import CarsCard from "@/components/home/CarsCard";
import CarMobileFilters from "./filters/CarMobileFilters";
import MobileFilterOverlay from "./filters/MobileFilterOverlay";
import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import PromoCardSlider from "./PromoCardSlider";

function CarListingContent() {
  const [showFilter, setShowFilter] = useState(false);
  const { totalCount, getActiveFilters, clearFilters } = useFilter();

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const handleApplyFilter = () => {
    console.log("Applying filters...");
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    clearFilters();
    console.log("Clearing filters...");
  };

  return (
    <>
          {/* <Banner /> */}
          <section className="padding-Y-X topSpacing2">
            <Container fluid className="px-0 px-xl-3 px-xxl-1">
              <Row>
                <Col xs={12}>
                <CarCollectionTab />
                </Col>
                <Col xl={12}>
                <CarMobileFilters count={totalCount} onOpenFilter={() => setShowFilter(true)} />
                </Col>
                <Col xl={3} className="d-none d-xl-block">
                <CarFilters />
                </Col>
                <Col xl={9}>
                 <PromoCardSlider/>
                 <CarsCard slider={false}/>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Mobile Filter Overlay */}
          <MobileFilterOverlay 
            isOpen={showFilter}
            onClose={handleCloseFilter}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
    </>
  )
}

function CarListing() {
  return (
    <FilterProvider>
      <CarListingContent />
    </FilterProvider>
  );
}

export default CarListing;
