
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/carosacare.css";

/* ================= WHY SCRAP DATA ================= */
const whyData = [
  {
    title: "Instant Valuation",
    desc: "Fair scrap rates based on weight & condition.",
    img: "/images/valuation.png",
  },
  {
    title: "Legal Compliance",
    desc: "RC cancellation & scrap certificate.",
    img: "/images/legal.png",
  },
  {
    title: "Doorstep Pickup",
    desc: "We tow your car from anywhere.",
    img: "/images/pickup.png",
  },
  {
    title: "Friendly Disposal",
    desc: "Authorized scrap yards only.",
    img: "/images/disposal.png",
  },
  {
    title: "Same-Day Payment",
    desc: "Instant payout before pickup.",
    img: "/images/payment.png",
  },
];

/* ================= WHEN SCRAP DATA ================= */
const whenData = [
  {
    text: "Vehicle older than 15 years in Delhi NCR",
    img: "/images/old-car.png",
  },
  {
    text: "Failed fitness test and costly to repair.",
    img: "/images/fitness.png",
  },
  {
    text: "Accident-damaged & declared total loss.",
    img: "/images/accident.png",
  },
  {
    text: "High maintenance cost and low resale value.",
    img: "/images/maintenance.png",
  },
];

export default function ScrapPage() {
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
      {/* ================= SCRAP HERO ================= */}
      <section className="fastag-hero-section">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="fastag-hero-title pt-4">
                TIME TO SAY GOODBYE? <span className="fastag-hero-highlight">WE'LL HANDLE THE REST</span>
              </h1>

              <p className="fastag-hero-subtitle">
                Get the best scrap value for your old or unfit vehicle, with
                complete legal paperwork and eco-friendly disposal.
              </p>

              <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <button className="btn btn-warning px-4 py-2 fw-semibold text-white rounded-pill">
                  Scrape my car
                </button>
                <button className="btn btn-outline-primary px-4 py-2 fw-semibold rounded-pill">
                  Get instant quote
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <Image
                src="/images/scrap-hero.png"
                alt="Scrap Car Illustration"
                width={520}
                height={380}
                className="img-fluid scrap-hero-img"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY SCRAP CAR ================= */}
      <section className="fastag-offer-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">Why</span> <span className="osa">Scrap Your Car</span> <span className="text-primary">with Carosa?</span>
            </h2>
            <p className="fastag-section-description">
              Safe, legal, and hassle-free vehicle scrapping — handled end to end by Carosa.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {whyData.map((item, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg">
                <div className="why-scrap-card">
                  <div className="why-scrap-icon">
                    <Image src={item.img} alt={item.title} width={40} height={40} />
                  </div>
                  <h6 className="why-scrap-title">{item.title}</h6>
                  <p className="why-scrap-desc mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHEN SCRAP CAR ================= */}
      <section className="fastag-offer-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fastag-section-title">
              <span className="text-primary">When Should You</span> <span className="osa">Scrap Your Car?</span>
            </h2>
          </div>

          <div className="row g-4">
            {whenData.map((item, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="when-scrap-card">
                  <div className="when-scrap-icon">
                    <Image src={item.img} alt="Scrap Condition" width={56} height={56} />
                  </div>
                  <p className="when-scrap-text mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="fastag-how-it-works-section py-5">
        <div className="container text-center">
          <h2 className="fastag-section-title">
            <span className="text-primary">How It</span> <span className="osa">Works</span>
          </h2>
          <p className="fastag-section-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          <div className="howitworks-img-wrapper">
            <Image
              src="/images/howWork.png"
              alt="How It Works"
              width={1200}
              height={420}
              className="img-fluid"
              priority
            />
          </div>
        </div>
      </section>

      {/* ================= WHAT WE PROVIDE (CSS VERSION ADDED AT BOTTOM) ================= */}
      <section className="fastag-offer-section">
        <div className="container">

          <div className="text-center mb-3">
            <h2 className="fastag-section-title">
              <span className="text-primary">What We</span> <span className="osa">Provide</span>
            </h2>
            <p className="fastag-section-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>

          <div className="text-center">
            <Image
              src="/images/what-we-provide.png"
              alt="What We Provide"
              width={900}
              height={260}
              className="img-fluid what-provide-img"
              priority
            />
          </div>

        </div>
      </section>

      {/* ================= AUTHORIZED SCRAP PARTNERS ================= */}
      <section className="fastag-banks-section py-5">
        <div className="container text-center">

          {/* HEADING */}
          <h2 className="fastag-section-title mb-5">
            <span className="text-primary">Our Authorized</span> <span className="osa">Scrap Partners</span>
          </h2>

          <p className="fastag-section-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          {/* IMAGE */}
          <Image
            src="/images/authorized-scrap.png"
            alt="Authorized Scrap Partners"
            width={1100}
            height={260}
            className="authorized-scrap-img"
            priority
          />

        </div>
      </section>

      {/* ================= WHY IT MATTERS ================= */}
      <section className="fastag-why-matters-section py-5">
        <div className="container text-center">

          {/* HEADING */}
          <h2 className="fastag-section-title mb-5">
            <span className="text-primary">Why It</span> <span className="osa">Matters</span>
          </h2>

          <p className="fastag-section-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          {/* IMAGE */}
          <Image
            src="/images/why-it-matters.png"
            alt="Why It Matters"
            width={1000}
            height={300}
            className="img-fluid mx-auto"
            priority
          />

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

