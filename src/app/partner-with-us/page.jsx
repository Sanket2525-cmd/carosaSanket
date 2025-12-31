"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import '../../styles/homebanner.css';

export default function PartnerWithUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    partnership_type: '',
    city: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Partnership request submitted:', formData);
    // You can add API call here
  };

  return (
    <div className="partner-with-us-page">
      {/* Hero Section */}
      <header className="partner-header">
        <Container>
          <h1>Partner With Carosa</h1>
          <p className="mx-auto">Join India's most transparent and technology-driven used automobile platform.  
          Let's grow together — driving trust, innovation, and customer happiness across the country.</p>
        </Container>
      </header>

      {/* Why Partner Section */}
      <Container className="my-5">
        <section className="partner-with-us-section text-center">
          <h2 className="mb-4">Why Partner With Us?</h2>
          <p className="mx-auto mb-5" style={{ maxWidth: '750px' }}>
            Carosa collaborates with dealers, garages, finance companies, RTO service providers, and other automotive partners to create a seamless pre-owned vehicle ecosystem.  
            As our partner, you gain access to a network built on technology, transparency, and growth opportunities.
          </p>

          <Row className="g-4">
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="partner-card h-100">
                <Card.Body className="text-center">
                  <span className="partner-icon">🤝</span>
                  <h3>Grow Your Business</h3>
                  <p>Reach thousands of verified buyers and sellers every month through Carosa's digital platform.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="partner-card h-100">
                <Card.Body className="text-center">
                  <span className="partner-icon">🚗</span>
                  <h3>Trusted Vehicle Ecosystem</h3>
                  <p>Work with certified cars, verified dealers, and trusted service networks across India.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="partner-card h-100">
                <Card.Body className="text-center">
                  <span className="partner-icon">💰</span>
                  <h3>Better Margins</h3>
                  <p>Enjoy higher margins and faster sales through efficient digital operations and lead management.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="partner-card h-100">
                <Card.Body className="text-center">
                  <span className="partner-icon">📊</span>
                  <h3>Data & Insights</h3>
                  <p>Access real-time analytics, performance insights, and customer trends to optimize your sales strategy.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Partner Form */}
      <Container>
        <section className="partner-form-section">
          <h2 className="text-center mb-3">Let's Build Something Great Together</h2>
          <p className="text-center mb-4">Fill out the form below, and our partnership team will get in touch with you shortly.</p>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="Company / Business Name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Select
                    name="partnership_type"
                    value={formData.partnership_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Partnership Type</option>
                    <option value="Used Car Dealer">Used Car Dealer</option>
                    <option value="Workshop / Service Partner">Workshop / Service Partner</option>
                    <option value="Finance Partner">Finance Partner</option>
                    <option value="Insurance Partner">Insurance Partner</option>
                    <option value="RTO Service Provider">RTO Service Provider</option>
                    <option value="Driving School">Driving School</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="City / Location"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Tell us a bit about your business..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Button type="submit" variant="primary" className="w-100 partner-submit-btn">
                  Submit Partnership Request
                </Button>
              </Col>
            </Row>
          </Form>
        </section>
      </Container>
    </div>
  );
}
