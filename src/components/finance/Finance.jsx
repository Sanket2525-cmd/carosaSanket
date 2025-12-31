
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/carosacare.css";

/* ================= WHY CAROSA LOANS DATA ================= */
const whyCarosaData = [
  {
    img: "/images/bank.png",
    text: "Partnership with leading banks & NBFCs",
  },
  {
    img: "/images/rate12.png",
    text: "Competitive rates negotiated for our customers",
  },
  {
    img: "/images/rate12.png",
    text: "Pre-approved offers for repeat buyers",
  },
  {
    img: "/images/document.png",
    text: "Doorstep document pickup & verification",
  },
];

export default function AutoLoanHero() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does loan approval take?",
      answer: "Loan approvals with Carosa are fast and simple. In most cases, you will get an approval decision within 10-30 minutes of submitting your complete documents. For certain cases requiring additional verification, it may take up to 24-48 hours."
    },
    {
      question: "What documents are required for loan application?",
      answer: "You typically need identity proof (Aadhaar, PAN), address proof, income documents (salary slips or ITR), and vehicle details. Our team will guide you through the complete list based on your loan type."
    },
    {
      question: "What is the minimum and maximum loan amount?",
      answer: "Loan amounts vary based on your eligibility, credit profile, and the vehicle value. We offer flexible loan amounts starting from ₹50,000 up to ₹50 lakhs or more, depending on your financial profile."
    },
    {
      question: "What is the interest rate for auto loans?",
      answer: "Interest rates are competitive and depend on factors like your credit score, loan amount, tenure, and lender. Rates typically range from 7% to 15% per annum. We help you find the best rates available."
    },
    {
      question: "Can I get a loan with a low credit score?",
      answer: "Yes, we work with multiple lenders who offer loans to applicants with varying credit scores. While a higher credit score gets better rates, we can help you find suitable options even with a lower score."
    },
    {
      question: "What is the maximum loan tenure?",
      answer: "Auto loan tenures typically range from 1 year to 7 years, depending on the loan amount and lender policies. Longer tenures result in lower EMIs but higher total interest."
    },
    {
      question: "Is there a prepayment penalty?",
      answer: "Prepayment terms vary by lender. Some lenders allow prepayment without penalty, while others may charge a small fee. We'll explain the prepayment terms before you finalize your loan."
    },
    {
      question: "Can I apply for a loan online?",
      answer: "Yes, you can start your loan application online through our platform. Simply fill in your details, upload documents, and our team will guide you through the rest of the process."
    },
    {
      question: "Do I need to provide a down payment?",
      answer: "Down payment requirements vary by lender and loan amount. Typically, lenders require 10-20% of the vehicle value as down payment. We can help you find options with lower down payment requirements."
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer: "Missing EMI payments can result in late fees and may impact your credit score. We recommend contacting your lender immediately if you anticipate payment difficulties. Some lenders offer grace periods or restructuring options."
    },
    {
      question: "Can I transfer my existing loan to Carosa?",
      answer: "Yes, we offer loan balance transfer services. If you have an existing auto loan with higher interest rates, we can help you transfer it to a lender offering better rates, potentially saving you money."
    },
    {
      question: "Is insurance mandatory with the loan?",
      answer: "Yes, comprehensive vehicle insurance is mandatory when taking an auto loan. Lenders require it to protect their interest in the vehicle. We can help you get the best insurance rates along with your loan."
    },
    {
      question: "What is the processing fee for loans?",
      answer: "Processing fees vary by lender and loan amount, typically ranging from 0.5% to 2% of the loan amount. Some lenders may offer zero processing fee offers. We'll provide complete fee transparency upfront."
    },
    {
      question: "Can self-employed individuals apply for loans?",
      answer: "Yes, self-employed individuals can apply for auto loans. You'll need to provide business registration documents, bank statements, ITR, and other financial documents. We work with lenders who specialize in self-employed loans."
    }
  ];

  return (
    <>
      {/* ================= AUTO LOAN HERO ================= */}
      <section className="fastag-hero-section">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6 text-center text-lg-start">
              <p className="hero-eyebrow">IT'S MORE THAN JUST THE</p>

              <h1 className="fastag-hero-title pt-4">
                GET YOUR CAR TODAY – <span className="fastag-hero-highlight">PAY AT YOUR PACE</span>
              </h1>

              <p className="fastag-hero-subtitle">
                Flexible, fast, and transparent auto loans with instant
                approval and minimal paperwork.
              </p>

              <div className="hero-buttons d-flex justify-content-center justify-content-lg-start gap-3">
                <button className="btn btn-emi">Check EMI</button>
                <button className="btn btn-apply">Apply for Loan</button>
              </div>
            </div>

            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <Image
                src="/images/loan-hero.png"
                alt="Auto Loan"
                width={520}
                height={420}
                className="img-fluid"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= AUTO LOAN ASSISTANCE ================= */}
      <section className="fastag-offer-section">
        <div className="container">

          <h2 className="fastag-section-title text-center mb-4">
            <span className="text-primary">Get Assistance</span> <span className="osa">For Auto Loan</span>
          </h2>

          <div className="loan-card mx-auto">
            <h6 className="loan-title mb-3">Auto Loan</h6>

            <div className="row g-3">
              <div className="col-md-6">
                <input className="form-control" placeholder="Your Name" />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Your Phone Number" />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Your City" />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Loan Amount Required" />
              </div>
              <div className="col-12">
                <button className="btn loan-btn w-100">
                  Get Loan Assistance
                </button>
              </div>
            </div>

            <p className="loan-note mt-3">
              We’ll contact you to complete the quick eligibility check.
              By submitting you agree to receive calls/SMS about your inquiry.
            </p>
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
            The Carosa team ensures a smooth and transparent process — from
            application to disbursal — with final approval based on credit
            profile and lender verification.
          </p>

          <div className="how-it-works-img">
            <Image
              src="/images/howWorks.png"
              alt="How It Works"
              width={1100}
              height={300}
              className="img-fluid"
              priority
            />
          </div>
        </div>
      </section>

      {/* ================= WHY CAROSA LOANS ================= */}
      <section className="why-carosa-section">
        <div className="container text-center">

          {/* HEADING */}
          <h2 className="why-title">
            Why Carosa <span>Loans Are Better</span>
          </h2>

          <p className="why-desc mx-auto">
            Carosa Loans make car buying easy with quick approvals, low EMIs,
            and a transparent, hassle-free process from start to finish.
          </p>

          {/* BOXES */}
          <div className="row g-4 mt-4">
            {whyCarosaData.map((item, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="why-box text-start">

                  {/* ICON */}
                  <div className="icon-wrap">
                    <Image
                      src={item.img}
                      alt={item.text}
                      width={36}
                      height={36}
                    />
                  </div>

                  {/* TEXT */}
                  <p className="box-text">{item.text}</p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= LOAN CTA BANNER (NEW – ADDED AT BOTTOM) ================= */}
      <section className="fastag-app-download-section">
        <div className="container">
          <div className="loan-banner-box">
            <div className="row align-items-center">

              <div className="col-lg-7 text-center text-lg-start">
                <span className="loan-badge">Better Clarity</span>

                <h2 className="fastag-app-title" style={{ color: "white" }}>
                  Get behind the wheel of your dream car <br />
                  without the financial speed bumps
                </h2>

                <p className="fastag-app-description" style={{ color: "white" }}>
                  We will call you to confirm details and provide a transparent
                  quote. Doorstep pickup available in major cities.
                </p>

                <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                  <button className="btn loan-btn-primary">
                    Apply for Loan Now
                  </button>
                  <button className="btn loan-btn-secondary">
                    Contact Our Loan Expert
                  </button>
                </div>
              </div>

              <div className="col-lg-5 text-center mt-4 mt-lg-0">
                <Image
                  src="/images/loan-banner.png"
                  alt="Loan Banner"
                  width={420}
                  height={280}
                  className="img-fluid"
                  priority
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Supported Banks & Partners Section */}
      <section className="fastag-banks-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center mb-5">
              <h2 className="fastag-section-title">
                <span className="text-primary">Supported</span> <span className="osa">Banks <span className="text-primary">&</span> Partners</span>
              </h2>
            </div>
          </div>
          <div className="row g-4 align-items-center justify-content-center">
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/sbi.png" alt="SBI" /></div>
              </div>
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/icici.png" alt="ICICI Bank" /></div>
              </div>
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/hdfc.png" alt="HDFC Bank" /></div>
              </div>
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/paytm.png" alt="Paytm" /></div>
              </div>
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/airtel.png" alt="Airtel Payments Bank" /></div>
              </div>
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="fastag-bank-logo">
                <div className="bank-logo-placeholder"><img src="/images/axis.png" alt="Axis Bank" /></div>
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
    </>
  );
}


