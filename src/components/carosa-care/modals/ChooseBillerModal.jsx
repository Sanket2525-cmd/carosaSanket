"use client";

import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import "../../../styles/carosacare.css";

const ChooseBillerModal = ({ show, onHide, onContinue, selectedBiller, setSelectedBiller, vehicleNumber, setVehicleNumber }) => {
  const handleContinue = () => {
    if (selectedBiller && vehicleNumber) {
      onContinue();
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
        <h2 className="fastag-modal-title">
          <span className="fastag-modal-title-blue">Choose Biller</span>{" "}
          <span className="fastag-modal-title-green">- FASTag Recharge</span>
        </h2>
        
        <div className="fastag-modal-form">
          <div className="fastag-form-group">
            <label className="fastag-form-label">Select Biller</label>
            <div className="fastag-select-wrapper">
              <Form.Select
                value={selectedBiller}
                onChange={(e) => setSelectedBiller(e.target.value)}
                className="fastag-form-select"
              >
                <option value="">Select Service</option>
                <option value="sbi">SBI</option>
                <option value="icici">ICICI Bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="paytm">Paytm</option>
                <option value="airtel">Airtel Payments Bank</option>
                <option value="axis">Axis Bank</option>
              </Form.Select>
              <FaChevronDown className="fastag-select-chevron" />
            </div>
          </div>
          
          <div className="fastag-form-group">
            <label className="fastag-form-label">Vehicle Registration Number / Wallet Number</label>
            <Form.Control
              type="text"
              placeholder="Enter here"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="fastag-form-input"
            />
          </div>
          
          <Button
            className="fastag-modal-btn-primary"
            onClick={handleContinue}
            disabled={!selectedBiller || !vehicleNumber}
          >
            Continue
          </Button>
          
          <p className="fastag-modal-terms">
            By continuing, You agree to the Terms and Conditions of{" "}
            <span className="fastag-modal-terms-link">Carosa Care</span>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChooseBillerModal;

