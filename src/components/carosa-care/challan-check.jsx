


"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

/* ================= CHALLAN REPORT DATA ================= */
const reportData = [
  {
    title: "Pending Challans",
    desc: "View all unpaid e-challans linked to the vehicle.",
    icon: "/images/pending.png",
  },
  {
    title: "Violation Details",
    desc: "Know exact offence, location, date & time.",
    icon: "/images/violation.png",
  },
  {
    title: "Photos & Evidence",
    desc: "Where available, get violation images.",
    icon: "/images/photos.png",
  },
  {
    title: "Payment Status",
    desc: "Check if any challan is overdue or disputed.",
    icon: "/images/payment-status.png",
  },
  {
    title: "Online Payment",
    desc: "Clear challans instantly via secure payment.",
    icon: "/images/online-payment.png",
  },
  {
    title: "Receipt Download",
    desc: "Get a digital receipt for future reference.",
    icon: "/images/receipt.png",
  },
];

/* ================= WHY CLEAR CHALLANS DATA ================= */
const boxData = [
  {
    img: "/images/icon1.png",
    title: "Avoid Late Fees & Legal Action",
    desc: "Prevent penalty escalation and legal complications.",
  },
  {
    img: "/images/icon2.png",
    title: "Keep Driving Record Clean",
    desc: "Prevent penalty escalation and legal complications.",
  },
  {
    img: "/images/icon2.png",
    title: "Prevent RTO Issues",
    desc: "Unpaid challans can block your RC or licence renewal.",
  },
  {
    img: "/images/icon3.png",
    title: "Peace of Mind",
    desc: "Clear dues before selling or transferring the vehicle.",
  },
];

/* ================= WHY CHOOSE CAROSA DATA ================= */
const features = [
  { title: "Instant Verification", icon: "/images/verify.png" },
  { title: "Secure Payments", icon: "/images/secure.png" },
  { title: "Govt-Verified Data", icon: "/images/gov.png" },
  { title: "Easy Receipts", icon: "/images/receipt.png" },
  { title: "Nationwide Coverage", icon: "/images/globe.png" },
  { title: "No Hidden Charges", icon: "/images/no-charges.png" },
];

/* ================= HOW CAROSA WORKS DATA ================= */
const stepsText = [
  {
    title: "Enter Vehicle Number",
    desc: "Provide the vehicle registration number.",
  },
  {
    title: "Carosa Fetches Challans",
    desc: "We check official traffic challan databases instantly.",
  },
  {
    title: "View & Pay",
    desc: "See pending challans and clear dues securely.",
  },
  {
    title: "Download Receipt",
    desc: "Get a digital challan receipt after payment.",
  },
];

/* ================= CAROSA KA BHAROSA DATA ================= */
const trustData = [
  {
    icon: "/images/authentic.png",
    title: "Authentic Government Data",
    desc: "No manipulated or outdated challan info.",
  },
  {
    icon: "/images/fast.png",
    title: "Fast & Transparent",
    desc: "Quick challan status with real-time updates.",
  },
  {
    icon: "/images/secure.png",
    title: "100% Secure",
    desc: "Verified and encrypted payment workflow.",
  },
];

export default function ChallanPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does a refurbishment take?",
      answer: "Refurbishment timelines depend on the scope of work and usually range from a few days to a couple of weeks."
    },
    {
      question: "Do you use original manufacturer parts?",
      answer: "Yes, we use OEM or premium quality approved aftermarket parts."
    },
    {
      question: "Is refurbishment the same as repair?",
      answer: "No. Repair fixes specific issues, while refurbishment improves overall look, performance, and value."
    },
    {
      question: "Will refurbishment improve resale value?",
      answer: "Yes, professional refurbishment can significantly improve the resale value of your car."
    },
    {
      question: "Do you provide a warranty on refurbishment work?",
      answer: "Yes, warranty coverage is provided depending on the type of service performed."
    }
  ];

  return (
    <>
      {/* ================= CHALLAN CHECK SECTION ================= */}
      <section className="challan-section mt-60">
        <div className="container">
          <div className="row align-items-center g-4">

            <div className="col-lg-6">
              <h1 className="fastag-hero-title pt-4">
                CHECK CHALLANS & <br />
                <span className="fastag-hero-highlight">PAY INSTANTLY</span>
              </h1>

              <p className="fastag-hero-subtitle">
                Enter your vehicle number to view pending challans,
                violation details, payment status and clear dues instantly.
              </p>

              <div className="challan-box">
                <label className="vehicle-label">Enter vehicle number</label>

                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">🇮🇳</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="DL 12 AA 1234"
                  />
                </div>

                <button className="btn challan-btn w-100">
                  Get Challan Details
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <Image
                src="/images/challan-illustration.png"
                alt="Check Challan"
                width={520}
                height={400}
                className="img-fluid"
                style={{ width: '100%' }}
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= CHALLAN REPORT SECTION ================= */}
      <section className="challan-report-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">What You Get in</span> <span className="osa">Challan Report</span>
            </h2>
            <p className="fastag-section-description">
              A complete view of all traffic challans linked to your vehicle.
            </p>
          </div>

          <div className="row g-4">
            {reportData.map((item, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div className="report-card h-100">
                  <div className="icon-box">
                    <Image src={item.icon} alt={item.title} width={32} height={32} />
                  </div>
                  <h6 className="card-title">{item.title}</h6>
                  <p className="card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CLEAR CHALLANS ================= */}
      <section className="why-challan-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Clear</span> <span className="osa">Challans Early?</span>
            </h2>
          </div>

          <div className="row g-4">
            {boxData.map((item, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="info-box h-100">
                  <Image src={item.img} alt={item.title} width={40} height={40} />
                  <h6 className="info-title mt-3">{item.title}</h6>
                  <p className="info-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE CAROSA (ADDED LAST) ================= */}
      <section className="why-carosa-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Choose Carosa for</span> <span className="osa">Challan Check?</span>
            </h2>
          </div>

          <div className="row g-4">
            {features.map((item, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div className="why-box h-100 d-flex align-items-center gap-3">
                  <Image src={item.icon} alt={item.title} width={36} height={36} />
                  <p className="why-box-text mb-0">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW CAROSA WORKS ================= */}
      <section className="how-carosa-section">
        <div className="container">

          {/* HEADING */}
          <div className="text-center mb-4">
            <h2 className="fastag-section-title">
              <span className="text-primary">How</span> <span className="osa">Carosa Works</span>
            </h2>
            <p className="fastag-section-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
            {stepsText.map((item, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <h6 className="step-title">{item.title}</h6>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CAROSA KA BHAROSA ================= */}
      <section className="bharosa-section py-5">
        <div className="container">

          {/* HEADING */}
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Carosa Ka</span> <span className="osa">Bharosa</span>
            </h2>
            <p className="fastag-section-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>

          {/* BOXES */}
          <div className="row g-4 justify-content-center">
            {trustData.map((item, i) => (
              <div className="col-lg-4 col-md-6 text-center" key={i}>
                <div className="bharosa-box h-100">
                  <div className="icon-wrap mb-3">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={36}
                      height={36}
                    />
                  </div>
                  <h6 className="bharosa-box-title">{item.title}</h6>
                  <p className="bharosa-box-desc">{item.desc}</p>
                </div>
              </div>
            ))}
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
                priority
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-lg-6 d-flex flex-column justify-content-center">
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
            </div>

          </div>
        </div>
      </section>
    </>
  );
}



