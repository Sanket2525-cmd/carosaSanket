"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import '../../styles/homebanner.css';

export default function JoinOurTeamPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    department: '',
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
    console.log('Application submitted:', formData);
    // You can add API call here
  };

  const handleJobApply = (jobTitle) => {
    // Handle job application click
    console.log('Applying for:', jobTitle);
    // You can scroll to form or pre-fill job title
  };

  return (
    <div className="join-team-page">
      {/* Hero */}
      <header className="join-team-header">
        <Container>
          <h1>Join Our Team</h1>
          <p>Shape the future of pre-owned mobility with Carosa — where passion meets purpose, and innovation drives everything we do.</p>
        </Container>
      </header>

      {/* About */}
      <Container>
        <section className="join-team-about">
          <h2>Why Work With Carosa?</h2>
          <p>At Carosa, we're redefining India's pre-owned automobile market with technology, trust, and transparency.  
          We believe great companies are built by great people — and every individual here contributes directly to our mission of making car ownership simple, secure, and satisfying.</p>
        </section>
      </Container>

      {/* Values */}
      <Container>
        <section className="join-team-values">
          <h2>Our Core Values</h2>
          <Row className="value-grid">
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="value-card">
                <Card.Body>
                  <span>🚀</span>
                  <h3>Innovation First</h3>
                  <p>We embrace creativity and forward-thinking to build smarter mobility solutions.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="value-card">
                <Card.Body>
                  <span>🤝</span>
                  <h3>Trust & Transparency</h3>
                  <p>We deliver honesty, clarity, and confidence in every interaction — with customers and teammates alike.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="value-card">
                <Card.Body>
                  <span>🌱</span>
                  <h3>Continuous Growth</h3>
                  <p>We encourage upskilling and ownership so every team member can grow both personally and professionally.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="value-card">
                <Card.Body>
                  <span>💡</span>
                  <h3>Customer Obsession</h3>
                  <p>Every idea, process, and innovation is designed with one goal — customer delight.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Benefits */}
      <section className="join-team-benefits">
        <Container>
          <h2>Benefits & Perks</h2>
          <Row className="benefit-list">
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>🏠 Flexible Work Setup</h3>
                  <p>Hybrid work model with flexibility to manage your schedule.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>📈 Career Growth</h3>
                  <p>Fast-track your career with mentorship from industry leaders.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>🎓 Upskilling Support</h3>
                  <p>Access learning programs, certifications, and leadership workshops.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>🚘 Employee Vehicle Benefits</h3>
                  <p>Special pricing, inspection perks, and test drive privileges.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>💬 Open Culture</h3>
                  <p>Flat hierarchy, transparent communication, and collaborative decision-making.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} className='mb-4'>
              <Card className="benefit">
                <Card.Body>
                  <h3>🎉 Team Events</h3>
                  <p>Monthly celebrations, off-sites, and recognition programs.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Process */}
      <Container>
        <section className="join-team-process py-5">
          <h2>Our Hiring Process</h2>
          <Row className="steps">
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className="step">
                <Card.Body>
                  <span>📄</span>
                  <h4>1. Apply Online</h4>
                  <p>Submit your details or upload your resume via our form.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className="step">
                <Card.Body>
                  <span>📞</span>
                  <h4>2. HR Discussion</h4>
                  <p>Our HR team connects to understand your goals and experience.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className="step">
                <Card.Body>
                  <span>🧠</span>
                  <h4>3. Skill Assessment</h4>
                  <p>Depending on your role, you'll complete a short test or task.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className="step">
                <Card.Body>
                  <span>🤝</span>
                  <h4>4. Final Interview</h4>
                  <p>Meet our leadership team for a final discussion and alignment.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4} className='mb-4'>
              <Card className="step">
                <Card.Body>
                  <span>🎉</span>
                  <h4>5. Offer & Onboarding</h4>
                  <p>Welcome to Carosa! Your journey begins with structured onboarding.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Roles */}
      <Container>
        <section className="join-team-roles">
          <h2>Current Openings</h2>
          <Card className="job">
            <Card.Body>
              <h3>Business Development Executive</h3>
              <p>Location: Delhi NCR | Experience: 1–3 years</p>
              <p>Drive partnerships and sales for pre-owned vehicles while managing client relationships.</p>
              <Button 
                variant="primary" 
                className="job-apply-btn"
                onClick={() => handleJobApply('Business Development Executive')}
              >
                Apply Now
              </Button>
            </Card.Body>
          </Card>

          <Card className="job">
            <Card.Body>
              <h3>Digital Marketing Specialist</h3>
              <p>Location: Noida | Experience: 2–4 years</p>
              <p>Plan and execute campaigns, manage SEO/SEM, and grow Carosa's digital presence.</p>
              <Button 
                variant="primary" 
                className="job-apply-btn"
                onClick={() => handleJobApply('Digital Marketing Specialist')}
              >
                Apply Now
              </Button>
            </Card.Body>
          </Card>

          <Card className="job">
            <Card.Body>
              <h3>Vehicle Inspection Expert</h3>
              <p>Location: Delhi / Gurugram | Experience: 1–3 years</p>
              <p>Inspect and certify cars for quality and authenticity before onboarding.</p>
              <Button 
                variant="primary" 
                className="job-apply-btn"
                onClick={() => handleJobApply('Vehicle Inspection Expert')}
              >
                Apply Now
              </Button>
            </Card.Body>
          </Card>

          <Card className="job">
            <Card.Body>
              <h3>Customer Relationship Manager</h3>
              <p>Location: Hybrid | Experience: 2+ years</p>
              <p>Build trust with customers and ensure smooth post-purchase experience.</p>
              <Button 
                variant="primary" 
                className="job-apply-btn"
                onClick={() => handleJobApply('Customer Relationship Manager')}
              >
                Apply Now
              </Button>
            </Card.Body>
          </Card>
        </section>
      </Container>

      {/* Application Form */}
      <Container>
        <section className="join-team-apply mb-5">
          <h2>Didn't Find Your Role?</h2>
          <p>We're always open to meeting passionate professionals. Share your details below — we'll reach out when a suitable position opens.</p>

          <Form onSubmit={handleSubmit}>
            <Row className='justify-content-end'>
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
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Current City"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3">
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Preferred Department</option>
                    <option value="Business Development">Business Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technology">Technology</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    placeholder="Tell us about yourself and why you'd like to join Carosa..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Button type="submit" variant="primary" className="w-100 ">
                  Submit Application
                </Button>
              </Col>
            </Row>
          </Form>
        </section>
      </Container>
    </div>
  );
}