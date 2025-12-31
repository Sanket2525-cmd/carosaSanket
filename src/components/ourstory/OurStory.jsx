"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/homebanner.css";

function OurStory() {
    return (
        <div className="ourstory-page">

            {/* ========== Banner Section ========== */}
            <section className="banner_story position-relative">
                <img src="/images/bannerourstory.png" alt="Carosa Banner" className="banner_st img-fluid" />
                <div className="content-wrap pe-0">
                    <div className="content" style={{ maxWidth: "100%" }}>
                        <h1 className="title text-white">Carosa - Confidence on Wheels</h1>
                        <p className="sub text-white-50">Welcome to Carosa</p>
                        <div className="d-flex align-items-center gap-sm-5 gap-3 ">
                            <a
                                className="fSize-5 fw-bold w-auto buyBtn sell-button bg-white text-decoration-none px-4 py-2 rounded-3"
                                href="#our-story"
                                style={{ color: "#2A3A92" }}
                            >
                                Explore Our Journey
                                <img alt="arrow" width="14" className="ms-2" src="/images/arrowRight.png" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== OUR STORY Section ========== */}
            <section id="our-story" className="story-section padding-Y-X">
                <Container fluid>
                    <Row className="pt-4">
                        <Col lg={6} className="text-white mb-md-0 mb-4">
                            <h2 className="fw-bold mb-3 text-white">OUR STORY</h2>
                            <p className="fSize-5">
                                At Carosa, we’re redefining how India buys and sells pre-owned vehicles.

                                We are not just another automotive platform — we are a mission-driven company built to bring trust, transparency, and technology into the heart of India’s used car ecosystem.
                                We started our journey with a simple question:


                            </p>
                            <p className="fSize-5">
                                Why is buying or selling a used car still so difficult in India?
                                Unorganized dealers, inconsistent valuations, unclear vehicle conditions, and hidden paperwork have made the experience confusing and unreliable for millions.
                                We knew there had to be a better way — a way built on honesty, technology, and understanding.
                                That’s where Carosa was born — a name inspired by two words: Car + Bharosa.
                                Because in everything we do, trust is our engine.
                            </p>
                            {/* <div className="d-flex align-items-center gap-sm-5 gap-3 pt-4">
                                <a
                                    className="fSize-5 fw-bold w-auto buyBtn sell-button bg-white text-decoration-none px-4 py-2 rounded-3"
                                    href="#our-story"
                                    style={{ color: "#2A3A92" }}
                                >
                                    Ask Him
                                    <img alt="arrow" width="14" className="ms-2" src="/images/arrowRight.png" />
                                </a>
                            </div> */}

                        </Col>
                        <Col lg={6}>
                            <img
                                src="/images/ourstoruabout.png"
                                alt="Our Story"
                                className="img-fluid"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ========== BUILT FROM THE GROUND UP ========== */}
            <section className="built-section py-5  padding-Y-X mb-4">
                <Container fluid>
                    <Row className=" shadow p-md-5 p-2 rounded-4 bg-white">
                        <Col lg={8}>
                            <h3 className="fw-bold text-dark mb-3">BUILT FROM THE GROUND UP</h3>
                            <p className="fSize-5">
                                Our team has over 45 years of experience in automotive sales, financing, service, and technology. We started from scratch, engaging with customers and learning the real challenges that drive transactions. We've seen the market evolve from unorganized dealers to digital platforms, gaining insights into buyer and seller psychology. Carosa is built for the people who make the market.
                            </p>
                        </Col>
                        <Col lg={4}>
                            <img src="/images/careee.png" alt="Built From The Ground Up" className="img-fluid w-100 rounded-4 " />
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="built-section rowChildselet pt-5  padding-Y-X ">
                <Container >
                    <Row className="  ">
                        <Col lg={4} md={6} className="mb-md-2 mb-5">
                            <div className="card_story position-relative h-100">
                                <div className="pos_cicle">
                                    <div className="topCircle">
                                        <img src="/images/roundedicon.png" alt="" />
                                    </div>
                                </div>
                                <h4 className="text-center fw-bold text-white py-3">Our Vision</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">To transform the used car industry in India into a trusted, transparent, and technology-driven ecosystem where every buyer and seller can transact with complete confidence — regardless of their city, experience, or background.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} md={6} className="mb-md-2 mb-5">
                            <div className="card_story position-relative h-100">
                                <div className="pos_cicle">
                                    <div className="topCircle">
                                        <img src="/images/roundedicon.png" alt="" />
                                    </div>
                                </div>
                                <h4 className="text-center fw-bold text-white py-3">Our Mission</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">Create a seamless platform for the car journey — from inspection to delivery — ensuring a reliable experience. We make trust measurable and technology accessible, so every car sold is a symbol of confidence.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} md={6} className="mb-md-3 ">
                            <div className="card_story position-relative h-100">
                                <div className="pos_cicle">
                                    <div className="topCircle">
                                        <img src="/images/roundedicon.png" alt="" />
                                    </div>
                                </div>
                                <h4 className="text-center fw-bold text-white py-3">Our Core Values</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">At the core of Carosa lies our unwavering belief in the 3Ts: Trust, Transparency, and Technology.
                                        These three pillars form the foundation of our brand — guiding how we think, act, and serve our customers.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="pt-5">
                        <Col xs={12}>
                            <h3 className="centerTitle fw-bold text-dark mb-3 text-center">Our Core Values — The 3Ts of Carosa</h3>
                        </Col>
                        <Col xs={12} className="mt-4">
                            <div className="wrapper_steps">
                                <h4 className="text-center fw-bold text-white pb-3">1. Trust — The Foundation of Every Relationship</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">Trust is the foundation of every meaningful relationship — and it’s the soul of Carosa.
                                        In a market often filled with uncertainty, we make trust our strongest currency.
                                        Every car that comes to Carosa undergoes a rigorous verification and inspection process.
                                        We ensure authenticity, honesty, and fairness in every listing — because we believe that Bharosa cannot be demanded; it must be earned.
                                        Every interaction, every commitment, and every delivery we make is built around trust.
                                        For us, it’s not about selling cars; it’s about creating lifelong relationships.</p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} className="mt-4">
                            <div className="wrapper_steps2">
                                <h4 className="text-center fw-bold text-white pb-3">2. Transparency — The Power of Clarity</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">Transparency turns confusion into confidence.
                                        At Carosa, we believe in giving customers complete clarity — because when you know everything, you can make the right decision.
                                        We provide:</p>
                                    <ul className="text-white">
                                        <li style={{ listStyle: "disc !important;" }}><p> Complete car inspection and history reports
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Verified ownership and challan checks
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Data-backed, fair pricing and valuation
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Transparent documentation and process flow</p></li>
                                    </ul>

                                    <p className="fw-normal text-white">Every step of the Carosa journey is open, visible, and verifiable.
                                        We make sure that both buyer and seller know exactly what they’re getting — no hidden charges, no hidden facts, and no fine print.
                                        Because clarity creates confidence, and confidence builds trust.</p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} className="mt-4">
                            <div className="wrapper_steps3">
                                <h4 className="text-center fw-bold text-white pb-3">3. Technology — The Engine That Drives Progress</h4>
                                <div className="card_body_story p-3">
                                    <p className="fw-normal text-white">Technology is the bridge between trust and transparency.
                                        It’s how we turn our promise into a practical, reliable system.
                                        At Carosa, we leverage technology to create a smart, scalable, and user-friendly ecosystem:</p>
                                    <ul className="text-white">
                                        <li style={{ listStyle: "disc !important;" }}><p> AI-powered valuations for fair and instant pricing
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Smart matchmaking algorithms that connect buyers and sellers faster
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Digital documentation and challan systems to reduce human error
                                        </p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Real-time customer support and analytics to ensure seamless experience</p></li>
                                        <li style={{ listStyle: "disc !important;" }}><p>
                                            Carosa Drive Hubs where customers can inspect, test-drive, and finalize their deals easily</p></li>
                                    </ul>

                                    <p className="fw-normal text-white">But technology, for us, is not about replacing human connection — it’s about enhancing it.
                                        It ensures accuracy, consistency, and simplicity — so that trust is never compromised.
                                        We believe technology is not just a tool — it’s the engine that drives progress, empowering millions to make informed, confident decisions.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="built-section py-5  padding-Y-X ">
                <Container fluid>
                    <Row className=" shadow p-md-5 p-2 rounded-4 bg-white">
                        <Col lg={8}>
                            <h3 className="fw-bold text-dark mb-3">Driven by Experience. Grounded by Values.</h3>
                            <p className="fSize-5">
                                Our team’s 45+ years of combined experience is not just a number — it’s a story of persistence, learning, and passion.
                                We’ve worked from the ground level — inspecting cars, meeting customers, solving real-world issues, and building a system that truly understands India’s used car market.

                            </p>
                            <p className="fSize-5">We know what it feels like to be a buyer who fears being misled or a seller who feels undervalued.
                                That’s why we built Carosa — to bring trust where there was doubt, structure where there was chaos, and technology where there was confusion.</p>
                        </Col>
                        <Col lg={4}>
                            <img src="/images/secon3.png" alt="Built From The Ground Up" className="img-fluid w-100 rounded-4 " />
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="built-section py-5  padding-Y-X ">
                <Container fluid>
                    <Row className=" shadow p-md-5 p-2 rounded-4 bg-white">
                        <div className="col-12">
                            <h3 className="fw-bold text-dark mb-3">The Carosa Ecosystem</h3>
                            <p className="fSize-5">
                                Carosa is not just a platform — it’s a complete ecosystem that connects every part of the pre-owned car journey under one trusted roof.
                                Every transaction we facilitate revolves around three key pillars:

                            </p>
                        </div>
                        <Col lg={8}>
                            <Row>
                                <Col md={4} className="mb-4">
                                    <div class="cardMain min_cardMain bg_skynew p-3 d-flex flex-column align-items-center justify-content-center text-center h-100 rounded-3 ">
                                        <img alt="Best Price Assurance" class="pb-3" src="/images/storyuser.png" />
                                        <p class="m-0 fSize-4 fw-semibold text-wrap">1. The Buyer & Seller</p>
                                        <span class="fSize-3 fw-normal span__card__inner">People who deserve a fair, transparent, and convenient experience.</span>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div class="cardMain min_cardMain bg_skynew p-3 d-flex flex-column align-items-center justify-content-center text-center h-100 rounded-3 ">
                                        <img alt="Best Price Assurance" class="pb-3" src="/images/storyuser2.png" />
                                        <p class="m-0 fSize-4 fw-semibold text-wrap">2. The Carosa Platform</p>
                                        <span class="fSize-3 fw-normal span__card__inner">A digital marketplace for verified listings, pricing, and end-to-end services.</span>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div class="cardMain min_cardMain bg_skynew p-3 d-flex flex-column align-items-center justify-content-center text-center h-100 rounded-3 ">
                                        <img alt="Best Price Assurance" class="pb-3" src="/images/locat.png" />
                                        <p class="m-0 fSize-4 fw-semibold text-wrap">3. The Carosa Drive Hubr</p>
                                        <span class="fSize-3 fw-normal span__card__inner">Our physical centers for car inspection, test drives, paperwork, and delivery.</span>
                                    </div>
                                </Col>
                            </Row>
                            <p className="fSize-5">Carosa is not just a platform — it’s a complete ecosystem that connects every part of the pre-owned car journey under one trusted roof.
                                Every transaction we facilitate revolves around three key pillars:</p>
                        </Col>
                        <Col lg={4}>
                            <img src="/images/story5.png" alt="Built From The Ground Up" className="img-fluid w-100 rounded-4 " />
                        </Col>


                    </Row>
                </Container>
            </section>

            <section className="built-section py-5  padding-Y-X ">
                <Container fluid>
                    <Row className=" shadow p-md-5 p-2 rounded-4 bg-white justify-content-center">
                        <Col lg={12}>
                            <h3 className="fw-bold text-dark mb-3">Our Future Vision — Building India’s Most Trusted Used Car Ecosystem</h3>
                            <p className="fSize-5">
                                Our future goal is ambitious yet simple:
                                to bring every single used car transaction in India through Carosa.
                                We are building a complete ecosystem — where every stage of the process is integrated, reliable, and tech-enabled:

                            </p>

                        </Col>
                        <Col lg={7} className="py-3">
                            <img src="/images/carosastory.png" alt="Built From The Ground Up" className="img-fluid w-100 rounded-4 " />
                        </Col>
                        <Col lg={12}>

                            <p className="fSize-5">
                                From the moment a customer thinks of selling their car — to the moment another customer drives it away — Carosa will handle everything.

                            </p>
                            <p className="fSize-5">
                                Our vision is to make the platform so accessible that anyone, even from the smallest towns and cities in India, can buy or sell a car confidently through Carosa.

                            </p>
                            <p className="fSize-5">
                                We’re building a future where every Indian car journey passes through Carosa — safely, transparently, and efficiently.

                            </p>
                            <p className="fSize-5">
                                Because every drive begins with Trust, runs on Transparency, and is powered by Technology. 🚘💙

                            </p>
                            <p className="fSize-5">
                                With a passionate team of automobile experts, tech innovators, and customer service professionals, we are not just another marketplace — we are a new standard for how used cars are bought and sold in India.

                            </p>
                            <p className="fSize-5">
                                Carosa is here to ensure that your journey — from your first search to your first drive — is effortless, secure, and truly satisfying.

                            </p>

                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default OurStory;
