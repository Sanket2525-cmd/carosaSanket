'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

function SkeletonPublish() {
  return (
    <SkeletonTheme baseColor="#E5E5E5" highlightColor="#F0F0F0">
      <section className="publishMain padding-Y-X">
        <Container fluid className="py-6" style={{ paddingTop: "150px" }}>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Header Section */}
              <Row className="mb-4 align-items-center">
                <Col lg={8} className="pb-lg-0 pb-2">
                  <Skeleton height={40} width="60%" className="mb-2" />
                </Col>
                <Col lg={4}>
                  <div className="d-flex gap-4 w-100">
                    <Skeleton height={50} width="48%" style={{ borderRadius: '8px' }} />
                    <Skeleton height={50} width="48%" style={{ borderRadius: '8px' }} />
                  </div>
                </Col>
              </Row>

              <Row>
                {/* Car Showcase Gallery */}
                <Col lg={7} className="mb-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      <div className="d-flex overflow-hidden" style={{ height: "500px" }}>
                        {/* Sidebar Skeleton */}
                        <div
                          className="buttonSide text-white d-flex flex-column p-2"
                          style={{ backgroundColor: "#1E3A8A", borderRadius: "8px 0px 0px 8px", width: "120px" }}
                        >
                          {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="mb-2 p-2">
                              <Skeleton height={60} width={60} style={{ borderRadius: '8px' }} className="mb-2" />
                              <Skeleton height={14} width="100%" />
                            </div>
                          ))}
                        </div>

                        {/* Main Image Area */}
                        <div className="flex-grow-1 bg-light position-relative d-flex align-items-center justify-content-center">
                          <Skeleton height={500} width="100%" style={{ borderRadius: '0 8px 8px 0' }} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Car Details Card Skeleton */}
                <Col lg={5}>
                  <Card className="border-0 publish-car-details-card">
                    <Card.Body className="p-3 border-0">
                      {/* Car Title */}
                      <Skeleton height={32} width="80%" className="mb-2" />
                      <Skeleton height={20} width="60%" className="mb-4" />
                      
                      {/* Specification Tags */}
                      <div className="d-flex gap-2 align-items-center mb-4 flex-wrap">
                        <Skeleton height={32} width={80} style={{ borderRadius: '999px' }} />
                        <Skeleton height={32} width={100} style={{ borderRadius: '999px' }} />
                        <Skeleton height={32} width={80} style={{ borderRadius: '999px' }} />
                        <Skeleton height={32} width={100} style={{ borderRadius: '999px' }} />
                      </div>

                      {/* Partner Badge */}
                      <div className="border-bottom pb-4 mb-4">
                        <Skeleton height={40} width={150} style={{ borderRadius: '4px' }} />
                      </div>

                      {/* Pricing Information */}
                      <div className="row g-3 my-2">
                        <div className="col-12">
                          <Skeleton height={16} width="40%" className="mb-1" />
                          <div className="d-flex align-items-center">
                            <Skeleton height={28} width="50%" className="me-2" />
                            <Skeleton height={16} width={16} circle />
                          </div>
                        </div>
                        <div className="col-12">
                          <Skeleton height={16} width="40%" className="mb-1" />
                          <div className="d-flex align-items-center">
                            <Skeleton height={28} width="50%" className="me-2" />
                            <Skeleton height={16} width={16} circle />
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Vehicle Summary Section */}
              <Row className="mt-4">
                <div className="col-12 mb-3">
                  <Skeleton height={24} width="200px" />
                </div>
                <Col lg={7}>
                  <div 
                    className="p-4 rounded-3"
                    style={{
                      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                      borderRadius: "12px"
                    }}
                  >
                    {/* Key Vehicle Details - 3x3 Grid */}
                    <div className="row g-4 mb-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                        <div key={index} className="col-md-4">
                          <div className="d-flex align-items-center gap-3">
                            <Skeleton height={20} width={20} circle />
                            <div style={{ flex: 1 }}>
                              <Skeleton height={14} width="60%" className="mb-1" />
                              <Skeleton height={18} width="80%" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Insurance Details */}
                    <div 
                      className="p-3 rounded-3 mb-3"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px dashed rgba(255, 255, 255, 0.3)"
                      }}
                    >
                      <div className="row g-3">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className="col-md-4">
                            <div className="d-flex align-items-center gap-3">
                              <Skeleton height={16} width={16} circle />
                              <div style={{ flex: 1 }}>
                                <Skeleton height={14} width="70%" className="mb-1" />
                                <Skeleton height={16} width="80%" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warranty Details */}
                    <div 
                      className="p-3 rounded-3"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px dashed rgba(255, 255, 255, 0.3)"
                      }}
                    >
                      <div className="row g-3">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className="col-md-4">
                            <div className="d-flex align-items-center gap-3">
                              <Skeleton height={16} width={16} circle />
                              <div style={{ flex: 1 }}>
                                <Skeleton height={14} width="70%" className="mb-1" />
                                <Skeleton height={16} width="80%" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Action Buttons Section */}
              <Row className="mt-4 mb-4">
                <Col lg={7}>
                  <div className="d-flex gap-3 w-100">
                    <Skeleton height={56} width="48%" style={{ borderRadius: '8px' }} />
                    <Skeleton height={56} width="48%" style={{ borderRadius: '8px' }} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </SkeletonTheme>
  );
}

export default SkeletonPublish;

