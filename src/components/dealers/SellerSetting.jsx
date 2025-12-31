"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const SellerSetting = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [openTime, setOpenTime] = useState("10:00 AM");
  const [closeTime, setCloseTime] = useState("06:30 PM");
  const [homeDelivery, setHomeDelivery] = useState("");
  const [deliveryRange, setDeliveryRange] = useState("2 KMs");
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'
  ];
  const deliveryRanges = ['2 KMs', '5 KMs', '10 KMs', 'Within City', 'Outside City'];
  const paymentModes = ['Cash', 'Bank Account', 'Card', 'Cheque', 'UPI', 'All'];

  const handleDayChange = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handlePaymentModeChange = (mode) => {
    setSelectedPaymentModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const handleSaveSettings = () => {
    // Handle save settings logic
    console.log('Settings saved:', {
      selectedDays,
      openTime,
      closeTime,
      homeDelivery,
      deliveryRange,
      selectedPaymentModes
    });
  };

  return (
    <div className="dashboard-content">
      {/* Header Section */}
         <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
            Seller Setting
          </h2>
        </div>
      </div>

      {/* Business Timing Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="dealers-card p-4">
            <h3 className="fs-5 fw-bold seller-title mb-4">Business Timing</h3>
            
            <div className="seller-section">
              <p className="seller-section-title mb-2">Available Days:</p>
              <Row className="g-2">
                {days.map((day, index) => (
                  <Col xs={6} md={4} key={index}>
                    <Form.Check
                      type="checkbox"
                      id={`day-${index}`}
                      label={day}
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="seller-checkbox"
                    />
                  </Col>
                ))}
              </Row>
              
              <Row className="g-4">
                <Col md={6}>
                  <div className="seller-field">
                    <label className="seller-label">Open Time</label>
                    <Form.Select 
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="seller-select"
                    >
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="seller-field">
                    <label className="seller-label">Close Time</label>
                    <Form.Select 
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="seller-select"
                    >
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Home Delivery Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="dealers-card p-4">
            <h3 className="fs-5 fw-bold seller-title mb-4">Home Delivery</h3>
            
            <div className="seller-section">
              <p className="seller-section-title mb-1">Do you offer home delivery?</p>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="delivery-yes"
                  name="homeDelivery"
                  label="Yes"
                  value="yes"
                  checked={homeDelivery === "yes"}
                  onChange={(e) => setHomeDelivery(e.target.value)}
                  className="seller-radio"
                />
                <Form.Check
                  type="radio"
                  id="delivery-no"
                  name="homeDelivery"
                  label="No"
                  value="no"
                  checked={homeDelivery === "no"}
                  onChange={(e) => setHomeDelivery(e.target.value)}
                  className="seller-radio"
                />
              </div>
              
              {homeDelivery === "yes" && (
                <div className="seller-field mt-3">
                  <label className="seller-label">Delivery Range</label>
                  <Form.Select 
                    value={deliveryRange}
                    onChange={(e) => setDeliveryRange(e.target.value)}
                    className="seller-select"
                  >
                    {deliveryRanges.map((range, index) => (
                      <option key={index} value={range}>{range}</option>
                    ))}
                  </Form.Select>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Payment Mode Card */}
      <Row className="mb-4">
        <Col lg={12}>
          <div className="dealers-card p-4">
            <h3 className="fs-5 fw-bold seller-title mb-4">Payment Mode</h3>
            
            <div className="seller-section">
              <Row className="g-2">
                {paymentModes.map((mode, index) => (
                  <Col xs={6} md={4} key={index}>
                    <Form.Check
                      type="checkbox"
                      id={`payment-${index}`}
                      label={mode}
                      checked={selectedPaymentModes.includes(mode)}
                      onChange={() => handlePaymentModeChange(mode)}
                      className="seller-checkbox"
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Save Changes Button */}
      <Row>
        <Col lg={12} className="text-center">
          <Button 
            className="seller-save-btn"
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SellerSetting;
