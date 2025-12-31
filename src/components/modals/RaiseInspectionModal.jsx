"use client";

import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const RaiseInspectionModal = ({ show, onClose, onPaymentSuccess }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // 'basic' or 'comprehensive'

  const handleBasicPay = () => {
    setSelectedPackage('basic');
    onClose(); // Close first modal
    setShowPaymentModal(true);
  };

  const handleCompPay = () => {
    setSelectedPackage('comprehensive');
    onClose(); // Close first modal
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    onClose();
    // Call the callback to show thank you modal
    if (onPaymentSuccess) {
      onPaymentSuccess(selectedPackage);
    }
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setSelectedPackage(null);
  };

  return (
    <>
      {/* Main Inspection Modal */}
      <Modal
        show={show}
        onHide={onClose}
        centered
        className="raise-inspection-modal"
        backdrop="static"
      >
        <Modal.Header className="raise-inspection-modal-header">
          <button
            type="button"
            className="raise-inspection-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body className="raise-inspection-body">
          <table className="raise-inspection-table">
            <thead className="raise-inspection-header">
              <tr>
                <th>Components</th>
                <th>Basic</th>
                <th>Comprehensive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vehicle Basic Details</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Engine & Transmission</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Exterior Body & Tyres</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Brakes & Suspension</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Interior & Electrical</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>AC & Cooling</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Lights & Battery</td>
                <td className="tick">✓</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Challan History</td>
                <td className="cross">✕</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Legal History Details</td>
                <td className="cross">✕</td>
                <td className="tick">✓</td>
              </tr>
              <tr>
                <td>Refurbishment Cost</td>
                <td className="cross">✕</td>
                <td className="tick">✓</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="raise-inspection-footer">
          <button
            className="btn raise-inspection-btn raise-inspection-btn-basic"
            onClick={handleBasicPay}
          >
            Rate Car - Basic ₹499
          </button>
          <button
            className="btn raise-inspection-btn raise-inspection-btn-comp"
            onClick={handleCompPay}
          >
            Rate Car - Comprehensive ₹999
          </button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={handleClosePayment}
        centered
        className="payment-inspection-modal"
        backdrop="static"
      >
        <Modal.Header className="payment-inspection-modal-header">
          <button
            type="button"
            className="raise-inspection-close-btn"
            onClick={handleClosePayment}
            aria-label="Close"
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body className="payment-inspection-body">
          <h3>Demo Payment Gateway</h3>
          <p className="text-center payment-subtitle">
            Enter demo card details to simulate payment.
          </p>
          <input
            type="text"
            placeholder="Card Number: 4111 1111 1111 1111"
            className="input-field payment-input"
          />
          <input
            type="text"
            placeholder="Expiry: 12/28"
            className="input-field payment-input"
          />
          <input
            type="text"
            placeholder="CVV: 123"
            className="input-field payment-input"
          />
          <button
            className="btn raise-inspection-btn raise-inspection-btn-comp w-100"
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RaiseInspectionModal;

