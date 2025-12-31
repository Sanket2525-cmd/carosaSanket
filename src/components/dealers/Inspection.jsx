"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/services/useDebounce";
const Inspection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [inspections] = useState([
    {
      id: 1,
      status: 'completed',
      title: 'Tata Indigo eCS LS CR4 BS-IV 2011',
      did: 'I416955602',
      regNo: 'HR26CG1988',
      raisedDate: '12 Oct 2025 11:30 AM',
      completedDate: '13 Oct 2025 04:45 PM',
      image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg'
    },
    {
      id: 2,
      status: 'completed',
      title: 'Tata Indigo eCS LS CR4 BS-IV 2011',
      did: 'I416955602',
      regNo: 'HR26CG1988',
      raisedDate: '12 Oct 2025 11:30 AM',
      completedDate: '13 Oct 2025 04:45 PM',
      image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg'
    },
    {
      id: 3,
      status: 'pending',
      title: 'Tata Indigo eCS LS CR4 BS-IV 2011',
      did: 'I416955602',
      regNo: 'HR26CG1988',
      raisedDate: '12 Oct 2025 11:30 AM',
      image: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg'
    }
  ]);

  const handleReraise = () => {
    console.log('Re-raise inspection');
  };

  const handleViewReport = () => {
    console.log('View report');
  };

  const handleDownloadReport = () => {
    console.log('Download report');
  };

  const handleRaiseInspection = () => {
    console.log('Raise inspection');
  };

  const InspectionCard = ({ inspection }) => (
    <div className="dealers-card p-4 inspection-card">
      <div className="d-flex flex-column flex-md-row align-items-start gap-4">
        <div className="d-flex flex-1 gap-4">
          <img 
            src={inspection.image}
            alt="car"
            className="inspection-car-image"
          />
          <div className="flex-1">
            <h3 className="inspection-title">{inspection.title}</h3>
            <p className="inspection-did">DID: {inspection.did}</p>
            <p className="inspection-reg">Reg. No.: <span className="fw-semibold">{inspection.regNo}</span></p>
            <div className="inspection-details">
              <p className="text-black"><strong>Inspection Raised:</strong> {inspection.raisedDate}</p>
              <p className="text-black"><strong>Inspection Status:</strong> 
                {inspection.status === 'completed' ? (
                  <span className="fw-semibold">Completed on {inspection.completedDate}</span>
                ) : (
                  <span className="fw-semibold">Pending since {inspection.raisedDate}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="inspection-actions">
          {inspection.status === 'completed' ? (
            <div className="d-flex flex-column gap-2 inspection-buttons">
              <Button 
                className="inspection-btn inspection-btn-green"
                onClick={handleReraise}
              >
                Re-raise Inspection
              </Button>
              <Button 
                className="inspection-btn inspection-btn-blue"
                onClick={handleViewReport}
              >
                View Report
              </Button>
              <Button 
                className="inspection-btn inspection-btn-orange"
                onClick={handleDownloadReport}
              >
                Download Report
              </Button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2 inspection-buttons">
              <Button 
                className="inspection-btn inspection-btn-green"
                onClick={handleRaiseInspection}
              >
                Raise Inspection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
  
      {/* Inspection Title */}

      <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 ">
        <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Inspection</h2>
        <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Page will reset via useEffect when debouncedSearch changes
              }}
              placeholder="Search by Name, Model, Reg. No, Brand..."
            />
        </div>
      </div>

      {/* Inspection Cards */}
      {/* <Row>
        <Col lg={12}>
          <div className="inspection-list">
            {inspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))}
          </div>
        </Col>
      </Row> */}
         <Row>
        <Col lg={12}>
        <div class="dv2-offerlist">
          <div class="card dv2-card p-5 text-center">
          <h5>Coming Soon</h5>
          {/* <p class="text-muted">You'll see offers for your cars here when buyers make them.</p> */}
          </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Inspection;
