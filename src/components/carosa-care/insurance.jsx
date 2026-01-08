

"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";

export default function InsurancePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the difference between third-party and comprehensive insurance?",
      answer: "Third-party insurance covers damages to another person or their property, while comprehensive insurance covers both third-party damages and your own vehicle damage, theft, and natural disasters."
    },
    {
      question: "Is car insurance mandatory?",
      answer: "Yes, third-party car insurance is mandatory by law in India. However, comprehensive insurance is optional but highly recommended for better protection."
    },
    {
      question: "How is premium calculated?",
      answer: "Premium is calculated based on factors such as vehicle make and model, age, location, IDV (Insured Declared Value), add-ons selected, and your claim history."
    },
    {
      question: "What is Zero Depreciation?",
      answer: "Zero Depreciation (also called Nil Depreciation) is an add-on that ensures you get the full claim amount without deducting depreciation value of parts during repairs."
    },
    {
      question: "Can I transfer insurance to new owner?",
      answer: "Yes, you can transfer your car insurance policy to the new owner when selling your vehicle. You need to inform your insurer and submit the required documents."
    },
    {
      question: "What is NCB?",
      answer: "NCB (No Claim Bonus) is a discount on your premium that you earn for not making any claims during the policy period. It can go up to 50% after 5 claim-free years."
    },
    {
      question: "How quickly will I get policy?",
      answer: "You can get your e-policy instantly via email after successful payment. The policy document is usually sent within a few minutes of purchase."
    },
    {
      question: "Required documents?",
      answer: "You'll need documents like vehicle RC (Registration Certificate), previous policy (if renewing), driver's license, and vehicle photographs for insurance."
    },
    {
      question: "What is cashless claim?",
      answer: "Cashless claim allows you to get your vehicle repaired at network garages without paying upfront. The insurer settles the bill directly with the garage."
    },
    {
      question: "Can I renew expired policy?",
      answer: "Yes, you can renew an expired policy. However, if the policy has been expired for more than 90 days, you may need to get the vehicle inspected again."
    },
    {
      question: "Does insurance cover engine damage?",
      answer: "Basic comprehensive insurance covers engine damage due to accidents or external factors. However, damage due to water ingression, oil leakage, or mechanical breakdown may require specific add-ons."
    }
  ];

  return (
    <div className="fastag-recharge-page">
      {/* Hero Section */}
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
                DRIVE WITH <br />
                CONFIDENCE – WE'VE GOT <br />
                <span className="fastag-hero-highlight">
                  YOU COVERED
                </span>
              </h1>

              <p className="fastag-hero-subtitle">
                Get the best car insurance plans at competitive rates,
                with quick claim assistance and zero hidden charges.
              </p>

              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <Button className="fastag-btn-primary rounded-5">
                  Get Quote
                </Button>

                <Button className="fastag-btn-secondary rounded-5">
                  Renew Now
                </Button>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={5} className="px-0">
              <div className="fastag-hero-illustration text-end">
                <img
                  src="/images/insurance-hero.png"
                  alt="Car Insurance"
                  className="w-100 insurance-hero-img"
                />
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      {/* Insurance Features & Quick Form Section */}
      <section className="insurance-features-section">
        <Container>
          <Row className="align-items-start">
            {/* LEFT CONTENT */}
            <Col lg={7}>
              <div className="insurance-content">
                <h2 className="insurance-main-title">
                  Trusted and Verified Insurance with Instant Policies and Zero{" "}
                  <span className="text-green">Hidden Fees</span>
                </h2>
                <p className="insurance-description">
                  Trusted by thousands of car owners for safe, transparent, and hassle-free insurance services with clear pricing and quick support.
                </p>
                <p className="insurance-tagline">
                  Authentic Data • Fast Policies • No Hidden Charges
                </p>

                {/* Feature Cards Grid */}
                <Row className="g-3 mt-3">
                  <Col md={6}>
                    <div className="insurance-feature-card">
                      <img
                        src="/images/check.png"
                        alt="Multiple Partners"
                        className="insurance-check-icon"
                      />
                      <div className="insurance-feature-content">
                        <h6 className="insurance-feature-title">Multiple Partners</h6>
                        <p className="insurance-feature-text">Compare and choose the best.</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="insurance-feature-card">
                      <img
                        src="/images/check.png"
                        alt="Instant Policy"
                        className="insurance-check-icon"
                      />
                      <div className="insurance-feature-content">
                        <h6 className="insurance-feature-title">Instant Policy</h6>
                        <p className="insurance-feature-text">No delays, no hassles.</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="insurance-feature-card">
                      <img
                        src="/images/check.png"
                        alt="Cashless Repairs"
                        className="insurance-check-icon"
                      />
                      <div className="insurance-feature-content">
                        <h6 className="insurance-feature-title">Cashless Repairs</h6>
                        <p className="insurance-feature-text">Across 5,000+ partner garages.</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="insurance-feature-card">
                      <img
                        src="/images/check.png"
                        alt="24x7 Claim Support"
                        className="insurance-check-icon"
                      />
                      <div className="insurance-feature-content">
                        <h6 className="insurance-feature-title">24x7 Claim Support</h6>
                        <p className="insurance-feature-text">Hassle-free claim settlement.</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* RIGHT FORM */}
            <Col lg={5}>
              <div className="insurance-form-card">
                <h5 className="insurance-form-title">Get Insurance - Quick Form</h5>
                <p className="insurance-form-subtitle">
                  Enter basic info to get a quick Insurance valuation.
                </p>
                <form className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Car Registration Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter City"
                    />
                  </div>
                  <div className="col-12 d-flex gap-3">
                    <Button className="insurance-btn-estimate">
                      Get a quick estimate
                    </Button>
                    <Button className="insurance-btn-renew">
                      Renew Now
                    </Button>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY CHOOSE CAROSA FOR CAR INSURANCE ================= */}
      <section className="fastag-offer-section why-choose-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why Choose Carosa for </span>
                <span className="osa">Car Insurance?</span>
              </h2>
              <p className="fastag-section-description">
                Because insurance should be simple, transparent, and reliable.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X why-choose-row">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <img src="/images/insuranceWhy1.png" alt="Multiple Insurance Partners" className="insurance-why-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Multiple Insurance Partners</h4>
                  <p className="fastag-feature-text">
                    Compare and choose the best.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <img src="/images/insuranceWhy2.png" alt="Instant Policy Issuance" className="insurance-why-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Instant Policy Issuance</h4>
                  <p className="fastag-feature-text">
                    No delays, no hassles.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card">
                <img src="/images/insuranceWhy3.png" alt="Cashless Repairs" className="insurance-why-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Cashless Repairs</h4>
                  <p className="fastag-feature-text">
                    Across 5,000+ partner garages.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
              <div className="fastag-feature-card">
                <img src="/images/insuranceWhy4.png" alt="24x7 Claim Support" className="insurance-why-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">24x7 Claim Support</h4>
                  <p className="fastag-feature-text">
                    Hassle-free claim settlement.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
              <div className="fastag-feature-card">
                <img src="/images/insuranceWhy5.png" alt="Custom Coverage Options" className="insurance-why-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Custom Coverage Options</h4>
                  <p className="fastag-feature-text">
                    Tailored to your needs.
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
              Buy or renew insurance in just a few simple steps.
            </p>
          </div>

          {/* SINGLE IMAGE */}
          <div className="text-center mb-4">
            <Image
              src="/images/insuranceHow.png"
              alt="How It Works"
              width={1100}
              height={220}
              className="img-fluid"
              priority
            />
          </div>

          {/* TEXT BELOW IMAGE */}
          <div className="row text-center g-4">
            <div className="col-lg-4 col-md-6">
              <h6 className="step-title">Step 01: Choose Your Plan</h6>
              <p className="step-desc">Tell us your car details and coverage preference.</p>
            </div>
            <div className="col-lg-4 col-md-6">
              <h6 className="step-title">Step 02: Compare & Select</h6>
              <p className="step-desc">We'll show you the best options from top insurers.</p>
            </div>
            <div className="col-lg-4 col-md-6">
              <h6 className="step-title">Step 03: Instant Policy</h6>
              <p className="step-desc">Make the payment and get your e-policy instantly via email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TYPES OF INSURANCE PLANS ================= */}
      <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Types of Insurance Plans </span>
                <span className="osa">We Offer</span>
              </h2>
              <p className="fastag-section-description">
                Coverage options for every car and every driver.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X why-choose-row">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType.png" alt="Comprehensive Insurance" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Comprehensive Insurance</h4>
                  <p className="fastag-feature-text">
                    Covers own damage + third-party liability.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType2.png" alt="Third-Party Insurance" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Third-Party Insurance</h4>
                  <p className="fastag-feature-text">
                    Mandatory by law; covers external damage.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType3.png" alt="Own Damage (OD) Cover" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Own Damage (OD) Cover</h4>
                  <p className="fastag-feature-text">
                    Protection from accidents, theft, natural disasters.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType4.png" alt="Zero Depreciation" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Zero Depreciation</h4>
                  <p className="fastag-feature-text">
                    Full claim without depreciation deductions.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType5.png" alt="Add-ons" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <h4 className="fastag-feature-title">Add-ons</h4>
                  <p className="fastag-feature-text">
                    Engine protection, RSA, NCB protection & more.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Supported Banks & Partners Section */}
      <section className="fastag-banks-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="fastag-section-title">
                <span className="text-primary">Supported</span> <span className="osa">Banks <span className="text-primary">&</span> Partners</span>
              </h2>
            </Col>
          </Row>
          <Row className="g-4 align-items-center justify-content-center">
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/sbi.png" alt="SBI" /></div>
              </div>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/icici.png" alt="ICICI Bank" /></div>
              </div>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/hdfc.png" alt="HDFC Bank" /></div>
              </div>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/paytm.png" alt="Paytm" /></div>
              </div>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/airtel.png" alt="Airtel Payments Bank" /></div>
              </div>
            </Col>
            <Col xs={6} sm={4} md={3} lg={2}>
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/axis.png" alt="Axis Bank" /></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY CAROSA INSURANCE IS BETTER ================= */}
      <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why Carosa Insurance is </span>
                <span className="osa">Better</span>
              </h2>
              <p className="fastag-section-description">
                More clarity, more control, and more confidence.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X why-choose-row">
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType.png" alt="Multiple quotes" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                    Multiple quotes in one place save time & money
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType2.png" alt="IRDAI approved" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                    Partnered with top IRDAI- approved insurers
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType3.png" alt="Faster claim settlement" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                    Faster claim settlement with dedicated support team
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card insurance-type-card">
                <img src="/images/insuranceType4.png" alt="Optional add-ons" className="insurance-type-icon" />
                <div className="fastag-feature-content">
                  <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                    Optional add-ons for extra protection
                  </p>
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
                    <span className="fastag-faq-title-green">Frequently</span> <span className="fastag-faq-title-blue">Asked Questions</span>
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
                        <span className="fastag-faq-question-text">Q{index + 1}. {faq.question}</span>
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
