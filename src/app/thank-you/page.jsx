"use client";

import React from "react";
import { Container } from "react-bootstrap";
import "../../styles/homebanner.css";


export default function ThankYouPage() {
  return (
    <div className="thankyou-wrapper">
      <Container>
        <div className="thankyou-card">
          <div className="check-icon">✔</div>

          <h1 className="thank-title">Thank You!</h1>

          <p className="thank-sub">We’ve received your details successfully.</p>

          <p className="thank-info">
            Our Carosa Expert will contact you shortly to assist with your
            request. Meanwhile, feel free to explore more services.
          </p>

          <a href="/" className="thank-btn">
            Back to Home
          </a>
        </div>
      </Container>
    </div>
  );
}
