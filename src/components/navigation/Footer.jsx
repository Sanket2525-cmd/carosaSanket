 "use client";

import Link from "next/link";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";

function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleAppClick = (event) => {
    event.preventDefault();
    setShowComingSoon(true);
  };

  const closeModal = () => setShowComingSoon(false);

  return (
    <footer className="footerMain padding-Y-X">
      <Container fluid>
        <Row className="gy-4">
          {/* COMPANY & LEGAL */}
          <Col md={4}>
            <h5 className="mb-0 pb-2 text-white fSize-7 fw-semibold text-uppercase pb-3">Company & Legal</h5>
            <ul className="list-unstyled m-0 p-0">
              <li><Link href="/our-story" className="text-white text-decoration-none d-block py-1">Our Story</Link></li>
              <li><Link href="/join-our-team" className="text-white text-decoration-none d-block py-1">Join Our Team</Link></li>
              {/* <li><Link href="/media-kit" className="text-white text-decoration-none d-block py-1">Media Kit</Link></li> */}
              {/* <li><Link href="/testimonials" className="text-white text-decoration-none d-block py-1">Testimonials</Link></li> */}
              <li><Link href="/privacy-policy" className="text-white text-decoration-none d-block py-1">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-white text-decoration-none d-block py-1">Terms & Conditions</Link></li>
              <li><Link href="/refund-cancellation-policy" className="text-white text-decoration-none d-block py-1">Refund & Cancellation Policy</Link></li>
            </ul>
          </Col>

          {/* RESOURCES & SUPPORT */}
          <Col md={4}>
            <h5 className="mb-0 pb-2 text-white fSize-7 fw-semibold text-uppercase pb-3">Resources & Support</h5>
            <ul className="list-unstyled m-0 p-0">
              <li><Link href="/autoscript" className="text-white text-decoration-none d-block py-1">AutoScript (Blog & News)</Link></li>
              {/* <li><Link href="/knowledge-hub" className="text-white text-decoration-none d-block py-1">Carosa Knowledge Hub</Link></li> */}
              <li><Link href="/partner-with-us" className="text-white text-decoration-none d-block py-1">Partner With Us</Link></li>
              <li><Link href="/contact-us" className="text-white text-decoration-none d-block py-1">Connect With Us</Link></li>
            </ul>
          </Col>

          {/* LOGO, TEXT & SOCIAL */}
          <Col md={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/images/finalCarosalogo.png " alt="Carosa Logo" width={140} className="rounded-2"/>
            </div>
            <p className=" mb-3 text-white text-wrap">
            At Carosa, we’re redefining the way India buys and sells pre-owned cars.
With technology, trust, and transparency at our core, we make every step — from inspection to delivery — simple, secure, and hassle-free.
            </p>

            <p className="fw-semibold text-white mb-2">Carosa Drive Hub Location</p>

            <p className="fw-semibold text-white mb-2">Social Media</p>
            <ul className="list-unstyled d-flex gap-3 mb-3">
              <li><Link href="https://www.facebook.com/carosaindia" target="_blank"><FaFacebook size={22} color="white" /></Link></li>
              <li><Link href="https://x.com/Carosaindia" target="_blank"><FaXTwitter size={22} color="white" /></Link></li>
              <li><Link href="https://www.instagram.com/carosaindia/" target="_blank"><FaInstagram size={22} color="white" /></Link></li>
              <li><Link href="https://www.youtube.com/@GaadikiGup-Shup" target="_blank"><FaYoutube size={22} color="white" /></Link></li>
              <li><Link href="https://www.linkedin.com/company/carosaindia/" target="_blank"><FaLinkedin size={22} color="white" /></Link></li>
            </ul>

            <div className="d-flex gap-2">
              <button type="button" className="store-trigger-button" onClick={handleAppClick} aria-label="Carosa app on the App Store">
                <img src="/images/appStore.png" width={140} alt="App Store" />
              </button>
              <button type="button" className="store-trigger-button" onClick={handleAppClick} aria-label="Carosa app on Google Play">
                <img src="/images/googlePlay.png" width={140} alt="Google Play Store" />
              </button>
            </div>
          </Col>
        </Row>

        <hr className="border-light opacity-25 my-4" />

        <div className="text-center small text-white">
         © 2025 Carosa, All rights reserved. Design & Developed By <Link href="https://www.technogigz.com/" className="">Technogigz Solutions</Link>
        </div>
      </Container>
      {showComingSoon && (
        <div className="coming-soon-overlay" role="dialog" aria-modal="true">
          <div className="coming-soon-modal">
            <button type="button" className="coming-soon-close" aria-label="Close popup" onClick={closeModal}>
              ×
            </button>
            <p className="coming-soon-eyebrow">Coming Soon</p>
            <h3 className="coming-soon-title">We are almost there!</h3>
            <p className="coming-soon-copy">
              Our team is building something special for you — a smarter and more seamless Carosa experience, now just a tap away.
            </p>
            <button type="button" className="coming-soon-cta" onClick={closeModal}>
              Got it
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
