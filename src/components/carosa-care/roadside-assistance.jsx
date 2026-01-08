
"use client";

import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/carosacare.css";

export default function RoadSideAssistancePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How fast will help arrive?",
      answer: "Usually within 30-45 minutes, depending on your location."
    },
    {
      question: "Is RSA available in rural areas?",
      answer: "Yes, RSA services are available in most rural areas, though response times may vary based on location and service provider coverage."
    },
    {
      question: "Will I pay for towing?",
      answer: "Towing costs depend on your RSA plan. Most plans offer free or discounted towing up to a certain distance, with additional charges for longer distances."
    },
    {
      question: "Can I use RSA multiple times?",
      answer: "Yes, most RSA plans allow multiple service calls per year, subject to the terms and limits of your specific plan."
    },
    {
      question: "Does RSA cover accidents?",
      answer: "RSA provides assistance at accident scenes, including coordinating with insurance and workshops. However, accident damage repair costs are typically covered by insurance, not RSA."
    },
    {
      question: "Can I transfer RSA to another car?",
      answer: "RSA plans are usually vehicle-specific, but some plans may allow transfer to a new vehicle. Check your plan terms for specific transfer policies."
    },
    {
      question: "Is RSA included with insurance?",
      answer: "Some insurance policies include RSA as an add-on or benefit. However, standalone RSA plans are also available separately for more comprehensive coverage."
    },
    {
      question: "Can I get fuel delivery anywhere?",
      answer: "Fuel delivery services are available in most urban and semi-urban areas. Availability may be limited in remote locations."
    },
    {
      question: "What if I lock my keys inside?",
      answer: "RSA includes lockout assistance services. A technician will help unlock your car, typically using professional tools without damaging your vehicle."
    },
    {
      question: "Can I buy RSA for an older car?",
      answer: "Yes, RSA plans are available for cars of various ages, though some providers may have age or condition restrictions. Check plan eligibility before purchasing."
    }
  ];
  return (
    <div>
    <section className="fastag-hero-section insurance-hero">
      <Container fluid style={{ position: "relative" }}>

        <Row className="align-items-center">
          {/* LEFT CONTENT */}
          <Col
            lg={7}
            className="padding-Y-X"
            style={{
              marginTop: "-10px",
              paddingLeft: "30px",
              position: "relative",
              zIndex: 5, // 🔥 IMPORTANT
            }}
          >
            <p className="hero-eyebrow">
              ROADSIDE ASSISTANCE
            </p>

            <h1 className="fastag-hero-title pt-2">
              HELP WHEN YOU{" "}
              <span className="fastag-hero-highlight">
                NEED <br /> IT MOST
              </span>
            </h1>

            <p className="fastag-hero-subtitle mt-3">
              24×7 nationwide roadside support for breakdowns, flat tyres,
              dead batteries, accidents, and emergencies.
            </p>

            <div
              className="fastag-cta-buttons d-flex gap-3 flex-wrap mt-4"
              style={{ position: "relative", zIndex: 10 }} // 🔥 IMPORTANT
            >
              <Button
                className="fastag-btn-primary rounded-5 px-4"
                style={{ cursor: "pointer" }}
              >
                Get RSA Now
              </Button>

              <Button
                className="fastag-btn-secondary rounded-5 px-4"
                style={{ cursor: "pointer" }}
              >
                Call for Assistance
              </Button>
            </div>
          </Col>
        </Row>

        {/* IMAGE BELOW LEFT CONTENT */}
        <Row>
          <Col lg={12} className="px-0">
            <div
              className="fastag-hero-illustration"
              style={{
                marginTop: "-290px",
                pointerEvents: "none", // 🔥 KEY FIX
              }}
            >
              <img
                src="/images/rsa-hero.png"
                alt="Roadside Assistance"
                className="w-100 insurance-hero-img"
                style={{ display: "block" }}
              />
            </div>
          </Col>
        </Row>

      </Container>
    </section>

    {/* ================= GET ROADSIDE ASSISTANCE NOW FORM SECTION ================= */}
    <section className="warranty-quote-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="warranty-quote-card">
              {/* HEADER */}
              <div className="warranty-quote-header">
                <h2 className="warranty-quote-title">
                  <span className="text-primary">Get Roadside</span>{" "}
                  <span className="text-green">Assistance Now</span>
                </h2>
                <p className="warranty-quote-subtitle">
                  Enter basic info to get a quick Insurance valuation.
                </p>
              </div>

              {/* FORM */}
              <form className="warranty-quote-form">
                {/* FIRST ROW */}
                <Row className="g-3 mb-3">
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="Your Name"
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control warranty-form-input"
                      placeholder="Enter Mobile Number"
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">Car Brand</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="e.g. Maruti, Hyundai"
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">Car Model</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="e.g. Swift, Alto"
                    />
                  </Col>
                </Row>

                {/* SECOND ROW */}
                <Row className="g-3 mb-4">
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">Manufacturing Year</label>
                    <select className="form-select warranty-form-select">
                      <option>Select Year</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                      <option>2021</option>
                      <option>2020</option>
                      <option>2019</option>
                      <option>2018</option>
                      <option>2017</option>
                      <option>2016</option>
                      <option>2015</option>
                    </select>
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">KM Driven</label>
                    <input
                      type="text"
                      className="form-control warranty-form-input"
                      placeholder="Enter KM Driven"
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">City</label>
                    <select className="form-select warranty-form-select">
                      <option>Select city</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Bangalore</option>
                      <option>Chennai</option>
                      <option>Kolkata</option>
                      <option>Hyderabad</option>
                    </select>
                  </Col>
                  <Col md={6} lg={3}>
                    <label className="warranty-form-label">State</label>
                    <select className="form-select warranty-form-select">
                      <option>Select State</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>West Bengal</option>
                      <option>Telangana</option>
                    </select>
                  </Col>
                </Row>

                {/* SUBMIT BUTTON */}
                <div className="warranty-form-submit">
                  <button type="submit" className="warranty-submit-btn">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= SERVICES WE COVER ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Services We</span>{" "}
              <span className="osa">Cover</span>
            </h2>
            <p className="fastag-section-description">
              Comprehensive roadside support to keep you moving — anytime, anywhere.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside1.png" alt="Breakdown Assistance" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Breakdown Assistance</h4>
                <p className="fastag-feature-text">
                  Quick on-site diagnosis and minor repairs.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside2.png" alt="Towing Service" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Towing Service</h4>
                <p className="fastag-feature-text">
                  Free or discounted towing to nearest works.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside3.png" alt="Flat Tyre Support" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Flat Tyre Support</h4>
                <p className="fastag-feature-text">
                  Tyre change or puncture repair on spot.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside4.png" alt="Battery Jumpstart" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Battery Jumpstart</h4>
                <p className="fastag-feature-text">
                  Restart your car in case of battery failure.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside5.png" alt="Fuel Delivery" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Fuel Delivery</h4>
                <p className="fastag-feature-text">
                  Up to 5 litres delivered if you run out.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside6.png" alt="Lock-Out Help" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Lock-Out Help</h4>
                <p className="fastag-feature-text">
                  Unlocking in case of keys left inside.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside7.png" alt="Accident Support" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Accident Support</h4>
                <p className="fastag-feature-text">
                  Coordinating with insurance and workshops.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3} className="why-choose-second-row">
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/roadside8.png" alt="Emergency Relay" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Emergency Relay</h4>
                <p className="fastag-feature-text">
                  Help to reach destination if car not repairable.
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
            Quick help, exactly when and where you need it.
          </p>
        </div>

        {/* SINGLE IMAGE */}
        <div className="text-center mb-4">
          <Image
            src="/images/roadsideHow.png"
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
            <h6 className="step-title">Step 01: Call or Use the App</h6>
            <p className="step-desc">Share your location & car details.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Step 02: Assistance Dispatched</h6>
            <p className="step-desc">Nearest service provider assigned instantly.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Step 03: On-Site Support</h6>
            <p className="step-desc">Get your issue resolved or your car safely towed.</p>
          </div>
        </div>
      </div>
    </section>

    {/* ================= OUR RSA PARTNERS ================= */}
    <section className="fastag-banks-section py-5">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Our RSA</span> <span className="osa">Partners</span>
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

    {/* ================= WHY IT MATTERS ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why It</span>{" "}
              <span className="osa">Matters</span>
            </h2>
            <p className="fastag-section-description">
              Breakdowns don't come with warnings. With RSA
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/rodematter1.png" alt="No Waiting" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  No waiting for random help on highways.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/rodematter2.png" alt="No Overpaying" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  No overpaying to local mechanics.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/rodematter3.png" alt="No Risk" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  No risk of unsafe roadside situations.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= DRIVE ANYWHERE WITH CONFIDENCE ================= */}
    <section className="verify-section">
      <div className="verify-banner">
        <Container>
          <Row className="align-items-center g-4">
            {/* LEFT CONTENT */}
            <Col lg={7} className="text-center text-lg-start">
              <h2 className="verify-title">
                Drive anywhere with <br />
                confidence
              </h2>

              <p className="verify-desc">
                We've got your back, anytime you need us.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <button className="btn verify-btn" style={{ backgroundColor: '#F28B18', color: '#FFFFFF', border: 'none' }}>
                  Buy RSA Plan
                </button>
                <button className="btn verify-btn" style={{ backgroundColor: '#FFFFFF', color: '#0C3E8B', border: '1px solid #0C3E8B' }}>
                  Speak to an Expert
                </button>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={5} className="text-center">
              <Image
                src="/images/rsaDrive.png"
                alt="Drive with confidence"
                width={430}
                height={270}
                className="img-fluid"
                priority
              />
            </Col>
          </Row>
        </Container>
      </div>
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
