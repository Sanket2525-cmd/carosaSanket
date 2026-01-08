"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";

export default function OwnershipCalculatorPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How accurate is the ownership cost calculation?",
      answer: "Our calculations are based on real-time market data, average fuel prices, insurance rates, maintenance costs, and depreciation trends. While individual costs may vary, we provide accurate estimates based on comprehensive data analysis."
    },
    {
      question: "Can I compare multiple cars?",
      answer: "Yes, you can use the calculator multiple times to compare different vehicles side-by-side and see which car offers better long-term value."
    },
    {
      question: "Does it include resale value?",
      answer: "Yes, our calculator includes depreciation calculations showing predicted resale value over time (1, 3, and 5 years) based on vehicle make, model, and market trends."
    },
    {
      question: "Will this tool work for used cars?",
      answer: "Yes, the ownership cost calculator works for both new and used cars. You can input the current market value or purchase price of a used vehicle to calculate its ongoing ownership costs."
    },
    {
      question: "Does it cover electric vehicles (EVs)?",
      answer: "Yes, our calculator supports electric vehicles and includes charging costs, battery maintenance, and other EV-specific expenses in the calculation."
    },
    {
      question: "Can I change fuel prices in the tool?",
      answer: "Yes, the calculator uses default fuel prices but allows you to customize fuel prices based on your location and current market rates for more accurate calculations."
    },
    {
      question: "Does it include road tax?",
      answer: "Yes, the calculator includes both one-time registration fees and recurring road tax charges based on your vehicle and state regulations."
    },
    {
      question: "Is the report downloadable?",
      answer: "Yes, you can download your ownership cost report in PDF format for future reference and comparison purposes."
    },
    {
      question: "Will it include my current loan EMI?",
      answer: "Yes, if you're financing your car, you can input your loan details (principal, interest rate, tenure) and the calculator will include monthly EMI payments in the ownership cost breakdown."
    },
    {
      question: "Is it free to use?",
      answer: "Yes, Carosa's ownership cost calculator is completely free to use. Simply enter your vehicle details and get comprehensive cost estimates without any charges."
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
              It’s more than just the
            </h6>

            <h1 className="fastag-hero-title">
              PRICE TAG CALCULATE <br />
              THE TRUE COST OF <br />
              <span style={{ color: "#86CB3A" }}>
                OWNING A CAR
              </span>
            </h1>

            <p className="fastag-hero-subtitle">
              Find out the complete ownership cost including fuel, insurance,
              maintenance, loan EMIs, depreciation, and more before you buy.
            </p>

            <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
              <Button className="fastag-btn-primary rounded-5">
                Calculate Now
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
              style={{ marginLeft: "-85px" }}
            >
              <img
                src="/images/ownershipCostHero.png"
                alt="Car Ownership Cost Calculator"
                className="insurance-hero-img"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                }}
              />
            </div>
          </Col>

        </Row>
      </Container>
    </section>

    {/* ================= WHY IT MATTERS & QUICK CALCULATOR SECTION ================= */}
    <section className="warranty-quote-section">
      <Container>
        {/* WHY IT MATTERS HEADER */}
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <div className="text-center mb-4">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why It</span>{" "}
                <span className="osa">Matters</span>
              </h2>
              <p className="fastag-section-description">
                Many buyers underestimate the ongoing costs. Carosa helps you plan your budget smarter and choose wisely.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="warranty-quote-card" style={{ padding: '24px' }}>
              {/* FORM HEADER */}
              <div className="warranty-quote-header">
                <h2 className="warranty-quote-title" style={{ textAlign: 'left', marginBottom: '16px' }}>
                  Quick Calculator
                </h2>
              </div>

              {/* FORM */}
              <form className="warranty-quote-form">
                {/* FIRST ROW */}
                <Row className="g-2 mb-2">
                  <Col md={6} lg={6}>
                    <label className="warranty-form-label">Make & Model</label>
                    <select className="form-select warranty-form-select">
                      <option>Make & Model</option>
                      <option>Maruti Swift</option>
                      <option>Maruti Alto</option>
                      <option>Hyundai Creta</option>
                      <option>Hyundai i20</option>
                      <option>Tata Nexon</option>
                      <option>Mahindra XUV700</option>
                    </select>
                  </Col>
                  <Col md={6} lg={6}>
                    <label className="warranty-form-label">Fuel Type</label>
                    <select className="form-select warranty-form-select">
                      <option>Fuel Type</option>
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>CNG</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </Col>
                </Row>

                {/* SECOND ROW */}
                <Row className="g-2 mb-2">
                  <Col md={12} lg={12}>
                    <label className="warranty-form-label">On road Price</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="On road Price"
                    />
                  </Col>
                </Row>

                {/* THIRD ROW - Split */}
                <Row className="g-2 mb-3">
                  <Col md={6} lg={6}>
                    <label className="warranty-form-label">Daily kms driven</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="Daily kms driven"
                    />
                  </Col>
                  <Col md={6} lg={6}>
                    <label className="warranty-form-label">Average kmpl / km per</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="Average kmpl / km per"
                    />
                  </Col>
                </Row>

                {/* SUBMIT BUTTON */}
                <div className="warranty-form-submit">
                  <button type="submit" className="warranty-submit-btn" style={{ backgroundColor: '#F28B18', border: 'none' }}>
                    Calculate Now
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= WHAT'S INCLUDED IN THE CALCULATION SECTION ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What's Included in the</span>{" "}
              <span className="osa">Calculation</span>
            </h2>
            <p className="fastag-section-description">
              A complete view of what your car truly costs over time.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation1.png" alt="Purchase Price" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Purchase Price</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  On-road cost including taxes.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation2.png" alt="Loan EMI Details" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Loan EMI Details</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Monthly installments if financed.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation3.png" alt="Insurance Premiums" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Insurance Premiums</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Yearly renewal estimates.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation4.png" alt="Fuel Costs" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Fuel Costs</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Based on mileage and daily distance.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation5.png" alt="Maintenance & Repairs" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Maintenance & Repairs</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Service schedule cost.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculatio6.png" alt="Registration & Road Tax" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Registration & Road Tax</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  One-time & recurring fees.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculatio7.png" alt="Depreciation" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Depreciation</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Predicted resale value over time.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/calculation3.png" alt="Miscellaneous" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Miscellaneous</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Parking, tolls, accessories.
                </p>
              </div>
            </div>
          </Col>
        </Row>
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
            Smart calculations based on real usage, not guesswork.
          </p>
        </div>

        {/* SINGLE IMAGE */}
        <div className="text-center mb-4">
          <Image
            src="/images/ownerHow.png"
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
            <h6 className="step-title">Enter vehicle details</h6>
            <p className="step-desc">
              Make, model, fuel type & variant.
            </p>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Add driving data</h6>
            <p className="step-desc">
              Daily kms, city/highway split, fuel prices.
            </p>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">View Details</h6>
            <p className="step-desc">
              View 1 / 3 / 5 year ownership cost report.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ================= WHY USE CAROSA COST OF OWNERSHIP TOOL SECTION ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Use</span>{" "}
              <span className="osa">Carosa</span>{" "}
              <span className="text-primary">Cost of Ownership Tool?</span>
            </h2>
            <p className="fastag-section-description">
              Because the cheapest car isn't always the most affordable.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row justify-content-center">
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/ownerWhy1.png" alt="Complete Breakdown" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Complete Breakdown</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Fuel, insurance, maintenance, EMIs, taxes & depreciation
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/ownerWhy2.png" alt="Tailored to You" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Tailored to You</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Based on your driving habits & location
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/ownerWhy3.png" alt="Compare Cars" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Compare Cars</h4>
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  See which car is more affordable long-term
                </p>
              </div>
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
