

"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

export default function DrivingSchool() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Do you provide the car for training?",
      answer: "Yes, we provide dual-control cars for all training sessions."
    },
    {
      question: "Can I learn in my own car?",
      answer: "Yes, you can learn in your own car if you prefer. However, we recommend using our dual-control vehicles for safety during initial training."
    },
    {
      question: "How long does it take to learn driving?",
      answer: "The duration depends on your learning pace and the course you choose. Typically, basic courses take 2-3 weeks, while comprehensive courses may take 4-6 weeks."
    },
    {
      question: "Do you help with getting a driving license?",
      answer: "Yes, we provide complete assistance with the RTO license process, including documentation, test preparation, and scheduling."
    },
    {
      question: "What is the minimum age to join?",
      answer: "The minimum age is 18 years for a permanent driving license. However, you can start learning at 17 years with a learner's license."
    },
    {
      question: "Do you train for two-wheelers?",
      answer: "Yes, we offer training for both four-wheelers and two-wheelers. Please check with your selected driving school for specific two-wheeler training availability."
    },
    {
      question: "Is there a test at the end?",
      answer: "Yes, we conduct a training completion test to assess your driving skills. Upon successful completion, you receive a training certificate."
    },
    {
      question: "Do you offer female instructors?",
      answer: "Yes, we have female instructors available. You can request a female instructor when booking your slot."
    },
    {
      question: "Can I schedule weekend-only classes?",
      answer: "Yes, we offer flexible scheduling including weekend-only batches. You can choose a schedule that fits your availability."
    },
    {
      question: "Do I get a certificate after training?",
      answer: "Yes, you will receive a training completion certificate after successfully completing the course and passing the assessment."
    }
  ];
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="driving-school-hero">
        <Container fluid className="position-relative">
          <Row className="align-items-center">
            {/* LEFT CONTENT */}
            <Col lg={7} className="hero-left">
              <h1 className="hero-title">
                YOUR ROAD TO FREEDOM <span>START HERE</span>
              </h1>

              <p className="hero-desc">
                Professional driving lessons with certified instructors,
                modern vehicles, and flexible schedules.
              </p>

              <Button className="hero-btn">Call Now</Button>
            </Col>

            {/* RIGHT FORM */}
            <Col lg={5} className="hero-form-col">
              <div className="driving-school-form-card">
                <h3 className="driving-school-form-title">
                  Enquire Now
                </h3>

                <form>
                  <input
                    type="text"
                    className="driving-school-input mb-3"
                    placeholder="Your Name"
                  />

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <input
                        type="text"
                        className="driving-school-input"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="driving-school-input"
                        placeholder="Location"
                      />
                    </div>
                  </div>

                  <select className="driving-school-input driving-school-select mb-3">
                    <option>Select Course</option>
                    <option>Beginner Course</option>
                    <option>Advanced Course</option>
                    <option>Refresher Course</option>
                  </select>

                  <button
                    type="submit"
                    className="driving-school-submit-btn w-100"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </Col>
          </Row>

          {/* BACKGROUND IMAGE */}
          <div className="driving-school-bg">
            <img
              src="/images/drivingSchool.png"
              alt="Driving School"
            />
          </div>
        </Container>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
                <span className="text-primary">How It</span>
                <span className="osa"> Works</span>
              </h2>
              <p className="fastag-section-description">
                Learning to drive through Carosa is easy, transparent, and fully supported.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/hown.png" alt="Book Your Slot" width="30" />
                </div>
                <h4 className="fastag-feature-title">Book Your Slot</h4>
                <p className="fastag-feature-text">
                  Choose your preferred time & package.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/schoollWork2.png" alt="Start Lessons" width="30" />
                </div>
                <h4 className="fastag-feature-title">Start Lessons</h4>
                <p className="fastag-feature-text">
                  Learn in a safe, dual-control car with an instructor.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/schoollWork3.png" alt="Get Certified" width="30" />
                </div>
                <h4 className="fastag-feature-title">Get Certified</h4>
                <p className="fastag-feature-text">
                  Receive a training completion certificate.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="fastag-feature-card how-it-works-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/schoollWork4.png" alt="RTO License Support" width="30" />
                </div>
                <h4 className="fastag-feature-title">RTO License Support</h4>
                <p className="fastag-feature-text">
                  Assistance in passing your driving test & getting your license.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY IT MATTERS ================= */}
      <section className="fastag-offer-section pt-5 pb-5">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-4">
              <h2 className="fastag-section-title">
                <span className="text-primary">Why It</span>
                <span className="osa"> Matters</span>
              </h2>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X justify-content-center">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card why-it-matters-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whyScholl1.png" alt="Verified Instructors" width="30" />
                </div>
                <h4 className="fastag-feature-title">Verified Instructors</h4>
                <p className="fastag-feature-text">
                  Learning from verified instructors improves road safety.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card why-it-matters-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whyScholl2.png" alt="Reduced Risk" width="30" />
                </div>
                <h4 className="fastag-feature-title">Reduced Accident Risk</h4>
                <p className="fastag-feature-text">
                  Proper training reduces accident risks significantly.
                </p>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="fastag-feature-card why-it-matters-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whyScholl3.png" alt="Driving Confidence" width="30" />
                </div>
                <h4 className="fastag-feature-title">Driving Confidence</h4>
                <p className="fastag-feature-text">
                  Gain lifelong confidence and correct driving habits.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= WHY CHOOSE DRIVING SCHOOL ================= */}
      <section className="fastag-offer-section why-choose-section pt-5 pb-0">
  <Container fluid>
    <Row>
      <Col lg={12} className="text-center mb-3">
        <h2 className="fastag-section-title">
          <span className="text-primary">Why Choose </span>
          <span className="osa">Driving School</span>{" "}
          <span className="text-primary">through</span>{" "}
          <span className="osa">Carosa?</span>
        </h2>

        <p className="fastag-section-description">
          Learn to drive with confidence through verified instructors,
          flexible schedules, and complete support.
        </p>
      </Col>
    </Row>

    <Row className="g-4 padding-Y-X why-choose-row">
      
      <Col xs={12} sm={6} md={4} lg={4}>
        <div className="fastag-feature-card">
          <div className="fastag-icon-wrapper">
            <img src="/images/school1.png" alt="Only Certified Schools" width="30" />
          </div>
          <div className="fastag-feature-content">
            <h4 className="fastag-feature-title">Only Certified Schools</h4>
            <p className="fastag-feature-text">
              RTO-approved trainers with years of experience.
            </p>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={4} lg={4}>
        <div className="fastag-feature-card">
          <div className="fastag-icon-wrapper">
            <img src="/images/scholl2.png" alt="Dual-Control Cars" width="30" />
          </div>
          <div className="fastag-feature-content">
            <h4 className="fastag-feature-title">Dual-Control Cars</h4>
            <p className="fastag-feature-text">
              Extra safety during learning.
            </p>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={4} lg={4}>
        <div className="fastag-feature-card">
          <div className="fastag-icon-wrapper">
            <img src="/images/scholl3.png" alt="Flexible Timings" width="30" />
          </div>
          <div className="fastag-feature-content">
            <h4 className="fastag-feature-title">Flexible Timings</h4>
            <p className="fastag-feature-text">
              Morning, evening & weekend batches.
            </p>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
        <div className="fastag-feature-card">
          <div className="fastag-icon-wrapper">
            <img src="/images/scholl4.png" alt="Beginner to Expert" width="30" />
          </div>
          <div className="fastag-feature-content">
            <h4 className="fastag-feature-title">Beginner to Expert</h4>
            <p className="fastag-feature-text">
              Basic to advanced highway & parking skills.
            </p>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
        <div className="fastag-feature-card">
          <div className="fastag-icon-wrapper">
            <img src="/images/scholl5.png" alt="RTO Assistance" width="30" />
          </div>
          <div className="fastag-feature-content">
            <h4 className="fastag-feature-title">RTO Assistance</h4>
            <p className="fastag-feature-text">
              Help with learner's & driving license process.
            </p>
          </div>
        </div>
      </Col>

    </Row>
  </Container>
</section>

      {/* ================= TOP VERIFIED DRIVING SCHOOLS ================= */}
      <section className="top-schools-section pt-5 pb-5">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-4">
              <h2 className="top-schools-title">
                <span className="text-primary">Top Verified </span>
                <span className="osa">Driving Schools</span>
              </h2>
              <p className="top-schools-subtitle">
                Carefully vetted driving schools for safe and confident learning.
              </p>
            </Col>
          </Row>

          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Delhi - Lajpat Nagar</span>
                  </div>
                  <h4 className="school-name">Metro Driving School</h4>
                  <p className="school-specialization">Beginner, Advanced, fresher</p>
                  <div className="school-price">Price: ₹1,999</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Gurgaon - Sector 14</span>
                  </div>
                  <h4 className="school-name">SafeDrive Academy</h4>
                  <p className="school-specialization">Beginner, Parking, Defensive Driving</p>
                  <div className="school-price">Price: ₹2,299</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Noida - Sector 62</span>
                  </div>
                  <h4 className="school-name">Highway Master Driving</h4>
                  <p className="school-specialization">Advanced, Night Driving</p>
                  <div className="school-price">Price: ₹2,499</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Delhi - Connaught Place</span>
                  </div>
                  <h4 className="school-name">Elite Driving School</h4>
                  <p className="school-specialization">Beginner, Advanced, Highway</p>
                  <div className="school-price">Price: ₹2,199</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Gurgaon - Sector 29</span>
                  </div>
                  <h4 className="school-name">ProDrive Academy</h4>
                  <p className="school-specialization">Beginner, Parking, City Driving</p>
                  <div className="school-price">Price: ₹2,399</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <div className="school-card">
                <div className="school-card-image">
                  <img src="/images/alto.png" alt="Driving School" />
                </div>
                <div className="school-card-content">
                  <div className="school-location">
                    <span className="location-icon">📍</span>
                    <span>Noida - Sector 18</span>
                  </div>
                  <h4 className="school-name">City Drive School</h4>
                  <p className="school-specialization">Beginner, Advanced, Refresher</p>
                  <div className="school-price">Price: ₹1,899</div>
                  <Button className="school-book-btn">Book Now</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= VERIFY BANNER ================= */}
      <section className="verify-section">
        <Container>
          <div className="verify-banner">
            <Row className="align-items-center g-4">
              {/* LEFT CONTENT */}
              <Col lg={7} className="text-center text-lg-start">
                <span className="verify-badge">
                  Better Clarity
                </span>

                <h2 className="verify-title">
                  Don't just drive — drive smart & safe.
                </h2>

                <p className="verify-desc">
                  Choose a verified Carosa partner driving school.
                </p>

                <div className="d-flex gap-3 flex-wrap">
                  <Button className="verify-btn">
                    Book Now
                  </Button>
                  <Button className="btn btn-light" style={{ background: "#ffffff", color: "#212529", border: "1px solid #E5E5E5" }}>
                    Speak an Expert
                  </Button>
                </div>
              </Col>

              {/* RIGHT IMAGE */}
              <Col lg={5} className="text-center">
                <Image
                  src="/images/driving-expert.png"
                  alt="Driving Expert"
                  width={430}
                  height={270}
                  className="img-fluid"
                  priority
                />
              </Col>
            </Row>
          </div>
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

    </>
  );
}
