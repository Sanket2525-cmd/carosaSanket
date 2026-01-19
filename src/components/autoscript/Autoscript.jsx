

"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import "../../styles/autoscript.css";

/* ================= FEATURED CARD SLIDER DATA ================= */
const cards = [
  {
    image: "/autoscript/car.png",
    title: "Top 5 Cars Under ₹5 Lakh to Buy in 2025",
    desc:
      "Get the best value-for-money picks, complete with expert inspection insights.",
  },
  {
    image: "/images/car.png",
    title: "Best Cars for First-Time Buyers in India",
    desc:
      "A complete guide to choosing reliable and budget-friendly cars.",
  },
  {
    image: "/autoscript/car2.png",
    title: "Upcoming Cars to Watch in 2025",
    desc:
      "All the exciting launches coming this year.",
  },
];

/* ================= LATEST POSTS DATA ================= */
const posts = [
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
  { car: "/images/car.png", avatar: "/autoscript/avatars.png" },
];

/* ================= EXPLORE TOPICS DATA ================= */
const topics = [
  {
    title: "Buying Guides",
    desc: "Car with magnifying glass\nTips to choose the perfect used car and negotiate better.",
  },
  {
    title: "Selling Guides",
    desc: "Handing over car keys\nStep-by-step guides to get the best value for your car.",
  },
  {
    title: "Car Maintenance & Safety",
    desc: "Wrench + Shield\nKeep your car running smoothly and safely.",
  },
  {
    title: "Insurance & Finance",
    desc: "Document + Money\nUnderstand insurance, loans, and financial options.",
  },
  {
    title: "Vehicle Verification & Legal Info",
    desc: "Document + Checkmark\nCheck ownership, RC transfer, and legal details.",
  },
  {
    title: "Industry Insights & Trends",
    desc: "Graph / Car market trend\nStay updated with the latest auto trends.",
  },
];

/* ================= FEATURED ARTICLES DATA ================= */
const articles = [
  { img: "/images/car.png" },
  { img: "/autoscript/car.png" },
  { img: "/autoscript/car2.png" },
];


const tools = [
  {
    title: "Car Valuation Tool",
    desc: "Input make, model, year, mileage → get estimated value",
    btn: "Try Valuation",
  },
  {
    title: "Loan EMI Calculator",
    desc: "Calculate monthly payments for used car loans",
    btn: "Open EMI Calculator",
  },
  {
    title: "Insurance Quote Checker",
    desc: "Get instant insurance options",
    btn: "Check Insurance",
  },
];

const faqs = [
  {
    question: "How do I sell my car quickly?",
    answer:
      "To sell your car quickly, keep documents ready, price it competitively, and use a trusted platform with verified buyers."
  },
  {
    question: "What documents are needed for RC transfer?",
    answer:
      "You need RC, Form 29 & 30, valid insurance, PUC, ID proof, address proof, and loan NOC if applicable."
  },
  {
    question: "Which warranty options should I choose?",
    answer:
      "Choose warranties that cover major engine and transmission components, especially for used cars."
  },
  {
    question: "How can I verify a car’s ownership history?",
    answer:
      "Ownership history can be verified using the vehicle registration number from trusted RTO-based platforms."
  },
];


function Autoscript() {
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);


  /* 🔁 Auto slide every 2 sec (ONLY FEATURED CARD) */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ourstory-page">

      {/* ================= AUTOSCRIPT BANNER ================= */}
      <section className="autoscript-hero">
        <Container fluid className="px-lg-5">

          <Row className="align-items-center mb-4">
            <Col lg={7}>
              <h1 className="autoscript-title">Stay Ahead with AutoScript</h1>

              <p className="autoscript-desc">
                Latest updates, car reviews, ownership tips, and industry insights —
                everything you need to drive smarter with Carosa.
              </p>

              <div className="autoscript-buttons">
                <button className="btn-read">Read Latest Post</button>
                <button className="btn-subscribe">Subscribe to AutoScript</button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={9}>
              <div className="autoscript-featured-card autoscript-fade">
                <div className="featured-img">
                  <img
                    src={cards[active].image}
                    alt="Featured Story"
                    className="img-fluid"
                  />
                </div>

                <div className="featured-content">
                  <span className="featured-label">Featured Story</span>
                  <h3>“{cards[active].title}”</h3>
                  <p>{cards[active].desc}</p>
                  <button className="btn-read-more">Read More</button>
                </div>
              </div>
            </Col>
          </Row>

          <div className="autoscript-slider-dots">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`dot ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
              ></span>
            ))}
          </div>

        </Container>
      </section>

      {/* ================= LATEST POSTS ================= */}
      <section className="latest-posts-section">
        <Container>
          <div className="post-tabs">
            {[
              "Buying Guides",
              "Selling Tips",
              "Ownership & Maintenance",
              "Auto Industry News",
              "Car Reviews",
              "Carosa Updates",
            ].map((item, i) => (
              <span key={i} className="post-pill">{item}</span>
            ))}
          </div>

          <div className="posts-header">
            <h2>Latest Posts</h2>
            <button className="filter-btn">Recently ⌄</button>
          </div>

          <Row className="g-4">
            {posts.map((post, i) => (
              <Col xl={3} lg={4} md={6} key={i}>
                <div className="post-card">
                  <Image
                    src={post.car}
                    alt="Car Post"
                    width={400}
                    height={250}
                    className="post-img"
                  />

                  <div className="post-body">
                    <h5>
                      How to Maximize Your Car’s Resale Value
                      <span className="arrow">↗</span>
                    </h5>

                    <p>
                      Learn expert-backed tips to boost your car’s resale by up to 20%.
                    </p>

                    <div className="post-author">
                      <Image
                        src={post.avatar}
                        alt="author"
                        width={26}
                        height={26}
                        className="avatar"
                      />
                      <div>
                        <strong>Olivia Rhye</strong>
                        <span>20 Jan 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= EXPLORE TOPICS ================= */}
      <section className="explore-topics-section">
        <Container>
          <h2 className="explore-title">Explore Topics</h2>
          <Row className="g-3">
            {topics.map((item, i) => (
              <Col xl={2} lg={4} md={6} key={i}>
                <div className="topic-card">
                  <h6>{item.title}</h6>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= FEATURED ARTICLES ================= */}
      <section className="featured-articles-section">
        <Container>
          <h2 className="featured-title">Featured Articles</h2>

          <Row className="g-3">
            {articles.map((item, i) => (
              <Col lg={4} md={6} key={i}>
                <div className="featured-card-horizontal">

                  <div className="featured-left-img">
                    <Image
                      src={item.img}
                      alt="article"
                      width={160}
                      height={120}
                      className="featured-img"
                    />
                  </div>

                  <div className="featured-right-content">
                    <h5 className="featured-heading">
                      How to Maximize Your Car’s Resale Value
                      <span className="arrow">↗</span>
                    </h5>

                    <p className="featured-desc">
                      Learn expert-backed tips to boost your car’s resale by up to 20%.
                    </p>

                    <div className="featured-author">
                      <Image
                        src="/images/avatar.jpg"
                        alt="author"
                        width={24}
                        height={24}
                        className="avatar"
                      />
                      <div>
                        <strong>Olivia Rhye</strong>
                        <span>20 Jan 2022</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>


      <section className="decision-tools-light">
      <Container>

        {/* Heading + Illustration */}
        <div className="decision-header">
        <h2 className="decision-title">Tools to Make Decisions Easier</h2>

          
        </div>

        {/* Cards */}
        <Row className="g-4 justify-content-center decision-cards">
          {tools.map((item, i) => (
            <Col lg={4} md={6} key={i}>
              <div className="decision-card">
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
                <button className="decision-btn">{item.btn}</button>
              </div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>



{/* ================= FAQ SECTION ================= */}
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
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
          >
            <span className="fastag-faq-question-text">
              {faq.question}
            </span>

            {/* ✅ SAFE + / - */}
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

    </div>
  );
}

export default Autoscript;
