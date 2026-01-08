"use client";

import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

export default function WarrantyPage() {
  return (
    <div>
    <section className="fastag-hero-section insurance-hero">
      <Container fluid>
        <Row className="align-items-center">

          {/* LEFT CONTENT */}
          <Col
            lg={7}
            className="padding-Y-X"
            style={{ marginTop: "-10px", paddingLeft: "30px" }}
          >
            <p className="hero-eyebrow">
              EXTENDED WARRANTY
            </p>

            <h1 className="fastag-hero-title pt-2">
              PROTECT YOUR CAR <br />
              BEYOND THE{" "}
              <span className="fastag-hero-highlight">
                STANDARD <br /> COVERAGE
              </span>
            </h1>

            <p className="fastag-hero-subtitle mt-3">
              Extend your car’s protection and avoid expensive repair bills
              with Carosa’ trusted warranty.
            </p>

            <div className="fastag-cta-buttons d-flex gap-3 flex-wrap mt-4">
              <Button className="fastag-btn-primary rounded-5 px-4">
                Get Extended Warranty
              </Button>
            </div>
          </Col>

          {/* RIGHT IMAGE */}
          <Col lg={5} className="px-0">
  <div
    className="fastag-hero-illustration text-end"
    style={{ transform: "translateX(-40px)" }}
  >
    <img
      src="/images/warranty-hero.png"
      alt="Extended Warranty"
      className="w-100 insurance-hero-img"
    />
  </div>
</Col>


        </Row>
      </Container>
    </section>

    {/* ================= GET YOUR EXTENDED WARRANTY QUOTE FORM SECTION ================= */}
    <section className="warranty-quote-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="warranty-quote-card">
              {/* HEADER */}
              <div className="warranty-quote-header">
                <h2 className="warranty-quote-title">
                  <span className="text-primary">Get Your Extended</span>{" "}
                  <span className="text-green">Warranty Quote</span>
                </h2>
                <p className="warranty-quote-subtitle">
                  Check coverage options and pricing for your car in just a few steps.
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
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= WHY GET AN EXTENDED WARRANTY ================= */}
    <section className="fastag-offer-section why-choose-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Get an Extended</span>{" "}
              <span className="osa">Warranty?</span>
            </h2>
            <p className="fastag-section-description">
              Because repairs shouldn't come as expensive surprises.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card">
              <img src="/images/warrantyWhy1.png" alt="Covers Major Repairs" className="insurance-why-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Covers Major Repairs</h4>
                <p className="fastag-feature-text">
                  Engine, gearbox, electronics, AC, and more.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card">
              <img src="/images/warrantyWhy2.png" alt="Saves Money" className="insurance-why-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Saves Money</h4>
                <p className="fastag-feature-text">
                  Avoid paying out-of-pocket for costly breakdowns.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="fastag-feature-card">
              <img src="/images/warrantyWhy3.png" alt="Nationwide Coverage" className="insurance-why-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Nationwide Coverage</h4>
                <p className="fastag-feature-text">
                  Valid at authorized service centers across India.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
            <div className="fastag-feature-card">
              <img src="/images/warrantyWhy4.png" alt="Transferable" className="insurance-why-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Transferable</h4>
                <p className="fastag-feature-text">
                  Increases resale value if you sell your car.
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4} className="why-choose-second-row">
            <div className="fastag-feature-card">
              <img src="/images/warrantyWhy5.png" alt="Flexible Plans" className="insurance-why-icon" />
              <div className="fastag-feature-content">
                <h4 className="fastag-feature-title">Flexible Plans</h4>
                <p className="fastag-feature-text">
                  Choose coverage up to 5 years.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* ================= WHAT'S COVERED IN EXTENDED WARRANTY ================= */}
    <section className="fastag-offer-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What's Covered in</span>{" "}
              <span className="osa">Extended Warranty</span>
            </h2>
            <p className="fastag-section-description">
              Protection for the most critical and expensive car components.
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X justify-content-center">
          {/* Card 1: Mechanical Components */}
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="warranty-covered-card">
              <div className="warranty-covered-icon-wrapper">
                <img src="/images/extend1.png" alt="Mechanical Components" className="warranty-covered-icon" />
              </div>
              <h4 className="warranty-covered-title">Mechanical Components</h4>
              <ul className="warranty-covered-list">
                <li>
                  <span className="check-icon">✓</span>
                  Engine & cooling system
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Transmission & drivetrain
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Suspension & steering
                </li>
              </ul>
            </div>
          </Col>

          {/* Card 2: Electrical Systems */}
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="warranty-covered-card">
              <div className="warranty-covered-icon-wrapper">
                <img src="/images/extend2.png" alt="Electrical Systems" className="warranty-covered-icon" />
              </div>
              <h4 className="warranty-covered-title">Electrical Systems</h4>
              <ul className="warranty-covered-list">
                <li>
                  <span className="check-icon">✓</span>
                  Infotainment & navigation
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Sensors & wiring
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Alternator & starter motor
                </li>
              </ul>
            </div>
          </Col>

          {/* Card 3: Comfort & Safety */}
          <Col xs={12} sm={6} md={4} lg={4}>
            <div className="warranty-covered-card">
              <div className="warranty-covered-icon-wrapper">
                <img src="/images/extend3.png" alt="Comfort & Safety" className="warranty-covered-icon" />
              </div>
              <h4 className="warranty-covered-title">Comfort & Safety</h4>
              <ul className="warranty-covered-list">
                <li>
                  <span className="check-icon">✓</span>
                  Air conditioning
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Braking systems & ABS
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  Power windows, locks, and seats
                </li>
              </ul>
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
            Simple activation, clear coverage, and easy claims.
          </p>
        </div>

        {/* SINGLE IMAGE */}
        <div className="text-center mb-4">
          <Image
            src="/images/warrantyHow.png"
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
            <h6 className="step-title">Step 01: Check Eligibility</h6>
            <p className="step-desc">Vehicle age & mileage requirements.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Step 02: Choose Your Plan</h6>
            <p className="step-desc">1, 2, or 3-year extensions available.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 className="step-title">Step 03: Enjoy Hassle-Free Claims</h6>
            <p className="step-desc">Repairs at authorized workshops only.</p>
          </div>
        </div>
      </div>
    </section>

    {/* ================= OUR TRUSTED EXTENDED WARRANTY PARTNERS ================= */}
    <section className="fastag-banks-section py-5">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Our Trusted</span> <span className="osa">Extended Warranty Partners</span>
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

    {/* ================= WHY CAROSA EXTENDED WARRANTY IS BETTER ================= */}
    <section className="fastag-offer-section why-choose-section insurance-types-section pt-5 pb-0">
      <Container fluid>
        <Row>
          <Col lg={12} className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why </span>
              <span className="osa">Carosa</span>
              <span className="text-primary"> Extended Warranty </span>
              <span className="osa">Is Better</span>
            </h2>
            <p className="fastag-section-description">
              Carosa ensures your first drive is worry-free. Without a PDI, you risk:
            </p>
          </Col>
        </Row>

        <Row className="g-4 padding-Y-X why-choose-row">
          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/insuranceType.png" alt="Coverage & Trust" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Coverage backed by trusted, IRDAI-approved providers
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/insuranceType2.png" alt="Clarity & Transparency" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Clear inclusions and exclusions, no fine-print surprises
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/insuranceType3.png" alt="Claim Process Assistance" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Guided assistance throughout the claim process
                </p>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <div className="fastag-feature-card insurance-type-card">
              <img src="/images/insuranceType4.png" alt="Flexible Options" className="insurance-type-icon" />
              <div className="fastag-feature-content">
                <p className="fastag-feature-text" style={{ color: '#0C3E8B', margin: 0, fontWeight: 'bold' }}>
                  Options based on car age, mileage, and usage
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </div>
  );
}
