"use client";

import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import "../../styles/carosacare.css";


export default function DrivingSafety() {
  return (
    <div className="fastag-recharge-page">
      {/* Hero Section */}
      <section className="fastag-hero-section">
        <Container fluid>
          <Row className="align-items-center">
            {/* LEFT CONTENT */}
            <Col lg={7} className="padding-Y-X" style={{ marginTop: '-20px', paddingLeft: '30px' }}>
              <h1 className="fastag-hero-title pt-4">
                CAROSA — DRIVE <br />
                <span className="fastag-hero-highlight">
                  SAFETY ASSISTANT
                </span>
              </h1>

              <p className="fastag-hero-subtitle">
                Practical tips, checklists and emergency tools to make every
                drive safer — for buyers, sellers and test-drives.
              </p>

              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <Button className="fastag-btn-primary rounded-5">
                  Request Roadside assistance
                </Button>
                <Button className="fastag-btn-secondary rounded-5">
                  Schedule Safety Check
                </Button>
              </div>
            </Col>

            {/* RIGHT IMAGE */}
            <Col lg={5} className="px-0">
              <div className="fastag-hero-illustration text-end">
                <img
                  src="/images/safetyBanner.png"
                  alt="Carosa Drive Safety Assistant"
                  className="w-100 driving-safety-hero-img"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Before You Drive Section */}
      <section className="before-drive-section">
        <Container>
          <Row>
            <Col lg={7}>
              <div className="before-drive-content">
                <h2 className="before-drive-title">
                  Before you drive a <span className="text-green">Car</span>
                </h2>
                <p className="before-drive-subtitle">
                  Quick pre-drive checklist to reduce risks and ensure a safe journey.
                </p>

                {/* Checklist Panels */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <div className="checklist-panel">
                      <h6 className="checklist-title">Vehicle</h6>
                      <ul className="checklist-items">
                        <li>
                          <span className="check-icon">✓</span>
                          Tyre pressure & tread check
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Fuel & fluid levels
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Lights & indicators working
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Brakes & steering check
                        </li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checklist-panel">
                      <h6 className="checklist-title">Driver</h6>
                      <ul className="checklist-items">
                        <li>
                          <span className="check-icon">✓</span>
                          Valid driving licence & RC document
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Seatbelt fastened
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Phone on silent or hands-free
                        </li>
                        <li>
                          <span className="check-icon">✓</span>
                          Well-rested & alert
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>

                {/* Quick Tools & Contacts */}
                <div className="quick-tools-section">
                  <h5 className="quick-tools-title">Quick tools & Contacts</h5>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="contact-card">
                        <div className="contact-icon-box">
                          <span className="contact-icon">📞</span>
                        </div>
                        <div className="contact-info">
                          <h6 className="contact-title">Carosa Roadside Assistance</h6>
                          <p className="contact-detail">+91 1800-XXX-XXXX</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="contact-card">
                        <div className="contact-icon-box">
                          <span className="contact-icon">📄</span>
                        </div>
                        <div className="contact-info">
                          <h6 className="contact-title">Emergency Documents</h6>
                          <p className="contact-detail">Download RC Copy</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="contact-card">
                        <div className="contact-icon-box">
                          <span className="contact-icon">✉️</span>
                        </div>
                        <div className="contact-info">
                          <h6 className="contact-title">Email Support</h6>
                          <p className="contact-detail">support@carosa.com</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="contact-card">
                        <div className="contact-icon-box">
                          <span className="contact-icon">🕐</span>
                        </div>
                        <div className="contact-info">
                          <h6 className="contact-title">24x7 Helpline</h6>
                          <p className="contact-detail">Available round the clock</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            {/* Right Form Panel */}
            <Col lg={5}>
              <div className="estimate-form-card" style={{ marginTop: '70px', minHeight: '550px' }}>
                <h5 className="form-card-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>Request Roadside Assistance</h5>
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
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Vehicle Reg. No</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Vehicle Registration"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '8px', display: 'block' }}>Problem</label>
                    <select className="form-select">
                      <option>Select Problem</option>
                      <option>Flat Tyre</option>
                      <option>Battery Issue</option>
                      <option>Engine Trouble</option>
                      <option>Accident</option>
                      <option>Out of Fuel</option>
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

      {/* During Test Drive Section */}
      <section className="test-drive-section">
        <Container>
          <div className="test-drive-content">
            <h2 className="test-drive-title">
              During a test-drive <span className="text-green">(Carosa Drive Hubs)</span>
            </h2>
            <p className="test-drive-subtitle">
              Our Drive Hubs are designed for safe, supervised test-drives. A few rules for customers and staff:
            </p>

            <Row className="g-4 mt-3">
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/safering1.png" 
                      alt="ID and Consent Form"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Always carry ID and the signed test-drive consent form.
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/safering2.png" 
                      alt="Escorted Test Drive"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Test drives are escorted when requested — request a lead or follow vehicle for longer routes.
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/safering3.png" 
                      alt="Safe Driving Rules"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Limit test-drive time and avoid risky manoeuvres (no abrupt overtakes, stunts, or off-road use).
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="test-drive-point">
                  <div className="test-drive-icon-wrapper">
                    <img 
                      src="/images/sagering4.png" 
                      alt="Vehicle Inspection"
                      className="test-drive-icon"
                    />
                  </div>
                  <p className="test-drive-text">
                    Inspect the vehicle with our checklist before starting.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Schedule Safety Check & Safety Tips Section */}
      <section className="before-drive-section">
        <Container>
          <Row className="align-items-start">
            {/* Left Form Panel */}
            <Col lg={5}>
              <div className="estimate-form-card" style={{ marginTop: '0px', minHeight: '480px' }}>
                <h5 className="form-card-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Schedule Safety Check</h5>
                <p className="before-drive-subtitle" style={{ marginBottom: '20px', fontSize: '0.938rem' }}>Book a 30-minute vehicle safety review at any Carosa Drive Hub.</p>
                <form className="row g-2">
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '6px', display: 'block' }}>Preferred Date</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/DD/YY"
                      />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}>📅</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '6px', display: 'block' }}>Preferred Slot</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', zIndex: 1, pointerEvents: 'none' }}>🕐</span>
                      <select className="form-select" style={{ paddingLeft: '40px' }}>
                        <option>Select Slot</option>
                        <option>9:00 AM - 10:00 AM</option>
                        <option>10:00 AM - 11:00 AM</option>
                        <option>11:00 AM - 12:00 PM</option>
                        <option>2:00 PM - 3:00 PM</option>
                        <option>3:00 PM - 4:00 PM</option>
                        <option>4:00 PM - 5:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="estimate-submit-btn" style={{ backgroundColor: '#F28B18', border: 'none', color: '#FFFFFF' }}>
                      Book a Check
                    </button>
                  </div>
                  <div className="col-12">
                    <hr style={{ margin: '20px 0', borderColor: '#E5E7EB', borderWidth: '1px', borderStyle: 'solid', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0' }}>
                      <strong style={{ color: '#111827' }}>Pro Tip:</strong> Keep your FASTag and insurance details handy for faster assistance.
                    </p>
                  </div>
                </form>
              </div>
            </Col>

            {/* Right Safety Tips */}
            <Col lg={7}>
              <div className="before-drive-content" style={{ marginTop: '0px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 className="before-drive-title" style={{ marginBottom: '8px' }}>
                    Top Safety Tips for <span className="text-green">Every Drive</span>
                  </h2>
                  <p className="before-drive-subtitle" style={{ margin: 0 }}>
                    Simple tips to help you drive safer and avoid common road risks.
                  </p>
                </div>

                {/* Safety Tips Cards */}
                <Row className="g-3" style={{ marginTop: '0px' }}>
                  <Col md={6}>
                    <div className="checklist-panel" style={{ padding: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img 
                          src="/images/driveTop1.png" 
                          alt="Safe Gap"
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6 className="checklist-title" style={{ marginBottom: '8px' }}>Keep a safe gap.</h6>
                      <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
                        Maintain at least 2-second distance in city traffic, more on highways.
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checklist-panel" style={{ padding: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img 
                          src="/images/driveTop2.png" 
                          alt="Lane Change"
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6 className="checklist-title" style={{ marginBottom: '8px' }}>Avoid sudden lane changes</h6>
                      <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
                        Use indicators, check mirrors and blind spots before changing lanes.
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checklist-panel" style={{ padding: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img 
                          src="/images/driveTop3.png" 
                          alt="Speed Discipline"
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6 className="checklist-title" style={{ marginBottom: '8px' }}>Speed discipline</h6>
                      <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
                        Follow speed limits and adjust for weather or road conditions.
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checklist-panel" style={{ padding: '20px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#E3F2FD', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img 
                          src="/images/driveTop4.png" 
                          alt="RSA Early"
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6 className="checklist-title" style={{ marginBottom: '8px' }}>Use RSA early</h6>
                      <p style={{ fontSize: '0.938rem', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
                        If something feels wrong, pull over safely and call roadside assistance.
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* If You're Involved in Accident Section */}
      <section className="before-drive-section">
        <Container>
          <Row className="align-items-start">
            {/* Left Content */}
            <Col lg={7}>
              <div className="before-drive-content">
                <h2 className="before-drive-title">
                  If you're involved in an <span className="text-green">accident</span>
                </h2>
                <p className="before-drive-subtitle">
                  Quick pre-drive checklist to reduce risks and ensure a safe journey.
                </p>

                {/* Accident Checklist Items */}
                <Row className="g-3 mt-3">
                  <Col md={12}>
                    <div className="checklist-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#0C3E8B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700' }}>i</span>
                      </div>
                      <p style={{ fontSize: '0.938rem', color: '#374151', margin: 0, lineHeight: '1.5', flex: 1 }}>
                        First: ensure everyone's safe. Move to a safe location if possible.
                      </p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="checklist-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#0C3E8B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700' }}>i</span>
                      </div>
                      <p style={{ fontSize: '0.938rem', color: '#374151', margin: 0, lineHeight: '1.5', flex: 1 }}>
                        Call emergency services if needed (Police & Ambulance).
                      </p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="checklist-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#0C3E8B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700' }}>i</span>
                      </div>
                      <p style={{ fontSize: '0.938rem', color: '#374151', margin: 0, lineHeight: '1.5', flex: 1 }}>
                        Document the scene — photos of vehicles, number plates, surroundings, and injuries.
                      </p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="checklist-panel" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#0C3E8B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '700' }}>i</span>
                      </div>
                      <p style={{ fontSize: '0.938rem', color: '#374151', margin: 0, lineHeight: '1.5', flex: 1 }}>
                        Use Carosa's Accident Report form below to notify us — we'll guide claims, towing and repairs.
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Right Form Panel */}
            <Col lg={5}>
              <div className="estimate-form-card">
                <h5 className="form-card-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>Request Roadside Assistance</h5>
                <form className="row g-2">
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '6px', display: 'block' }}>Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '6px', display: 'block' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '0.938rem', fontWeight: '600', color: '#111827', marginBottom: '6px', display: 'block' }}>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      rows="4"
                      style={{ resize: 'vertical' }}
                    ></textarea>
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
