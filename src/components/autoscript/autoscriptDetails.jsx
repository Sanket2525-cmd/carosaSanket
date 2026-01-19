
"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/autoscript.css";



const faqs = [
  {
    question: "How do I sell my car quickly?",
    answer:
      "To sell your car quickly, keep all documents ready, price it competitively, and use a trusted platform with verified buyers.",
  },
  {
    question: "What documents are needed for RC transfer?",
    answer:
      "You will need the RC, Form 29 & 30, valid insurance, PUC certificate, ID proof, address proof, and loan NOC if applicable.",
  },
  {
    question: "Which warranty options should I choose?",
    answer:
      "Choose warranty plans that cover major components like the engine and transmission, especially for used cars.",
  },
  {
    question: "How can I verify a car’s ownership history?",
    answer:
      "You can verify ownership history using the vehicle registration number through trusted RTO-based verification platforms.",
  },
];

export default function AutoscriptBlogPage() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="autoscript-hero">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="autoscript-card">

                {/* LEFT IMAGE */}
                <div className="autoscript-image">
                  <img
                    src="/autoscript/car.png"
                    alt="How to Maximize Your Car’s Resale Value"
                  />
                </div>

                {/* RIGHT CONTENT */}
                <div className="autoscript-content">
                  <span className="autoscript-badge">AutoScript</span>

                  <h2 className="autoscript-title">
                    How to Maximize Your Car’s Resale
                    <br />
                    <span>Value</span>
                  </h2>

                  <p className="autoscript-meta">
                    By Carosa Editorial Team · Published: October 17, 2025 · Reading
                    <br />
                    time: ~8 min
                  </p>
                </div>

              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= BLOG PAGE SECTION ================= */}
      <Container className="my-4">
        <Row>

          {/* LEFT SIDEBAR */}
          <Col lg={3} md={4} style={{ marginTop: "80px" }}>
            <div className="autoscript-sidebar">

              {/* SEARCH */}
              <div className="sidebar-card">
                <h6 className="sidebar-title">Search AutoScript</h6>
                <div className="search-box">
                  <input type="text" placeholder="Search article..." />
                  <button>Search</button>
                </div>
              </div>

              {/* RELATED POSTS */}
              <div className="sidebar-card">
                <h6 className="sidebar-title gradient-text">Related Posts</h6>

                <div className="related-card active">
                  <img src="/autoscript/auto1.png" alt="" />
                  <div>
                    <p className="post-title">
                      The climate crisis and the environment in Central Asia
                    </p>
                    <div className="post-meta">
                      <span className="author">Joana</span>
                      <span className="chip blue">Elon Musk</span>
                    </div>
                  </div>
                </div>

                <div className="related-card">
                  <img src="/autoscript/auto2.png" alt="" />
                  <div>
                    <p className="post-title">
                      The overlooked benefits of real Christmas trees
                    </p>
                    <div className="post-meta">
                      <span className="author">Rey</span>
                      <span className="chip green">Green</span>
                    </div>
                  </div>
                </div>

                <div className="related-card">
                  <img src="/autoscript/auto2.png" alt="" />
                  <div>
                    <p className="post-title">
                      The overlooked benefits of real Christmas trees
                    </p>
                    <div className="post-meta">
                      <span className="author">Rey</span>
                      <span className="chip green">Green</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK LINKS */}
              <div className="sidebar-card">
                <h6 className="sidebar-title gradient-text">Quick Links</h6>

                <div className="quick-link">
                  <img src="/autoscript/link1.png" alt="" />
                  <span>How Will AI Image Generators Affect Artists?</span>
                </div>

                <div className="quick-link">
                  <img src="/autoscript/link2.png" alt="" />
                  <span>Buying Green: Eco-Friendly Death Care On The Rise</span>
                </div>

                <div className="quick-link">
                  <img src="/autoscript/link2.png" alt="" />
                  <span>Buying Green: Eco-Friendly Death Care On The Rise</span>
                </div>
              </div>

              {/* TAGS */}
              <div className="sidebar-card">
                <h6 className="sidebar-title gradient-text">Tags</h6>
                <div className="tag-wrap">
                  <span className="chip blue">Resale</span>
                  <span className="chip orange">Maintenance</span>
                  <span className="chip green">Docs</span>
                  <span className="chip gray">Photography</span>
                </div>
              </div>

            </div>
          </Col>

          {/* MAIN CONTENT */}
          <Col lg={9} md={8}>
            {/* === BLOG HEADER === */}
            <div className="blog-header">

              <div className="blog-author-row">
                <div className="author-left">
                  <img src="/autoscript/link2.png" alt="" className="author-avatar" />
                  <span className="author-name">Dastgir Carosa</span>
                  <span className="author-star">★</span>
                  <button className="follow-btn">Follow</button>
                </div>
              </div>

              <h1 className="blog-title">
                Elon Musk shows off updates to his brain chips
              </h1>

              <p className="blog-meta">
                PUBLISHED THU, DEC 1 2022 8:09 AM EST
                <span>UPDATED THU, DEC 1 2022 10:36 AM EST</span>
              </p>

              <div className="blog-hero-img">
  <img 
    src="/autoscript/autogreen.jpg" 
    alt="" 
    style={{ 
      height: "300px", 
      width: "100%", 
      objectFit: "cover",
      borderRadius: "12px" 
    }} 
  />
</div>
                <p className="blog-caption">
    Neuralink logo displayed on a phone screen, a silhouette of a paper in shape
    of a human face and a binary code displayed on a screen are seen in this
    multiple exposure illustration photo taken in Krakow, Poland on December
    10, 2021.
  </p>
            </div>

            {/* === BLOG CONTENT === */}
             <h3
  className="section-title"
  style={{ marginTop: "100px" }}
>
  Why resale value matters
</h3>


  <p className="section-desc">
    Whether you plan to sell in months or years, a car’s resale value determines
    how much money you recover and how attractive it is to buyers. Small,
    consistent actions during ownership can increase resale value substantially.
    Below are practical, proven steps to protect and grow the value of your vehicle.
  </p>

  <h4 className="content-heading">
  1. Keep it clean — inside and out
</h4>

  <p className="content-text">
    First impressions matter. A well-maintained exterior and a tidy cabin tell
    buyers the car was cared for. Regularly wash and wax the car, address paint
    chips promptly, and keep the interior free of stains and odors. Consider a
    professional detailing session before listing — clean cars sell faster and
    at higher prices.
  </p>

  <h4 className="content-heading">
    2. Regular maintenance & timely repairs
  </h4>
  <p className="content-text">
    Follow the manufacturer’s service schedule. Replace consumables (brakes,
    tyres, filters) before they become major issues. Keep receipts for repairs —
    buyers appreciate evidence that work was done properly. Preventive maintenance
    protects both the car’s performance and its perceived reliability.
  </p>

  <h4 className="content-heading">
    3. Maintain full documentation
  </h4>
  <p className="content-text">
    Organize service records, insurance papers, warranty documents, and any
    receipts for upgrades or replacements. A complete paperwork folder builds
    trust and removes buyer uncertainty. Where possible, store digital copies
    and be ready to share them during negotiation.
  </p>
 <div className="blog-hero-img">
  <img 
    src="/autoscript/autogreen.jpg" 
    alt="" 
    style={{ 
      height: "300px", 
      width: "100%", 
      objectFit: "cover",
      borderRadius: "12px" 
    }} 
  />
</div>
<h4 className="content-heading " style={{ marginTop: "50px" }}>
  4. Mind the mileage and usage
</h4>
<p className="content-text">
  Lower mileage typically means higher resale value. If you expect to sell
  soon, try to limit unnecessary long trips. For high-mileage vehicles,
  highlight recent major services (timing belts, major fluid changes) to
  reassure buyers about long-term reliability.
</p>

<h4 className="content-heading">
  5. Timing — pick the right moment to sell
</h4>
<p className="content-text">
  Market conditions affect prices. Demand for certain segments (SUVs, compact
  EVs) can fluctuate. Avoid selling during low-demand periods (e.g., heavy
  monsoon months in some regions) and capitalize on tax-year-end or
  festival-season spikes when buyers are actively shopping.
</p>



         <Row className="tip-row">
  <Col md={4}>
    <div className="tip-card">
      <h6 className="tip-title">Tip: Keep records</h6>
      <p className="tip-text">
        Always collect invoices & timestamps for services — they are your proof
        of care.
      </p>
    </div>
  </Col>

  <Col md={4}>
    <div className="tip-card">
      <h6 className="tip-title">Tip: Professional inspection</h6>
      <p className="tip-text">
        Get a pre-sale inspection and share the report to reduce buyer doubts.
      </p>
    </div>
  </Col>

  <Col md={4}>
    <div className="tip-card">
      <h6 className="tip-title">Tip: Clean before photos</h6>
      <p className="tip-text">
        Pay for a valet or detailing before shooting photos and listing the car.
      </p>
    </div>
  </Col>
</Row>


<div className="newsletter-wrap">
  <div className="newsletter-box">
    {/* LEFT TEXT */}
    <div className="newsletter-text">
      <h6>Want weekly seller tips?</h6>
      <p>
        Join AutoScript for hand-picked guides, market updates, and tools.
      </p>
    </div>

    <div className="newsletter-form">
      <input
        type="email"
        placeholder="Your Email Address"
      />
      <button>Subscribe</button>
    </div>
  </div>
</div>

        </Col>
      </Row>
      </Container>



      <section className="fastag-faq-section py-5">
        <div className="container">

          <div className="fastag-faq-header text-center mb-4">
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
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <span className="fastag-faq-question-text">
                    {faq.question}
                  </span>

                  <span className="fastag-faq-icon">
                    {openFaq === index ? "−" : "+"}
                  </span>
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
      </section>
    </>
  );
}






