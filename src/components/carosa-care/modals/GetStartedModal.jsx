"use client";

import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import "../../../styles/carosacare.css";

const GetStartedModal = ({ show, onHide, onGetOtp, phoneNumber, setPhoneNumber }) => {
  const handleGetOtp = () => {
    if (phoneNumber && phoneNumber.length === 10) {
      onGetOtp();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      className="fastag-modal"
      dialogClassName="fastag-modal-dialog"
    >
      <Modal.Body className="fastag-modal-body">
        <button
          className="fastag-modal-close"
          onClick={onHide}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="fastag-modal-title fastag-modal-title-center">
          <span className="fastag-modal-title-blue">Get started with Carosa</span>
        </h2>
        <p className="fastag-modal-subtitle">Fast, simple & secure way to pay</p>
        
        <div className="fastag-modal-form">
          <div className="fastag-form-group">
            <label className="fastag-form-label">Enter Phone Number</label>
            <Form.Control
              type="tel"
              placeholder="Enter your 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              className="fastag-form-input"
              maxLength={10}
            />
          </div>
          
          <Button
            className="fastag-modal-btn-primary"
            onClick={handleGetOtp}
            disabled={!phoneNumber || phoneNumber.length !== 10}
          >
            Get OTP
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GetStartedModal;

