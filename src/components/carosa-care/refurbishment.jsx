

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../styles/carosacare.css";

/* ================= WHY CHOOSE DATA ================= */
const whyData = [
  {
    img: "/images/1.png",
    title: "End-to-End Service",
    desc: "Paintwork, denting, mechanical repairs & more.",
  },
  {
    img: "/images/2.png",
    title: "Genuine Parts",
    desc: "OEM or premium aftermarket parts.",
  },
  {
    img: "/images/3.png",
    title: "Certified Technicians",
    desc: "Experienced professionals.",
  },
  {
    img: "/images/4.png",
    title: "Boost Resale Value",
    desc: "Increase buyer appeal.",
  },
  {
    img: "/images/5.png",
    title: "Custom Solutions",
    desc: "Tailored to your needs.",
  },
];

/* ================= REFURBISHMENT DATA ================= */
const services = [
  {
    title: "Exterior Restoration",
    items: ["Dent & scratch removal", "Full repaint", "Alloy wheel repair"],
    img: "/images/service1.png",
  },
  {
    title: "Interior Renewal",
    items: ["Upholstery & Replacement", "Dashboard polish", "Carpet shampoo"],
    img: "/images/service2.png",
  },
  {
    title: "Mechanical Overhaul",
    items: ["Engine tune-up", "Suspension repair", "Brake service"],
    img: "/images/service3.png",
  },
  {
    title: "Electrical Check & Repair",
    items: [
      "Lighting & wiring repair",
      "Infotainment & sensors",
      "Battery & charging system",
    ],
    img: "/images/service4.png",
  },
  {
    title: "Glass & Windshield",
    items: [
      "Crack repair or replacement",
      "Window regulator checks",
      "Mirror replacement",
    ],
    img: "/images/service5.png",
  },
  {
    title: "Detailing & Polishing",
    items: [
      "Interior & exterior detailing",
      "Paint & ceramic coating",
      "Engine bay cleaning",
    ],
    img: "/images/service6.png",
  },
];

export default function ScrapOldCar() {
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
      {/* ================= SCRAP OLD CAR ================= */}
      <section className="fastag-hero-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-7 padding-Y-X">
              <h1 className="fastag-hero-title pt-4">
                GIVE YOUR CAR A SECOND <span className="fastag-hero-highlight">LIFE WITH CARE</span>
              </h1>
              <p className="fastag-hero-subtitle">
                From minor touch-ups to complete overhauls — Carosa offers
                professional car refurbishment to improve looks, performance,
                and resale value.
              </p>
              <div className="fastag-cta-buttons d-flex gap-3 flex-wrap">
                <button className="btn btn-warning fw-semibold px-4 py-2 rounded-pill">
                  Get a free estimate
                </button>
                <button className="btn btn-outline-primary fw-semibold px-4 py-2 rounded-pill">
                  Book Refurbishment
                </button>
              </div>
            </div>
            <div className="col-lg-12 px-0">
              <div className="fastag-hero-illustration" style={{ marginTop: "-100px" }}>
                <img src="/images/carosa-care.png" alt="Car service" className="w-100"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="fastag-offer-section">
        <div className="container text-center">
          <h2 className="fastag-section-title">
            <span className="text-primary">Why Choose Carosa</span>{" "}
            <span className="osa">Car Refurbishment?</span>
          </h2>

          <p className="fastag-section-description">
            Because your car deserves expert care, transparent pricing, and
            factory-grade refurbishment.
          </p>

          <div className="row g-4 justify-content-center mt-4">
            {whyData.map((item, i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 col-lg">
                <div className="why-card-v2">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={40}
                    height={40}
                  />
                  <h6>{item.title}</h6>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REFURBISHMENT SERVICES ================= */}
      <section className="fastag-offer-section">
        <div className="container">
          <div className="refurbishment-heading">
            <h2 className="fastag-section-title">
              <span className="text-primary">What's Included in Our</span>{" "}
              <span className="osa">Refurbishment</span>{" "}
              <span className="text-primary">Services</span>
            </h2>
            <p className="fastag-section-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          <div className="row g-4">
            {services.map((item, i) => (
              <div className="col-md-6" key={i}>
                <div className="service-card">
                  <div className="service-content">
                    <div className="service-text">
                      <h5>{item.title}</h5>
                      <ul>
                        {item.items.map((point, idx) => (
                          <li key={idx}>
                            <span className="check-icon">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <img
                      src={item.img}
                      alt={item.title}
                      className="service-image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (NICHE ADD) ================= */}
      <section className="fastag-how-it-works-section">
        <>
        <div className="container text-center">
          <h2 className="fastag-section-title">
            <span className="text-primary">How It</span> <span className="osa">Works</span>
          </h2>

          <p className="fastag-section-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
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

<section className="fastag-why-matters-section bg-white" style={{ marginTop: "40px" }}>
    <>

      <div className="container">

        {/* Heading */}
        <h2 className="fastag-section-title text-center mb-5">
          <span className="text-primary">Why It</span> <span className="osa">Matters</span>
        </h2>

        <div className="row g-4">

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="why-card">
              <img src="/images/safety.png" alt="" className="why-icon" />
              <p className="why-text">
                Improve safety and reliability.
              </p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="why-card">
              <img src="/images/comfort.png" alt="" className="why-icon" />
              <p className="why-text">
                Enhance comfort and aesthetics.
              </p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="why-card">
              <img src="/images/value.png" alt="" className="why-icon" />
              <p className="why-text">
                Increase resale value by up to 20%
              </p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="why-card">
              <img src="/images/life.png" alt="" className="why-icon" />
              <p className="why-text">
                Extend your car’s lifespan with maintenance.
              </p>
            </div>
          </div>

        </div>
      </div>

<section className="estimate-section">
    <>
      <div className="container">
        <div className="estimate-wrapper row align-items-center rounded-4 p-4 p-lg-5">
          
          {/* LEFT CONTENT */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="fastag-section-title">
              <span className="text-primary">Open Estimate &</span> <br /> <span className="osa">Booking Form</span>
            </h2>

            <p className="fastag-section-description">
              Join Millions of people who build a fully integrated sales
              and marketing solution.
            </p>

            <Image
              src="/images/estimate-illustration.png"
              alt="Estimate Illustration"
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
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>

                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Phone number" />
                </div>

                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Location" />
                </div>

                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Pin Code" />
                </div>

                <div className="col-12">
                  <select className="form-select">
                    <option>Select Service Required</option>
                    <option>Car Refurbishment</option>
                    <option>Mechanical Repair</option>
                    <option>Detailing</option>
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




</>

    </section>


      </>
    </section>

        </>
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







