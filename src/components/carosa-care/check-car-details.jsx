"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa"; // ✅ ADD THIS
import "../../styles/carosacare.css";



const cards = [
  {
    img: "/images/check1.png",
    title: "Registration Details",
    desc: "RTO, state, registration date, vehicle type."
  },
  {
    img: "/images/check2.png",
    title: "Ownership History",
    desc: "Previous owners, transfer records, name match."
  },
  {
    img: "/images/check3.png",
    title: "Make, Model & Variant",
    desc: "Manufacturer, model year and exact variant details."
  },
  {
    img: "/images/check4.png",
    title: "RC Status",
    desc: "Active, cancelled or expired RC information."
  },
  {
    img: "/images/check5.png",
    title: "Insurance Validity",
    desc: "Policy status and expiry date if available."
  },
  {
    img: "/images/check6.png",
    title: "PUC Validity",
    desc: "Pollution under control certificate validity & history."
  },
  {
    img: "/images/check7.png",
    title: "Challan Status",
    desc: "Pending or paid challans linked to the vehicle number."
  },
  {
    img: "/images/check8.png",
    title: "Hypothecation / Loan",
    desc: "Loan or hypothecation status if vehicle is under lender."
  },
  {
    img: "/images/check9.png",
    title: "Fitness / Roadworthiness",
    desc: "Fitness certificate status for commercial vehicles."
  }
];

const stepsText = [
  {
    title: "Enter Car Number",
    desc: "Type the vehicle registration number in our search bar."
  },
  {
    title: "Carosa Fetches Data",
    desc: "Our system checks RTO databases, insurance records, challan data, PUC logs & more."
  },
  {
    title: "Instant Detailed Report",
    desc: "Get a clean, easy-to-read report with all important car details."
  },
  {
    title: "Make Smarter Decisions",
    desc: "Know the car’s past and present before buying with full transparency."
  }
];

const whyItMattersData = [
  {
    img: "/images/why1.png",
    text: "Authentic Data Only — No manipulated or dealer-influenced reports."
  },
  {
    img: "/images/why2.png",
    text: "Zero Hidden Charges — No surprise fees, clear and transparent pricing."
  },
  {
    img: "/images/why3.png",
    text: "Secure Search — Your query stays private and safe."
  },
  {
    img: "/images/why4.png",
    text: "Built for Buyers & Sellers — Useful for buyers, dealers and marketplaces."
  }
];

/* 🔽 ADDED DATA FOR STORIES SLIDER (NICHE) */
const stories = [
  {
    title: "Found Hidden Challans",
    text: "Carosa revealed ₹4,200 pending challans before purchase.",
    name: "Rohit (Delhi)"
  },
  {
    title: "Verified RC & Insurance",
    text: "Instant RC and insurance verification saved time.",
    name: "Anjali (Mumbai)"
  },
  {
    title: "Exposed Fake Seller",
    text: "Carosa helped avoid fraud before payment.",
    name: "Faisal (Bangalore)"
  },
  {
    title: "Saved From Fraud",
    text: "Detailed history prevented a risky deal.",
    name: "Amit (Pune)"
  },
  {
    title: "Smart Negotiation",
    text: "Pending issues helped negotiate better price.",
    name: "Neha (Jaipur)"
  }
];


const faqs = [
  {
    question: "What information do I get in the Carosa report?",
    answer:
      "The report includes registration details, ownership history, make & variant, RC status, insurance validity, PUC validity, challan status, hypothecation or loan flags, and fitness details where available."
  },
  {
    question: "How accurate is the data?",
    answer:
      "Carosa fetches data from official and trusted sources such as RTO, insurance, and traffic databases. Accuracy depends on the latest available records."
  },
  {
    question: "Is this free? Do you charge for reports?",
    answer:
      "Basic information may be free. Detailed reports may have a small fee depending on the depth of data requested."
  },
  {
    question: "Where does Carosa get its data from?",
    answer:
      "Data is sourced from government RTO databases, insurance providers, challan systems, and other verified public records."
  },
  {
    question: "Will searching a vehicle reveal the owner's personal information?",
    answer:
      "No. Carosa does not show sensitive personal information like address or contact details."
  },
  {
    question: "I found a challan or loan flag — what should I do?",
    answer:
      "Ask the seller to clear all dues or close the loan before purchase and verify the updated status."
  },
  {
    question: "How fast is the report?",
    answer:
      "Most reports are generated instantly within a few seconds."
  },
  {
    question: "What if the RTO records are incorrect?",
    answer:
      "You should verify and request corrections through the respective RTO office."
  }
];


const ITEMS_PER_VIEW = 3;
export default function CarDetailsCardPage() {
  const [startIndex, setStartIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null); // ✅ ADD THIS LINE

  const handleNext = () => {
    if (startIndex + ITEMS_PER_VIEW < stories.length) {
      setStartIndex(startIndex + ITEMS_PER_VIEW);
    }
  };

  const handlePrev = () => {
    if (startIndex - ITEMS_PER_VIEW >= 0) {
      setStartIndex(startIndex - ITEMS_PER_VIEW);
    }
  };

  const visibleStories = stories.slice(
    startIndex,
    startIndex + ITEMS_PER_VIEW
  );

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };


 
  return (
    <>
      {/* HERO SECTION */}
      <section className="history-hero mt-50">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <h1 className="fastag-hero-title pt-2">
                CHECK CAR{" "}
                <span className="fastag-hero-highlight">RTO DETAILS</span>
                <br />
                WITH THE HELP OF{" "}
                <span className="fastag-hero-highlight">CAROSA</span>
              </h1>

              <p className="fastag-hero-subtitle">
                Enter any car number to get verified details like RC status,
                ownership, insurance, challans, PUC, and more.
              </p>

              <div className="vh-card mt-4">
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
                  Check Now
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <Image
                src="/images/checkDetails1.png"
                alt="Check Car RTO Details"
                width={520}
                height={450}
                className="img-fluid"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="why-history-cards">
        <div className="container">
          <div className="why-history-heading text-center">
            <h2 className="fastag-section-title">
              What You Get in{" "}
              <span className="text-primary">RTO Details</span>{" "}
              <span className="osa">Report</span>
            </h2>
            <p className="fastag-section-description">
              Official registration and ownership information sourced from RTO records.
            </p>
          </div>

          <div className="row g-4">
            {cards.map((item, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="history-card">
                  <div className="history-card-img">
                    <Image src={item.img} alt={item.title} width={32} height={32} />
                  </div>
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

      {/* HOW CAROSA WORKS */}
      <section className="how-carosa-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fastag-section-title">
              <span className="text-primary">How</span>{" "}
              <span className="osa">Carosa Works</span>
            </h2>
            <p className="fastag-section-description">
              Check complete car details instantly in just a few simple steps.
            </p>
          </div>

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

      {/* CAROSA KA BHAROSA */}
      <section className="why-section">
        <div className="container text-center">
          <h2 className="fastag-section-title">
            <span className="text-primary">Carosa Ka</span>{" "}
            <span className="osa">Bharosa</span>
          </h2>

          <p className="fastag-section-description">
            Carosa helps you avoid all these risks with complete and verified history.
          </p>

          <div className="row g-4 mt-4">
            {whyItMattersData.map((item, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="why-card">
                  <div className="why-icon">
                    <Image src={item.img} alt="icon" width={42} height={42} />
                  </div>
                  <p className="why-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 STORIES OF BHAROSA (FINAL NICHE ADDED) */}
      <section className="py-5" style={{ background: "#eef8fd" }}>
  <div className="container">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold mb-1">
          Stories of <span className="text-primary">Bharosa</span>
        </h2>
        <p className="text-muted mb-0">The Heart of Our Mission</p>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-light rounded-circle"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          ‹
        </button>
        <button
          className="btn btn-light rounded-circle"
          onClick={handleNext}
          disabled={startIndex + ITEMS_PER_VIEW >= stories.length}
        >
          ›
        </button>
      </div>
    </div>

    <div className="row g-4">
      {visibleStories.map((item, index) => (
        <div className="col-12 col-md-6 col-lg-4" key={index}>
          <div className="bg-white h-100 rounded-4 p-4 shadow-sm">
            
            {/* ⭐ RATING */}
            <div className="mb-2">
              <span style={{ color: "#f4b400", fontSize: "14px" }}>
                ★★★★★
              </span>
              <span className="text-muted ms-2 small">4.8/5 Rating</span>
            </div>

            {/* TITLE */}
            <h6 className="fw-bold mb-2">{item.title}</h6>

            {/* TEXT */}
            <p className="text-muted small mb-3">{item.text}</p>

            {/* USER */}
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                  display: "inline-block"
                }}
              ></span>
              <span className="fw-semibold small">{item.name}</span>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="fastag-faq-section py-5">
        <div className="container">
          <div className="fastag-faq-wrapper">
            <div className="fastag-faq-header text-center">
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
      </section>

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









