"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";


export default function InspectionHeroSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does a car inspection take?",
      answer: "A full inspection typically takes 30-45 minutes, depending on the vehicle's condition."
    },
    {
      question: "Do I need to be present during the inspection?",
      answer: "While your presence is not mandatory, we recommend being available to answer questions and see the inspection process firsthand."
    },
    {
      question: "Can the inspection detect accidental or flood damage?",
      answer: "Yes, our comprehensive 200+ point inspection includes checks for accident history, flood damage, and structural issues that may not be visible to the naked eye."
    },
    {
      question: "Is the valuation accurate?",
      answer: "Our valuations are based on current market prices, vehicle condition, mileage, and other factors. We use real-time data to provide accurate market value estimates."
    },
    {
      question: "Is the service free?",
      answer: "Inspection services may have associated fees. Please check our pricing plans or contact us for detailed information about inspection costs."
    },
    {
      question: "Can I get the inspection report for my insurance claim?",
      answer: "Yes, our detailed inspection report can be used to support insurance claims, providing documented evidence of your vehicle's condition."
    },
    {
      question: "Do you offer doorstep inspections?",
      answer: "Yes, we offer doorstep inspection services for your convenience. You can choose between visiting our inspection centre or requesting a home inspection."
    },
    {
      question: "What tools do you use for inspection?",
      answer: "We use professional diagnostic tools, OBD scanners, paint thickness meters, and other specialized equipment to conduct a thorough 200+ point inspection."
    },
    {
      question: "Will the inspection affect my car in any way?",
      answer: "No, our inspection is completely non-invasive and will not affect your car in any way. We only perform visual checks, scans, and measurements."
    },
    {
      question: "How soon will I get my valuation report?",
      answer: "You will receive your valuation report immediately after the inspection is completed, available both in printed and digital formats."
    }
  ];

  return (
    <div>
    <section className="fastag-hero-section insurance-hero">
      <Container fluid>
        <Row className="align-items-center">

          {/* LEFT CONTENT */}
          <Col
            lg={7}
            className="padding-Y-X"
            style={{ marginTop: "-20px", paddingLeft: "30px" }}
          >
            <h1 className="fastag-hero-title pt-4">
              GET YOUR CAR'S TRUE <br />
              VALUE WITH 200+ POINT <br />
              INSPECTION
            </h1>

            <p className="fastag-hero-subtitle">
              Accurate, transparent, and professional inspection so you know
              exactly what your car is worth before selling or buying.
            </p>

            <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
              <Button className="fastag-btn-primary rounded-5">
                Book free inspection
              </Button>

              <Button className="fastag-btn-secondary rounded-5">
                Download Sample report
              </Button>
            </div>
          </Col>

          {/* RIGHT IMAGE */}
          <Col lg={5} className="px-0">
            <div className="fastag-hero-illustration text-end">
              <img
                src="/images/inspectionHero.png"
                alt="Car Inspection"
                className="w-100 insurance-hero-img"
              />
            </div>
          </Col>

        </Row>

      </Container>
    </section>

    {/* ================= WHY CHOOSE CAROSA FOR INSPECTION ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Choose</span>{" "}
              <span className="osa">Carosa</span>
            </h2>
            <p className="fastag-section-description">
              Comprehensive inspection services for accurate vehicle valuation.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside1.png" alt="200+ Point Check" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">200+ Point Check</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Mechanical, electrical & cosmetic
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside2.png" alt="Certified Inspectors" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Certified Inspectors</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Experienced professionals
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside3.png" alt="Instant Market Value" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Instant Market Value</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Real-time pricing
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside4.png" alt="On-site & Doorstep" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">On-site & Doorstep</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  We come to you or you visit our centre
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= COMPLETE TRANSPARENCY SECTION ================= */}
    <section className="before-drive-section">
      <Container>
        <Row>
          <Col lg={7}>
            <div className="before-drive-content">
              <h2 className="before-drive-title">
                Complete <span className="text-green">Transparency</span>
              </h2>
              <h3 className="before-drive-title" style={{ fontSize: '1.75rem', marginBottom: '16px' }}>
                You Can Always <span className="text-green">Trust</span>
              </h3>
              <p className="before-drive-subtitle">
                No hidden deductions at all. Get a clear, easy-to-read report with real photo proof, detailed diagnostic logs, and full inspection details.
              </p>

              {/* Checklist Panels */}
              <Row className="g-3 mb-4">
                <Col md={12}>
                  <div className="checklist-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src="/images/inspection1.png" alt="For Sellers" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      <div>
                        <h6 className="checklist-title" style={{ marginBottom: '4px' }}>For Sellers</h6>
                        <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0 }}>
                          Get the best price without underquoting.
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="checklist-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src="/images/inspection2.png" alt="For Buyers" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      <div>
                        <h6 className="checklist-title" style={{ marginBottom: '4px' }}>For Buyers</h6>
                        <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0 }}>
                          Buy with full knowledge of the car's condition.
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="checklist-panel">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src="/images/inspection3.png" alt="For Owners" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                      <div>
                        <h6 className="checklist-title" style={{ marginBottom: '4px' }}>For Owners</h6>
                        <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0 }}>
                          Plan future repairs & maintenance with clarity.
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Form Panel */}
          <Col lg={5}>
            <div className="estimate-form-card" style={{ marginTop: '-10px', minHeight: '550px' }}>
              <h5 className="form-card-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Instant Valuation</h5>
              <p className="before-drive-subtitle" style={{ fontSize: '0.938rem', color: '#6B7280', marginBottom: '24px' }}>
                Enter basic info to get a quick market valuation.
              </p>
              <form className="row g-3">
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Make</label>
                  <select className="form-select">
                    <option>Select Make</option>
                    <option>Maruti</option>
                    <option>Hyundai</option>
                    <option>Tata</option>
                    <option>Mahindra</option>
                    <option>Honda</option>
                    <option>Toyota</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Model</label>
                  <select className="form-select">
                    <option>Select Model</option>
                    <option>Swift</option>
                    <option>Alto</option>
                    <option>WagonR</option>
                    <option>Baleno</option>
                    <option>Creta</option>
                    <option>i20</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Select year of manufacturing</label>
                  <select className="form-select">
                    <option>Select Year</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                    <option>2020</option>
                    <option>2019</option>
                    <option>2018</option>
                    <option>2017</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Daily kms driven</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter daily kms"
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="estimate-submit-btn" style={{ backgroundColor: '#F28B18', border: 'none', color: '#FFFFFF', width: '100%' }}>
                    Get Valuation
                  </button>
                </div>
                <div className="col-12 text-center">
                  <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: '16px 0' }}>Or</p>
                  <button type="button" className="btn" style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', color: '#059669', width: '100%', padding: '12px' }}>
                    Book an inspection for a detailed report. →
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= WHAT YOU GET IN INSPECTION REPORT SECTION ================= */}
    <section className="fastag-offer-section inspection-report-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What You Get in</span>{" "}
              <span className="osa">Inspection Report</span>
            </h2>
            <p className="fastag-section-description">
              A detailed, transparent report that shows the true condition of the car — inside and out.
            </p>
          </Col>
        </Row>

        <div className="padding-Y-X">
          {/* FIRST ROW: 2 Cards */}
          <Row className="g-4 justify-content-center mb-4">
            {/* Card 1: Exterior & Body */}
            <Col xs={12} sm={6} md={5} lg={5}>
              <div className="inspection-report-card">
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/inspectionReport1.png" alt="Exterior & Body" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Exterior & Body</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Paint condition
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Dent, scratch, and rust inspection
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Accident or flood damage detection
                  </li>
                </ul>
              </div>
            </Col>

            {/* Card 2: Interior & Features */}
            <Col xs={12} sm={6} md={5} lg={5}>
              <div className="inspection-report-card">
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/inspectionReport2.png" alt="Interior & Features" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Interior & Features</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Upholstery & dashboard condition
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Functionality of AC
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Power windows, etc.
                  </li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* SECOND ROW: 2 Cards */}
          <Row className="g-4 justify-content-center mb-4">
            {/* Card 3: Engine & Mechanical */}
            <Col xs={12} sm={6} md={5} lg={5}>
              <div className="inspection-report-card">
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/inspectionReport3.png" alt="Engine & Mechanical" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Engine & Mechanical</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Engine health & performance, Brakes
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Transmission & clutch
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Suspension, and steering
                  </li>
                </ul>
              </div>
            </Col>

            {/* Card 4: Tires & Wheels */}
            <Col xs={12} sm={6} md={5} lg={5}>
              <div className="inspection-report-card">
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/inspectionReport4.png" alt="Tires & Wheels" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Tires & Wheels</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Tread depth
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Alloy & rim condition
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Spare tyre availability
                  </li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* THIRD ROW: 1 Card (Spans from 3rd to 4th card width) */}
          <Row className="g-4 justify-content-center">
            {/* Card 5: Documentation */}
            <Col xs={12} sm={10} md={10} lg={10}>
              <div className="inspection-report-card">
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/inspectionReport2.png" alt="Documentation" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Documentation</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    RC verification
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Loan/hypothecation check
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Insurance status & validity
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    PUC certificate check
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>

    <section className="how-carosa-section">
      <div className="container">
        {/* HEADING */}
        <div className="text-center mb-4">
          <h2 className="fastag-section-title">
            <span className="text-primary">How It</span>{" "}
            <span className="osa">Works</span>
          </h2>
          <p className="fastag-section-description">
            A transparent inspection process that shows the real condition of the car.
          </p>
        </div>

        {/* SINGLE IMAGE */}
        <div className="text-center mb-4">
          <Image
            src="/images/inspectionHow.png"
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
            <h6 className="step-title">Book Inspection</h6>
            <p className="step-desc">
              Choose a centre slot or request doorstep service.
            </p>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="step-title">Detailed Check-Up</h6>
            <p className="step-desc">
              200+ point physical & diagnostic inspection.
            </p>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="step-title">Instant Valuation</h6>
            <p className="step-desc">
              Printed & digital valuation report.
            </p>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="step-title">Sell or Keep</h6>
            <p className="step-desc">
              Sell to verified buyers or keep your car.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    <section className="fastag-faq-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mx-auto">
            <div className="fastag-faq-wrapper">
              <div className="fastag-faq-header">
                <h2 className="fastag-faq-title">
                  <span className="fastag-faq-title-green">Frequently</span>{" "}
                  <span className="fastag-faq-title-blue">Asked Questions</span>
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
                      <span className="fastag-faq-question-text">
                        {faq.question}
                      </span>
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
          </div>
        </div>
      </div>
    </section>

    {/* ================= DOWNLOAD APP SECTION ================= */}
    <section className="fastag-app-download-section">
      <div className="container">
        <div className="row align-items-center g-4">
          {/* LEFT IMAGE */}
          <div className="col-lg-6 text-center">
            <Image
              src="/images/app-mockup.png"
              alt="App Preview"
              width={520}
              height={380}
              className="img-fluid"
              style={{ marginTop: "20px" }}
              priority
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <h2 className="fastag-app-title mb-2">Download the App Free</h2>

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
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
