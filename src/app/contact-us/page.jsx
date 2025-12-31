"use client";

import React, { useState } from 'react';
import '../../styles/homebanner.css';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    console.log('Form submitted:', formData);
    // You can add API call here
  };

  return (
    <div className="contact-us-page">
      <header className="contact-header">
        <h1>Contact Carosa</h1>
        <p>Your trusted partner in India's pre-owned automobile journey 🚗✨</p>
      </header>

      <section className="contact-container">
        {/* Corporate Office */}
        <div className="contact-card">
          <h2>Corporate Office</h2>
          <div className="info-item">
            <span>📍</span>
            <div>
              <p><strong>Carosa Corporate Headquarters</strong></p>
              <p>H-161, B-03 BSI Business Park,<br />
              Sector 63 Rd, H-Block Sector 63,<br />
              Noida, Uttar Pradesh 201301</p>
            </div>
          </div>

          <div className="info-item">
            <span>📞</span>
            <div>
              <p><strong>Phone:</strong><br /> +91-93555-30033</p>
            </div>
          </div>

          <div className="info-item">
            <span>✉️</span>
            <div>
              <p><strong>Email:</strong><br /> support@carosa.in</p>
            </div>
          </div>

          <div className="info-item">
            <span>⏰</span>
            <div>
              <p><strong>Business Hours:</strong><br /> Monday – Saturday: 10 AM – 7 PM</p>
            </div>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.6086629537783!2d77.38349547459663!3d28.62474048458292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5ae4b7f1d4f%3A0xa2b23ce6a1f0b285!2sBSI%20Business%20Park%2C%20H%20Block%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1731436933000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            title="Carosa Corporate Office Location"
          />
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h2>We'd Love to Hear From You</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit Message</button>
          </form>
        </div>
      </section>

    </div>
  );
}
