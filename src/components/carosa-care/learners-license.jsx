

"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";

export default function LearnerLicensePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Where do you submit the application?",
      answer: "We submit the application to the local RTO on your behalf (with your consent)."
    },
    {
      question: "Is it legal to apply without owner's consent?",
      answer: "No, you must have the owner's consent to apply for a learner's license. We ensure all applications are submitted with proper authorization."
    },
    {
      question: "Can minors apply?",
      answer: "Minors can apply with parental consent. For gearless two-wheelers, the minimum age is 16 years with parental consent. For LMV (cars and bikes above 50cc), the minimum age is 18 years."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept multiple payment methods including UPI, debit/credit cards, net banking, and other online payment gateways for your convenience."
    },
    {
      question: "Do you help with documentation for senior citizens?",
      answer: "Yes, we provide complete assistance with documentation for senior citizens, ensuring all required documents are properly verified and submitted."
    },
    {
      question: "Will you follow up with RTO?",
      answer: "Yes, we provide end-to-end support including regular follow-ups with the RTO to ensure your application is processed smoothly and on time."
    },
    {
      question: "Is personal data shared with RTO?",
      answer: "Yes, only the necessary personal information required for the learner's license application is shared with the RTO, and we ensure all data is handled securely and confidentially."
    },
    {
      question: "Can I change my test city?",
      answer: "Test city changes may be possible depending on RTO policies and availability. Please contact our support team to discuss your specific requirements."
    },
    {
      question: "Do you provide a refund if RTO rejects?",
      answer: "Refund policies vary based on the reason for rejection. We recommend reviewing our terms and conditions or contacting our support team for specific refund eligibility."
    }
  ];

  return (
    <div className="fastag-recharge-page">
      {/* ================= HERO SECTION ================= */}
      <section className="fastag-hero-section">
        <Container fluid>
          <Row className="align-items-center">

            {/* LEFT CONTENT */}
            <Col
              lg={7}
              className="padding-Y-X"
              style={{ marginTop: "-20px", paddingLeft: "30px" }}
            >
              <h1 className="fastag-hero-title pt-4">
                LEARNER’S LICENCE <br />
                <span className="fastag-hero-highlight">
                  ASSISTANCE
                </span>
              </h1>

              <p className="fastag-hero-subtitle">
                Your smooth path to driving starts here — apply, prepare,
                and get your Learner’s Licence with Carosa.
              </p>

              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <Button className="fastag-btn-primary rounded-5">
                  Apply Now
                </Button>

                <Button className="fastag-btn-secondary rounded-5">
                  Check Requirement
                </Button>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={5} className="px-0">
              <div className="fastag-hero-illustration text-end">
                <img
                  src="/images/learnerHero.png"
                  alt="Learner’s Licence Assistance"
                  className="w-100 driving-safety-hero-img"
                />
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      {/* Start Your Driving Journey Section */}
      <section className="before-drive-section">
        <Container>
          <Row>
            <Col lg={7}>
              <div className="before-drive-content">
                <h2 className="before-drive-title">
                  Start Your Driving Journey <span className="text-green">with Confidence</span>
                </h2>
                <p className="before-drive-subtitle">
                  Carosa helps you apply for your Learner's License easily with guided steps, document support, form filling, slot booking, and mock tests all in one place.
                </p>

                {/* Need Practice Tests Card */}
                <div className="checklist-panel" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                  <div className="contact-icon-box" style={{ flexShrink: 0 }}>
                    <img src="/images/learner.png" alt="Practice Test" style={{ width: '40px', height: '40px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h6 className="checklist-title" style={{ marginBottom: '8px' }}>Need Practice Tests?</h6>
                    <p className="fastag-feature-text" style={{ margin: 0 }}>
                      Access our RTO-style mock tests and improve your score before the LL test.
                    </p>
                  </div>
                  <Button className="fastag-btn-primary rounded-5" style={{ backgroundColor: '#F28B18', border: 'none', color: '#FFFFFF', flexShrink: 0 }}>
                    Start Mock Test
                  </Button>
                </div>

                {/* Contact Support Section */}
                <div className="quick-tools-section">
                  <h5 className="quick-tools-title" style={{ marginBottom: '16px' }}>Contact Support</h5>
                  <div className="d-flex gap-3 flex-wrap">
                    <div className="contact-card" style={{ backgroundColor: '#0C3E8B', color: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px', flex: '0 1 auto' }}>
                      <span style={{ fontSize: '20px' }}>📞</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>+91 98765 43210</span>
                    </div>
                    <div className="contact-card" style={{ backgroundColor: '#86CB3A', color: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px', flex: '0 1 auto' }}>
                      <span style={{ fontSize: '20px' }}>✉️</span>
                      <span style={{ color: '#FFFFFF', fontWeight: '500' }}>support@carosa.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Form Panel */}
            <Col lg={5}>
              <div className="estimate-form-card" style={{ marginTop: '0px' }}>
                <h5 className="form-card-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>Quick Enquiry</h5>
                <form className="row g-3">
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Your Phone Number"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>City</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter City"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Service Needed</label>
                    <select className="form-select">
                      <option>Select Service</option>
                      <option>Apply for Learner's License</option>
                      <option>Document Support</option>
                      <option>Slot Booking</option>
                      <option>Mock Test</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="estimate-submit-btn" style={{ backgroundColor: '#F28B18', border: 'none', color: '#FFFFFF' }}>
                      Submit Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY GET LEARNER'S LICENSE ASSISTANCE ================= */}
      <section className="fastag-offer-section why-choose-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why Get Learner's License </span>
                <span className="osa">Assistance?</span>
              </h2>

              <p className="fastag-section-description">
                Avoid confusion and delays with expert-guided license support.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X why-choose-row">
            
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/safering1.png" alt="Verified Application" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Verified Application</h4>
                  <p className="fastag-feature-text">
                    We ensure your application is error-free before submission to RTO.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/learnerwhy2.png" alt="Slot Booking" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Slot Booking</h4>
                  <p className="fastag-feature-text">
                    Book preferred slots and avoid long waits at RTO.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/learnerwhy3.png" alt="Mock Tests" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Mock Tests</h4>
                  <p className="fastag-feature-text">
                    Practice RTO-style questions and improve pass rates.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/learnerwhy4.png" alt="Document Check" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Document Check</h4>
                  <p className="fastag-feature-text">
                    We pre-verify all supporting documents to reduce rejections.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/learnerwhy5.png" alt="Driving Basics" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Driving Basics</h4>
                  <p className="fastag-feature-text">
                    Learn essential vehicle controls & road safety before your test.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/learnerwhy6.png" alt="Support" width="30" />
                </div>
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Support</h4>
                  <p className="fastag-feature-text">
                    Dedicated chat & call support through the process.
                  </p>
                </div>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-carosa-section">
        <div className="container">
          {/* HEADING */}
          <div className="text-center mb-4">
            <h2 className="fastag-section-title">
              <span className="text-primary">How It</span>{" "}
              <span className="osa">Works</span>
            </h2>
            <p className="fastag-section-description">
              A simple, step-by-step process from application to approval.
            </p>
          </div>

          {/* SINGLE IMAGE */}
          <div className="text-center mb-4">
            <Image
              src="/images/how-carosa-works.png"
              alt="How It Works"
              width={1100}
              height={220}
              className="img-fluid"
              priority
            />
          </div>

          {/* TEXT BELOW IMAGE */}
          <div className="row text-center g-4">
            <div className="col-lg-3 col-md-6">
              <h6 className="step-title">Submit Details</h6>
              <p className="step-desc">Enter basic info & upload documents.</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h6 className="step-title">Form Filling</h6>
              <p className="step-desc">We complete the RTO application (Form 2).</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h6 className="step-title">Slot Booking</h6>
              <p className="step-desc">Choose a date & time for test.</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h6 className="step-title">Take Test</h6>
              <p className="step-desc">Appear for online/office test and get LL.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCUMENTS REQUIRED ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Documents</span>{" "}
                <span className="osa">Required</span>
              </h2>
              <p className="fastag-section-description">
                Keep your documents ready for a smooth application process.
              </p>
            </Col>
          </Row>
          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <img src="/images/Documents1.png" alt="Age proof" className="fastag-feature-image documents-required-icon" />
                <h4 className="fastag-feature-title">Age proof</h4>
                <p className="fastag-feature-text">
                  (Aadhar, Passport, Birth Certificate)
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <img src="/images/Documents2.png" alt="Address proof" className="fastag-feature-image documents-required-icon" />
                <h4 className="fastag-feature-title">Address proof</h4>
                <p className="fastag-feature-text">
                  (Aadhar, Rental Agreement, Utility Bill)
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <img src="/images/Documents3.png" alt="Photo" className="fastag-feature-image documents-required-icon" />
                <h4 className="fastag-feature-title">Photo</h4>
                <p className="fastag-feature-text">
                  Passport-sized photographs
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <img src="/images/Documents4.png" alt="Medical certificate" className="fastag-feature-image documents-required-icon" />
                <h4 className="fastag-feature-title">Medical certificate</h4>
                <p className="fastag-feature-text">
                  Medical certificate (Form 1A if applicable)
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <img src="/images/Documents5.png" alt="Filled Application" className="fastag-feature-image documents-required-icon" />
                <h4 className="fastag-feature-title">Filled Application</h4>
                <p className="fastag-feature-text">
                  Filled Application Form (Form 2) — we help you fill
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= APPLY ELIGIBILITY ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Apply</span>{" "}
                <span className="osa">Eligibility</span>
              </h2>
              <p className="fastag-section-description">
                Check if you meet the basic requirements to apply.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X justify-content-center">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper">
                  <div className="eligibility-badge">
                    <span>18+</span>
                  </div>
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Minimum age 18 for LMV (cars &</h4>
                  <p className="eligibility-text">
                    bikes above 50cc)
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper">
                  <div className="eligibility-badge">
                    <span>16+</span>
                  </div>
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Minimum age 16 for gearless</h4>
                  <p className="eligibility-text">
                    two-wheelers with parental consent
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/apply.png" alt="Traffic Rules" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Basic knowledge</h4>
                  <p className="eligibility-text">
                    of traffic rules & road signs
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHAT YOU'LL LEARN ================= */}
      <section className="test-drive-section">
        <Container>
          <div className="test-drive-content">
            <h2 className="test-drive-title">
              What You'll <span className="text-green">Learn</span>
            </h2>
            <p className="test-drive-subtitle">
              Essential driving knowledge to prepare you for real-world roads.
            </p>

            <Row className="g-4 mt-3">
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/learnerRing1.png" 
                      alt="Traffic Rules"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Traffic rules & mandatory road signs
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/learnerRing2.png" 
                      alt="Lane Discipline"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Lane discipline, overtaking, signals & markings
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/learnerRing3.png" 
                      alt="Safe Driving Basics"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Safe driving basics and emergency handling
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/learnerRing4.png" 
                      alt="Mock Test Practice"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Mock test practice with explanations
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* ================= AFTER YOU RECEIVE LL ================= */}
      <section className="fastag-offer-section after-ll-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">After You Receive</span>{" "}
                <span className="osa">LL</span>
              </h2>
              <p className="fastag-section-description">
                Next steps to practice safely and move towards a permanent license.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/ll1.png" alt="Place L Sign" width="30" />
                </div>
                <h4 className="fastag-feature-title">Place an "L" sign on the vehicle</h4>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/ll2.png" alt="Carry LL" width="30" />
                </div>
                <h4 className="fastag-feature-title">Carry LL while driving and be accompanied by a licensed</h4>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/ll3.png" alt="LL Validity" width="30" />
                </div>
                <h4 className="fastag-feature-title">LL validity: typically 6 months (varies by state)</h4>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/ll4.png" alt="Apply for Permanent License" width="30" />
                </div>
                <h4 className="fastag-feature-title">Apply for Permanent License after 30 days of LL</h4>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY CHOOSE CAROSA ================= */}
      <section className="fastag-why-matters-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why Choose</span> <span className="osa">Carosa?</span>
              </h2>
              <p className="fastag-section-description">
                Expert guidance, verified partners, and end-to-end support.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/learnerWhy.png" 
                    alt="End-to-end guidance" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <h4 className="fastag-feature-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#0C3E8B', marginBottom: '4px' }}>End-to-end guidance—</h4>
                <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0 }}>
                  forms, slots & follow-ups
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/learnerWhy2.png" 
                    alt="Fast verification" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <h4 className="fastag-feature-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#0C3E8B', marginBottom: '4px' }}>Fast verification & minimal</h4>
                <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0 }}>
                  rejections
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/learnerWhy3.png" 
                    alt="Local RTO knowledge" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <h4 className="fastag-feature-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#0C3E8B', marginBottom: '4px' }}>Local RTO knowledge &</h4>
                <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0 }}>
                  state-wise compliance
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/learnerWhy4.png" 
                    alt="Instructor-led practice" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <h4 className="fastag-feature-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#0C3E8B', marginBottom: '4px' }}>Option for instructor-led</h4>
                <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0 }}>
                  practice sessions
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= PRICING & PLANS ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Pricing &</span>{" "}
                <span className="osa">Plans</span>
              </h2>
              <p className="fastag-section-description">
                Simple, transparent plans with no hidden charges.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X justify-content-center">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerPrice.png" alt="Basic Plan" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Basic Plan</h4>
                  <p className="eligibility-text">
                    Document check + form filling
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerPrice.png" alt="Standard Plan" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Standard Plan</h4>
                  <p className="eligibility-text">
                    Includes mock tests + slot booking
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerPrice.png" alt="Premium Plan" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title">Premium Plan</h4>
                  <p className="eligibility-text">
                    End-to-end assistance + support
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= STATE-WISE NOTES ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">State-wise</span>{" "}
                <span className="osa">Notes</span>
              </h2>
              <p className="fastag-section-description">
                Important state-specific rules, timelines, and test guidelines.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X justify-content-center">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="Processing Times" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>Processing times & forms may vary by RTO</h4>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="Test Format" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>Some states require online tests; others are offline</h4>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="Document Formats" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>Document upload formats (PDF/JPG) may differ</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= LL VS PL ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">LL</span> vs <span className="osa">PL</span>
              </h2>
              <p className="fastag-section-description">
                Complete assistance from learning to licensing.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X justify-content-center">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="LL Info" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>LL: For practice only, requires accompaniment</h4>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="PL Info" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>PL: Allows independent driving after passing skill test</h4>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="eligibility-card">
                <div className="eligibility-icon-wrapper eligibility-icon-img-wrapper">
                  <img src="/images/learnerState.png" alt="Test Info" className="eligibility-icon-img" />
                </div>
                <div className="eligibility-content">
                  <h4 className="eligibility-title" style={{ color: '#111827', fontWeight: '700' }}>PL test assesses on-road driving skills; LL is prerequisite</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="fastag-faq-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="mx-auto">
              <div className="fastag-faq-wrapper">
                <div className="fastag-faq-header">
                  <h2 className="fastag-faq-title">
                    <span className="fastag-faq-title-green">Full FAQ</span> — <span className="fastag-faq-title-blue">Learner's Licence Assistance</span>
                  </h2>
                  <div className="fastag-faq-divider"></div>
                </div>
                <div className="fastag-faq-container">
                  {faqs.map((faq, index) => (
                    <div key={index} className="fastag-faq-item-box">
                      <button
                        className="fastag-faq-question"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="fastag-faq-question-text">{faq.question}</span>
                        {openFaq === index ? (
                          <FaChevronUp className="fastag-faq-icon" />
                        ) : (
                          <FaChevronDown className="fastag-faq-icon" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="fastag-faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= DOWNLOAD APP SECTION ================= */}
      <section className="fastag-app-download-section">
        <Container>
          <Row className="align-items-center g-4">

            {/* LEFT IMAGE */}
            <Col lg={6} className="text-center">
              <Image
                src="/images/app-mockup.png"
                alt="App Preview"
                width={520}
                height={380}
                className="img-fluid"
                priority
              />
            </Col>

            {/* RIGHT CONTENT */}
            <Col lg={6} className="d-flex flex-column justify-content-center">
              <h2 className="fastag-app-title mb-2">
                Download the App Free
              </h2>

              <p className="fastag-app-description mb-4">
                Join Millions of people who build a fully integrated
                sales and marketing solution.
              </p>

              {/* BUTTONS */}
              <div className="download-buttons d-flex gap-3 mt-2 flex-wrap">

                {/* GOOGLE PLAY */}
                <a href="#" className="store-btn btn btn-dark">
                  <Image
                    src="/images/google-play.png"
                    alt="Google Play"
                    width={22}
                    height={22}
                  />
                  <div className="store-text">
                    <small>Get it on</small>
                    <strong>Google Play</strong>
                  </div>
                </a>

                {/* APP STORE */}
                <a href="#" className="store-btn btn btn-dark">
                  <Image
                    src="/images/apple-icon.png"
                    alt="App Store"
                    width={22}
                    height={22}
                  />
                  <div className="store-text">
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </div>
                </a>

              </div>
            </Col>

          </Row>
        </Container>
      </section>

    </div>
  );
}
