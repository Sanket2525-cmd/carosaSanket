"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";

export default function PDIHeroSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "When should I do a PDI?",
      answer: "Before signing delivery documents or making final payment."
    },
    {
      question: "Can Carosa do PDI at the dealership?",
      answer: "Yes, our expert inspectors can visit the dealership or seller location to perform the PDI inspection on-site."
    },
    {
      question: "How long does a PDI take?",
      answer: "A comprehensive PDI typically takes 45-60 minutes, depending on the vehicle type and thoroughness of inspection required."
    },
    {
      question: "What if issues are found?",
      answer: "If issues are found during PDI, we document them in detail with photos. You can use this report to request repairs or negotiate terms with the dealer before finalizing the purchase."
    },
    {
      question: "Can you inspect both new and used cars?",
      answer: "Yes, Carosa provides PDI services for both new vehicles (pre-delivery) and used cars (pre-purchase inspection) to ensure quality and identify potential issues."
    },
    {
      question: "Do you provide a written report?",
      answer: "Yes, you will receive a detailed written report with photos, notes, and recommendations. The report is available in both printed and digital formats."
    },
    {
      question: "Is PDI necessary for used cars too?",
      answer: "Yes, PDI is highly recommended for used cars as well to identify hidden mechanical issues, verify documentation, and ensure the car matches the advertised specifications."
    },
    {
      question: "Will you verify documents too?",
      answer: "Yes, our PDI includes verification of RC, insurance, invoice, warranty booklet, service history, and all necessary documents to ensure everything is in order."
    },
    {
      question: "Can I be present during the inspection?",
      answer: "Yes, you are welcome to be present during the inspection. Many customers prefer to be there to see the process firsthand and ask questions."
    },
    {
      question: "Do you charge extra for outstation PDIs?",
      answer: "Charges for outstation PDIs may vary based on location and distance. Please contact us with your location details for a transparent quote with no hidden charges."
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
            <h6 className="text-uppercase text-primary mb-2">
              Before you take
            </h6>

            <h1 className="fastag-hero-title">
              THE KEYS, LET'S MAKE <br />
              SURE <span className="text-success">IT'S PERFECT</span>
            </h1>

            <p className="fastag-hero-subtitle">
              A detailed inspection to ensure your car is safe, damage-free,
              and exactly as promised before you take delivery.
            </p>

            <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
              <Button className="fastag-btn-primary rounded-5">
                Book PDI Now
              </Button>

              <Button className="fastag-btn-secondary rounded-5">
                Download Sample Report
              </Button>
            </div>
          </Col>

          {/* RIGHT IMAGE */}
          <Col lg={5} className="px-0">
            <div
              className="fastag-hero-illustration text-end"
              style={{ marginLeft: "-85px" }}   // 👈 halka sa left
            >
              <img
                src="/images/pdiHero.png"
                alt="Pre Delivery Inspection"
                className="insurance-hero-img"
                style={{
                  width: "90%",
                  maxWidth: "480px",
                  height: "auto",
                }}
              />
            </div>
          </Col>

        </Row>
      </Container>
    </section>

    {/* ================= WHAT WE OFFER SECTION ================= */}
    <section className="fastag-offer-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What We</span>{" "}
              <span className="osa">Offer</span>
            </h2>
            <p className="fastag-section-description">
              A final quality check to ensure your car is delivery-ready and problem-free.
            </p>
          </Col>
        </Row>
        <Row className="g-4 padding-Y-X justify-content-center">
          <Col xs={12} sm={6} md={4} lg={2} xl={2}>
            <div className="fastag-feature-card" style={{ backgroundColor: '#E5E5E5' }}>
              <img src="/images/pdi.png" alt="Catch Issues Early" className="fastag-feature-image documents-required-icon" />
              <h4 className="fastag-feature-title">Catch Issues Early</h4>
              <p className="fastag-feature-text">
                Spot defects before accepting the car.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} xl={2}>
            <div className="fastag-feature-card" style={{ backgroundColor: '#E5E5E5' }}>
              <img src="/images/pdi2.png" alt="Specifications Match" className="fastag-feature-image documents-required-icon" />
              <h4 className="fastag-feature-title">Specifications Match</h4>
              <p className="fastag-feature-text">
                Variant, color & features verified.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} xl={2}>
            <div className="fastag-feature-card" style={{ backgroundColor: '#E5E5E5' }}>
              <img src="/images/pdi3.png" alt="Peace of Mind" className="fastag-feature-image documents-required-icon" />
              <h4 className="fastag-feature-title">Peace of Mind</h4>
              <p className="fastag-feature-text">
                No disputes after delivery.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} xl={2}>
            <div className="fastag-feature-card" style={{ backgroundColor: '#E5E5E5' }}>
              <img src="/images/pdi4.png" alt="Mechanical Check" className="fastag-feature-image documents-required-icon" />
              <h4 className="fastag-feature-title">Mechanical Check</h4>
              <p className="fastag-feature-text">
                Brakes, suspension & engine.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2} xl={2}>
            <div className="fastag-feature-card" style={{ backgroundColor: '#E5E5E5' }}>
              <img src="/images/pdi5.png" alt="Cosmetic Perfection" className="fastag-feature-image documents-required-icon" />
              <h4 className="fastag-feature-title">Cosmetic Perfection</h4>
              <p className="fastag-feature-text">
                No scratches, dents or mismatch.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= WHAT'S COVERED IN OUR PDI SECTION ================= */}
    <section className="fastag-offer-section inspection-report-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What's Covered in Our</span>{" "}
              <span className="osa">PDI</span>
            </h2>
            <p className="fastag-section-description">
              Every critical check that matters before you take the keys.
            </p>
          </Col>
        </Row>

        <div className="padding-Y-X">
          {/* FIRST ROW: 2 Cards */}
          <Row className="g-4 justify-content-center mb-4">
            {/* Card 1: Exterior Inspection */}
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="inspection-report-card" style={{ backgroundColor: '#E5E5E5' }}>
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/pdiCovered1.png" alt="Exterior Inspection" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Exterior Inspection</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Paint finish & color matching
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Dent & scratch check
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Glass, lights, mirrors
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Tyre size & tread depth
                  </li>
                </ul>
              </div>
            </Col>

            {/* Card 2: Interior Inspection */}
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="inspection-report-card" style={{ backgroundColor: '#E5E5E5' }}>
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/pdiCovered2.png" alt="Interior Inspection" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Interior Inspection</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Upholstery & trims
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Dashboard & infotainment
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    AC & climate control
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Seat & seatbelt operation
                  </li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* SECOND ROW: 2 Cards */}
          <Row className="g-4 justify-content-center">
            {/* Card 3: Mechanical & Electrical */}
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="inspection-report-card" style={{ backgroundColor: '#E5E5E5' }}>
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/pdiCovered3.png" alt="Mechanical & Electrical" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Mechanical & Electrical</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Engine start & idle test
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Brakes & ABS check
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Suspension bounce test
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Lights, horn, indicators
                  </li>
                </ul>
              </div>
            </Col>

            {/* Card 4: Documents & Accessories */}
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="inspection-report-card" style={{ backgroundColor: '#E5E5E5' }}>
                <div className="inspection-report-icon-wrapper">
                  <img src="/images/pdiCovered4.png" alt="Documents & Accessories" className="inspection-report-icon" />
                </div>
                <h4 className="inspection-report-title">Documents & Accessories</h4>
                <ul className="inspection-report-list">
                  <li>
                    <span className="check-icon">✓</span>
                    RC, insurance, invoice
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Warranty & service booklet
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Spare key availability
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Toolkit, jack, stepney
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
            Simple, fast, and transparent.
          </p>
        </div>

        {/* SINGLE IMAGE */}
        <div className="text-center mb-4">
          <Image
            src="/images/pdiHow.png"
            alt="How It Works"
            width={1100}
            height={220}
            className="img-fluid"
            priority
          />
        </div>

        {/* TEXT BELOW IMAGE */}
        <div className="row text-center g-4 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Book Your PDI</h6>
            <p className="step-desc">
              Schedule before delivery date.
            </p>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">We Inspect On-Site</h6>
            <p className="step-desc">
              Expert visits dealer/seller location.
            </p>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Get a Detailed Report</h6>
            <p className="step-desc">
              Photos, notes, recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ================= WHY IT MATTERS SECTION ================= */}
    <section className="fastag-why-matters-section py-5">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why It</span> <span className="osa">Matters</span>
            </h2>
            <p className="fastag-section-description">
              Carosa ensures your first drive is worry-free. Without a PDI, you risk:
            </p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <div className="fastag-benefit-card">
              <div className="fastag-benefit-icon-wrapper">
                <Image 
                  src="/images/pdiWhy1.png" 
                  alt="Scratches or dents" 
                  width={60} 
                  height={60}
                  className="fastag-benefit-image mb-2"
                />
              </div>
              <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0, fontWeight: '700' }}>
                Scratches or dents not covered later.
              </p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="fastag-benefit-card">
              <div className="fastag-benefit-icon-wrapper">
                <Image 
                  src="/images/pdiWhy2.png" 
                  alt="Missing accessories" 
                  width={60} 
                  height={60}
                  className="fastag-benefit-image mb-2"
                />
              </div>
              <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0, fontWeight: '700' }}>
                Missing accessories or spare Parts keys etc.
              </p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="fastag-benefit-card">
              <div className="fastag-benefit-icon-wrapper">
                <Image 
                  src="/images/pdiWhy3.png" 
                  alt="Hidden mechanical issues" 
                  width={60} 
                  height={60}
                  className="fastag-benefit-image mb-2"
                />
              </div>
              <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0, fontWeight: '700' }}>
                Hidden mechanical & Technical issues.
              </p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="fastag-benefit-card">
              <div className="fastag-benefit-icon-wrapper">
                <Image 
                  src="/images/pdiWhy4.png" 
                  alt="Wrong variant" 
                  width={60} 
                  height={60}
                  className="fastag-benefit-image mb-2"
                />
              </div>
              <p className="fastag-benefit-text" style={{ fontSize: '0.938rem', color: '#0C3E8B', margin: 0, fontWeight: '700' }}>
                Wrong variant or missing features.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
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
