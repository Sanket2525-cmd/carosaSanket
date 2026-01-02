
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

const cards = [
  {
    title: "Registration Details",
    desc: "RTO, state, registration date, vehicle type.",
    img: "/images/registration.png",
  },
  {
    title: "Ownership History",
    desc: "Previous owners, transfer records, name match.",
    img: "/images/ownership.png",
  },
  {
    title: "Loan / Hypothecation Status",
    desc: "Check if the car is financed or lien-free.",
    img: "/images/loan.png",
  },
  {
    title: "Insurance History",
    desc: "Current & past policy details.",
    img: "/images/insurance.png",
  },
  {
    title: "Accident Records",
    desc: "Claims made, repair history, damage summary.",
    img: "/images/accident.png",
  },
  {
    title: "Theft Records",
    desc: "Police FIR status, blacklist check.",
    img: "/images/theft.png",
  },
  {
    title: "Odometer Tampering Check",
    desc: "Compare service & inspection readings.",
    img: "/images/odometer.png",
  },
  {
    title: "Flood / Disaster Damage",
    desc: "Past incidents or salvage history.",
    img: "/images/flood.png",
  },
  {
    title: "PUC Status",
    desc: "Pollution certificate validity.",
    img: "/images/puc.png",
  },
  {
    title: "Service History",
    desc: "Detailed periodic service logs & major maintenance.",
    img: "/images/service.png",
  },
  {
    title: "Parts Changes",
    desc: "Replaced components, OEM vs aftermarket parts.",
    img: "/images/parts.png",
  },
  {
    title: "Full Transparency",
    desc: "Avoid surprises after purchase.",
    img: "/images/transparency.png",
  },
  {
    title: "Accident Records",
    desc: "See if the car was involved in crashes or floods.",
    img: "/images/accident2.png",
  },
  {
    title: "Loan Status",
    desc: "Check if there’s any active loan or hypothecation.",
    img: "/images/loan2.png",
  },
  {
    title: "Ownership Verification",
    desc: "Confirm seller's claims with real records.",
    img: "/images/verify.png",
  },
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

/* ================= WHY IT MATTERS DATA ================= */
const whyItMattersData = [
  {
    img: "/images/why1.png",
    text: "Buying a stolen or illegally modified car.",
  },
  {
    img: "/images/why2.png",
    text: "Paying for a car with hidden accident damage.",
  },
  {
    img: "/images/why3.png",
    text: "Inheriting unpaid loans or fines.",
  },
  {
    img: "/images/why4.png",
    text: "Getting a vehicle with legal disputes.",
  },
];

export default function VehicleHistoryPage() {
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
      {/* ================= HERO SECTION ================= */}
      <section className="history-hero mt-50">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* LEFT CONTENT */}
            <div className="col-lg-6">
              <p className="vh-eyebrow">EVERY CAR HAS A STORY</p>

              <h1 className="fastag-hero-title pt-4">
                MAKE SURE YOU <br /> <span className="fastag-hero-highlight">KNOW IT</span>
              </h1>

              <p className="fastag-hero-subtitle">
                Get a verified history report including ownership, accidents,
                loan status, theft records, and more.
              </p>

              <div className="vh-card">
                <label className="vh-label">Enter Car Reg. No.</label>

                <div className="input-group mb-3">
                  <span className="input-group-text">🇮🇳</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="DL 12 AA 1234"
                  />
                </div>

                <button className="btn vh-btn-orange w-100">
                  Get History Report
                </button>
              </div>

              <div className="vh-download">
                <p className="fw-semibold mb-2">What You Will Get</p>
                <button className="btn vh-btn-green w-100">
                  ⬇ Download Sample Report
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 text-center">
              <Image
                src="/images/car-history1.png"
                alt="Car History"
                width={520}
                height={450}
                className="img-fluid"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY HISTORY CARDS ================= */}
      <section className="why-history-cards">
        <div className="container">

          {/* HEADING */}
          <div className="why-history-heading text-center">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why Get a Car</span> <span className="osa">History Report</span> <span className="text-primary">with Carosa?</span>
            </h2>
            <p className="fastag-section-description">
              Because every car has a past — and knowing it protects your money,
              safety, and peace of mind.
            </p>
          </div>

          {/* CARDS */}
          <div className="row g-4">
            {cards.map((item, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="history-card">

                  {/* LEFT IMAGE */}
                  <div className="history-card-img">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={32}
                      height={32}
                    />
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="history-card-text">
                    <h6>{item.title}</h6>
                    <p>{item.desc}</p>
                  </div>

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

      {/* ================= WHY IT MATTERS ================= */}
      <section className="why-section">
        <div className="container text-center">

          <h2 className="fastag-section-title">
            <span className="text-primary">Why It Matters —</span> <span className="osa">Stay Safe & Informed</span>
          </h2>

          <p className="fastag-section-description">
            Carosa helps you avoid all these risks with complete and verified history.
          </p>

          <div className="row g-4 mt-4">
            {whyItMattersData.map((item, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="why-card">

                  {/* ICON LEFT */}
                  <div className="why-icon">
                    <Image
                      src={item.img}
                      alt="icon"
                      width={42}
                      height={42}
                    />
                  </div>

                  {/* TEXT BELOW ICON */}
                  <p className="why-text">{item.text}</p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= VERIFY BANNER ================= */}
      <section className="verify-section">
        <div className="verify-banner">
          <div className="row align-items-center g-4">

            {/* LEFT CONTENT */}
            <div className="col-lg-7 text-center text-lg-start">
              <span className="verify-badge">
                Better Clarity
              </span>

              <h2 className="verify-title">
                Don't guess the past verify <br />
                it with trusted records.
              </h2>

              <p className="verify-desc">
                We will call you to confirm details and provide a transparent
                quote. Doorstep pickup available in major cities.
              </p>

              <button className="btn verify-btn">
                Get Full Report
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-5 text-center">
              <Image
                src="/images/verify-banner.png"
                alt="Verification Report"
                width={430}
                height={270}
                className="img-fluid"
                priority
              />
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


