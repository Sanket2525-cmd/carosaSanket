"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ChooseBillerModal from "./modals/ChooseBillerModal";
import GetStartedModal from "./modals/GetStartedModal";
import OtpVerificationModal from "./modals/OtpVerificationModal";
import "../../styles/carosacare.css";

function FastagRecharge() {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Modal states
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  
  // Form states
  const [selectedBiller, setSelectedBiller] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Handle Recharge Now button click
  const handleRechargeNow = () => {
    setShowModal1(true);
  };
  
  // Handle Continue from Modal 1
  const handleContinueFromModal1 = () => {
    if (selectedBiller && vehicleNumber) {
      setShowModal1(false);
      setShowModal2(true);
    }
  };
  
  // Handle Get OTP from Modal 2
  const handleGetOtp = () => {
    if (phoneNumber && phoneNumber.length === 10) {
      setShowModal2(false);
      setShowModal3(true);
    }
  };
  
  // Handle Verify OTP
  const handleVerifyOtp = (otpValue) => {
    // Here you would typically verify the OTP
    // For now, just close the modal and reset states
    setShowModal3(false);
    resetAllStates();
  };
  
  // Handle Edit Phone (go back to modal 2)
  const handleEditPhone = () => {
    setShowModal3(false);
    setShowModal2(true);
  };
  
  // Reset all states
  const resetAllStates = () => {
    setSelectedBiller("");
    setVehicleNumber("");
    setPhoneNumber("");
  };
  
  // Handle close modal
  const handleCloseModal = (modalNumber) => {
    if (modalNumber === 1) {
      setShowModal1(false);
    } else if (modalNumber === 2) {
      setShowModal2(false);
    } else if (modalNumber === 3) {
      setShowModal3(false);
    }
    resetAllStates();
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I recharge my FASTag?",
      answer: "You can recharge your FASTag by entering your vehicle number or FASTag ID, selecting your bank/provider, entering the recharge amount, and making payment through UPI, debit/credit card, or net banking."
    },
    {
      question: "Can I recharge FASTag of any bank?",
      answer: "Yes, you can recharge FASTag from all major banks and service providers including SBI, ICICI, HDFC, Paytm, Airtel Payments Bank, Axis Bank, and more."
    },
    {
      question: "How long does it take for the balance to update?",
      answer: "The balance updates instantly after a successful recharge. You can start using your FASTag immediately after the transaction is completed."
    },
    {
      question: "Is there any minimum recharge amount?",
      answer: "The minimum recharge amount may vary depending on your bank or service provider. Please check with your specific provider for exact details."
    },
    {
      question: "Can I check my FASTag balance here?",
      answer: "Yes, you can check your FASTag balance using the 'Check Balance' button on our platform. Simply enter your vehicle number or FASTag ID to view your current balance."
    },
    {
      question: "Do I need to log in to recharge?",
      answer: "While you can browse and check balance without logging in, you may need to log in or provide basic details to complete the recharge transaction for security purposes."
    }
  ];

  return (
    <div className="fastag-recharge-page">
      {/* Hero Section */}
      <section className="fastag-hero-section">
        <Container fluid className="">
          <Row className="align-items-center">
            <Col lg={7} className="padding-Y-X">
              <h1 className="fastag-hero-title pt-4">
                NO MORE TOLL BOOTH DELAYS – RECHARGE YOUR <span className="fastag-hero-highlight">FASTAG INSTANTLY</span>
              </h1>
              <p className="fastag-hero-subtitle">
                Simple, quick, and secure FASTag recharge for all banks and service providers in India.
              </p>
              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <Button className="fastag-btn-primary rounded-5" onClick={handleRechargeNow}>Recharge Now</Button>
                <Button className="fastag-btn-secondary rounded-5">Check Balance</Button>
              </div>
            </Col>
            <Col lg={12} className="px-0">
              <div className="fastag-hero-illustration">
                <img src="/images/bannerddd.png" alt="FASTag Recharge Illustration" className="w-100"/>
                
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What We Offer Section */}
      <section className="fastag-offer-section pt-5 pb-0">
        <Container fluid>
          <Row>
            <Col lg={12} className="text-center mb-3">
              <h2 className="fastag-section-title">
              <span  className="text-primary">  What </span><span className="osa">We </span><span className="text-primary">Offer</span>
              </h2>
              <p className="fastag-section-description">
                Lorem ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </Col>
          </Row>
          <Row className="g-4 padding-Y-X">
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whatweoofer1.png" alt="" className="fastag-feature-image" width="30"/>
                
                </div>
                <h4 className="fastag-feature-title">All Bank Support</h4>
                <p className="fastag-feature-text">
                  Recharge for all major banks like SBI, ICICI, HDFC, Paytm & more.
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whatweoffer2.png" alt="Multiple Payment" className="fastag-feature-image"  width="30"/>
               
                </div>
                <h4 className="fastag-feature-title">Multiple Payment</h4>
                <p className="fastag-feature-text">
                  UPI, debit/credit card, net banking.
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whatweoffer3.png" alt="Instant Top-Up" className="fastag-feature-image"  width="30"/>
                
                </div>
                <h4 className="fastag-feature-title">Instant Top-Up</h4>
                <p className="fastag-feature-text">
                  Faster recharges and instant updates.
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whatweoffer4.png" alt="No Extra Charges" className="fastag-feature-image"  width="30"/>
                
                </div>
                <h4 className="fastag-feature-title">No Extra Charges</h4>
                <p className="fastag-feature-text">
                  Pay only the recharge amount.
                </p>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <div className="fastag-feature-card">
                <div className="fastag-icon-wrapper">
                  <img src="/images/whatweeoffer4.png" alt="Secure & Verified" className="fastag-feature-image"  width="30"/>
              
                </div>
                <h4 className="fastag-feature-title">Secure & Verified</h4>
                <p className="fastag-feature-text">
                  Encrypted gateways for safe payments.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="fastag-how-it-works-section py-5">
        <Container>
          {/* <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="fastag-section-title">
                How It <span className="text-success">Works</span>
              </h2>
              <p className="fastag-section-description">
                Lorem ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </Col>
          </Row> */}
          <Row>
            <Col md={12} className="text-center">
            <img src="/images/howitsworkbanner.png" alt="How It Works" />
            </Col>
          </Row>
          <div className="fastag-steps-connector"></div>
        </Container>
      </section>

      {/* Supported Banks & Partners Section */}
      <section className="fastag-banks-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="fastag-section-title">
                <span  className="text-primary">Supported</span> <span className="osa">Banks <span className="text-primary">&</span> Partners</span>
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

      {/* Why It Matters Section */}
      <section className="fastag-why-matters-section py-5">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="fastag-section-title">
                 <span className="text-primary">Why It</span> <span className="osa">Matters </span>
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/whtmatter1.png" 
                    alt="Avoid high penalties" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <p className="fastag-benefit-text">
                  Avoid high penalties for insufficient FASTag balance.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/whymatter2.png" 
                    alt="Skip toll booth delays" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
                <p className="fastag-benefit-text">
                  Skip toll booth delays and cash handling.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="fastag-benefit-card">
                <div className="fastag-benefit-icon-wrapper">
                  <Image 
                    src="/images/whymatter3.png" 
                    alt="Enjoy seamless travel" 
                    width={60} 
                    height={60}
                    className="fastag-benefit-image mb-2"
                  />
                </div>
            
                <p className="fastag-benefit-text">
                  Enjoy seamless and uninterrupted travel.
                </p>
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

      {/* Modal 1: Choose Biller */}
      <ChooseBillerModal
        show={showModal1}
        onHide={() => handleCloseModal(1)}
        onContinue={handleContinueFromModal1}
        selectedBiller={selectedBiller}
        setSelectedBiller={setSelectedBiller}
        vehicleNumber={vehicleNumber}
        setVehicleNumber={setVehicleNumber}
      />

      {/* Modal 2: Get Started with Carosa */}
      <GetStartedModal
        show={showModal2}
        onHide={() => handleCloseModal(2)}
        onGetOtp={handleGetOtp}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      {/* Modal 3: OTP Verification */}
      <OtpVerificationModal
        show={showModal3}
        onHide={() => handleCloseModal(3)}
        onVerify={handleVerifyOtp}
        phoneNumber={phoneNumber}
        onEditPhone={handleEditPhone}
      />
    </div>
  );
}

export default FastagRecharge;

