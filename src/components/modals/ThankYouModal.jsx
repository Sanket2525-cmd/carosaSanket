"use client";

import React from "react";
import { Modal } from "react-bootstrap";

const ThankYouModal = ({ show, onClose, onScheduleInspection, packageType }) => {
  const packageName = packageType === 'comprehensive' ? 'Comprehensive' : 'Basic';
  const packagePrice = packageType === 'comprehensive' ? '₹999' : '₹499';

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="thank-you-inspection-modal"
      backdrop="static"
    >
      <Modal.Header className="thank-you-inspection-modal-header">
        <button
          type="button"
          className="raise-inspection-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body className="thank-you-inspection-body text-center">
        <div className="thank-you-icon mb-3">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="#86C73B" />
            <path
              d="M25 40L35 50L55 30"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="thank-you-title">Payment Successful!</h3>
        <p className="thank-you-message">
          Thank you for choosing {packageName} Inspection ({packagePrice}).
          Your inspection request has been received.
        </p>
        <button
          className="btn raise-inspection-btn raise-inspection-btn-comp mt-3"
          onClick={onScheduleInspection}
        >
          Schedule Inspection
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default ThankYouModal;

