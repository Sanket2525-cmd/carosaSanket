"use client";

import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useFilter } from "@/contexts/FilterContext";

function CarCollectionTab() {
  const { filters, updateFilters } = useFilter();
  const [activeTab, setActiveTab] = useState(filters.category);

  const tabs = ["All", "Mid-Range Cars", "Luxury Cars"];

  // Sync activeTab with filters.category when it changes (e.g., from URL params)
  useEffect(() => {
    setActiveTab(filters.category);
  }, [filters.category]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    updateFilters({ category: tab });
  };

  return (
    <>
      <div className="CarTabSelect mb-4 p-2">
        <Row>
          {tabs.map((tab) => (
            <Col sm={4} xs={4} key={tab}>
              <div
                className={`tab py-2 cursor-pointer ${
                  activeTab === tab ? "bg-white" : "bg-transparent"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                <Link href="" onClick={(e) => e.preventDefault()}>
                  <p
                    className={`text-center m-0 ${
                      activeTab === tab ? "text-dark fSize-3 fw-semibold" : "text-dark fSize-3 fw-semibold"
                    }`}
                  >
                    {tab}
                  </p>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default CarCollectionTab;
