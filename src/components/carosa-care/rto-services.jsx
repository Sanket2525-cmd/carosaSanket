 "use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

// ================= HOW CAROSA WORKS DATA =================
const rtoSteps = [
  {
    title: "Submit Request",
    desc: "Select your required RTO service online.",
  },
  {
    title: "Document Collection",
    desc: "Our team guides you on documents and collects them.",
  },
  {
    title: "Processing",
    desc: "We submit and track your application with the RTO.",
  },
  {
    title: "Service Completion",
    desc: "Receive updated documents at your doorstep.",
  },
];

export default function RtoServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does an RC ownership transfer take?",
      answer:
        "Usually 15–30 days depending on state RTO timelines and how quickly documents are submitted.",
    },
    {
      question: "Can I apply for duplicate RC online?",
      answer:
        "Yes, you can raise a duplicate RC request online with Carosa and our team will guide you through each step.",
    },
    {
      question: "Do I need to visit the RTO personally?",
      answer:
        "In most cases our partner agents handle RTO visits for you. You may only be required for biometrics or final signatures.",
    },
    {
      question: "Is hypothecation removal mandatory?",
      answer:
        "Yes, after loan closure you must remove bank hypothecation from the RC to complete closure and enable smooth resale.",
    },
    {
      question: "Can you help with inter‑state transfers?",
      answer:
        "Carosa can help you obtain NOC, manage re‑registration and handle paperwork needed for inter‑state vehicle transfers.",
    },
    {
      question: "Do you provide doorstep document pickup?",
      answer:
        "In selected cities, our field partners provide doorstep collection of documents for RTO submissions.",
    },
    {
      question: "How much does RC transfer cost?",
      answer:
        "Charges depend on state RTO fees and service scope. Once you share details, we provide a clear, all‑inclusive quote.",
    },
    {
      question: "Can you help in getting a new driving license?",
      answer:
        "Yes, we assist with learner’s license, driving test slots, and permanent DL issuance as per RTO rules.",
    },
    {
      question: "What if my driving license has expired?",
      answer:
        "You can apply for DL renewal through Carosa. Late renewal may attract penalties as per RTO norms, so apply early.",
    },
    {
      question: "Are these services available across India?",
      answer:
        "Services are currently available in major cities and are expanding. Enter your pin code to check availability in your area.",
    },
  ];

  return (
    <div className="fastag-recharge-page">
      {/* Hero Section */}
      <section className="fastag-hero-section">
        <Container fluid>
          <Row className="align-items-center">
            {/* LEFT CONTENT */}
            <Col lg={7} className="padding-Y-X">
              <span className="badge rounded-pill mb-3">
                RTO Service
              </span>

              <h1 className="fastag-hero-title pt-4">
                SEAMLESS RTO SERVICES <br />
                AT{" "}
                <span className="fastag-hero-highlight">
                  YOUR FINGERTIPS
                </span>
              </h1>

              <p className="fastag-hero-subtitle">
                From RC transfers to driving license renewals – Carosa
                handles all your RTO paperwork quickly, transparently,
                and without hassle.
              </p>

              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <Button className="fastag-btn-primary rounded-5">
                  Get Assistance
                </Button>
                <Button className="fastag-btn-secondary rounded-5">
                  Book RTO Service
                </Button>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={5} className="px-0">
              <div className="fastag-hero-illustration">
                <img
                  src="/images/rto-services.png"
                  alt="RTO Services Illustration"
                  className="w-100"
                />
              </div>
            </Col>
          </Row>

          {/* What We Offer Cards */}
          <Row
            className="g-3 mt-4 justify-content-center"
            style={{ marginBottom: "30px" }}
          >
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div
                className="fastag-feature-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 18px",
                  height: "auto",
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt="One-Stop Solution"
                  width={18}
                  height={18}
                  className="fastag-feature-image"
                />
                <div>
                  <h4 className="fastag-feature-title mb-1">One-Stop Solution</h4>
                  <p className="fastag-feature-text">
                    All major RTO services under one roof.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div
                className="fastag-feature-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 18px",
                  height: "auto",
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt="Time-Saving"
                  width={18}
                  height={18}
                  className="fastag-feature-image"
                />
                <div>
                  <h4 className="fastag-feature-title mb-1">Time-Saving</h4>
                  <p className="fastag-feature-text">
                    Avoid long queues and repeated RTO visits.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div
                className="fastag-feature-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 18px",
                  height: "auto",
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt="Transparency"
                  width={18}
                  height={18}
                  className="fastag-feature-image"
                />
                <div>
                  <h4 className="fastag-feature-title mb-1">Transparency</h4>
                  <p className="fastag-feature-text">
                    Clear process, no hidden charges.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div
                className="fastag-feature-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 18px",
                  height: "auto",
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt="End-to-End Support"
                  width={18}
                  height={18}
                  className="fastag-feature-image"
                />
                <div>
                  <h4 className="fastag-feature-title mb-1">End-to-End Support</h4>
                  <p className="fastag-feature-text">
                    Documentation, submission.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div
                className="fastag-feature-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 18px",
                  height: "auto",
                }}
              >
                <Image
                  src="/images/tick.png"
                  alt="Pan-India Coverage"
                  width={18}
                  height={18}
                  className="fastag-feature-image"
                />
                <div>
                  <h4 className="fastag-feature-title mb-1">Pan-India Coverage</h4>
                  <p className="fastag-feature-text">
                    Services available across major cities.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our RTO Services Grid */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">Our</span>{" "}
                <span className="osa">RTO Services</span>
              </h2>
              <p className="fastag-section-description">
                End-to-end RTO assistance to keep your vehicle documents accurate,
                compliant, and stress-free.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto1.png"
                    alt="RC Ownership Transfer"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">RC Ownership Transfer</h4>
                <p className="fastag-feature-text">
                  Smooth transfer of vehicle ownership with complete paperwork.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto2.png"
                    alt="Duplicate RC Apply"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">Duplicate RC Apply</h4>
                <p className="fastag-feature-text">
                  Replacement RC in case of loss, theft, or damage.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto3.png"
                    alt="Address Change in RC"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">Address Change in RC</h4>
                <p className="fastag-feature-text">
                  Update your residential address without hassle.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto4.png"
                    alt="NOC Issue"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">
                  NOC Issue (No Objection Certificate)
                </h4>
                <p className="fastag-feature-text">
                  For inter-state transfer or sale of your vehicle.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto5.png"
                    alt="Hypothecation Removal"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">Hypothecation Removal</h4>
                <p className="fastag-feature-text">
                  Clear loan hypothecation once your loan is repaid.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto6.png"
                    alt="New Driving License Apply"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">
                  New Driving License Apply
                </h4>
                <p className="fastag-feature-text">
                  End-to-end assistance for first-time license applicants.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto7.png"
                    alt="Renewal of Driving License"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">
                  Renewal of Driving License
                </h4>
                <p className="fastag-feature-text">
                  Enjoy hassle-free renewals with quick processing.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={6} lg={3}>
              <div className="fastag-feature-card text-start">
                <div className="fastag-icon-wrapper">
                  <Image
                    src="/images/rto8.png"
                    alt="Address Change in Driving License"
                    width={40}
                    height={40}
                    className="fastag-feature-image"
                  />
                </div>
                <h4 className="fastag-feature-title mt-2">
                  Address Change in Driving License
                </h4>
                <p className="fastag-feature-text">
                  Update your DL details with accurate address information.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= HOW CAROSA WORKS ================= */}
      <section className="how-carosa-section">
        <>
        <div className="container">
          {/* HEADING */}
          <div className="text-center mb-4">
            <h2 className="fastag-section-title">
              <span className="text-primary">How</span>{" "}
              <span className="osa">Carosa Works</span>
            </h2>
            <p className="fastag-section-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* SINGLE IMAGE */}
          <div className="text-center mb-4">
            <Image
              src="/images/how-carosa-works.png"
              alt="How Carosa Works"
              width={1100}
              height={220}
              className="img-fluid"
              priority
            />
          </div>

          {/* TEXT BELOW IMAGE */}
          <div className="row text-center g-4">
            {rtoSteps.map((item, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <h6 className="step-title">{item.title}</h6>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <section className="why-matters-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="why-matters-card text-center">
              <h4 className="why-matters-title">
                Why It <span>Matters</span>
              </h4>

              <p className="why-matters-text">
                Using Carosa RTO Services ensures legal compliance,
                zero middlemen, faster processing, and doorstep
                delivery — supporting both individual and dealer
                needs.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

        </>
      </section>

      {/* ================= OPEN RTO SERVICE & BOOKING FORM ================= */}
      <section className="estimate-section">
        <div className="container">
          <div className="estimate-wrapper row align-items-center rounded-4 p-4 p-lg-5">
            {/* LEFT CONTENT */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fastag-section-title">
                <span className="text-primary">Open RTO Service &</span> <br />
                <span className="osa">Booking Form</span>
              </h2>

              <p className="fastag-section-description">
                We will call you to confirm details and provide a transparent
                quote. Doorstep pickup available in major cities.
              </p>

              <Image
                src="/images/estimate-illustration.png"
                alt="RTO Service Booking"
                width={420}
                height={280}
                className="img-fluid"
                priority
              />
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-6">
              <div className="estimate-form-card">
                <form className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location"
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pin Code"
                    />
                  </div>

                  <div className="col-12">
                    <select className="form-select">
                      <option>Select RTO Service Required</option>
                      <option>RC Transfer</option>
                      <option>Duplicate RC</option>
                      <option>NOC / Address Change</option>
                      <option>Driving License Service</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="estimate-submit-btn">
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
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
                          Q{index + 1}. {faq.question}
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
                Manage all your RTO services, documents and updates in one
                secure Carosa app experience.
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

