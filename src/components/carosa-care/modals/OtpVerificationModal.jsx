"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import "../../../styles/carosacare.css";

const OtpVerificationModal = ({ show, onHide, onVerify, phoneNumber, onEditPhone }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const timerIntervalRef = useRef(null);

  // Start timer when modal opens
  useEffect(() => {
    if (show) {
      startResendTimer();
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [show]);

  // Start resend timer
  const startResendTimer = () => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    setResendTimer(30);
    timerIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (resendTimer === 0) {
      // Here you would typically resend the OTP
      startResendTimer();
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      onVerify(otpValue);
      // Reset OTP
      setOtp(["", "", "", ""]);
    }
  };

  // Reset OTP when modal closes
  const handleClose = () => {
    setOtp(["", "", "", ""]);
    setResendTimer(30);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      className="fastag-modal"
      dialogClassName="fastag-modal-dialog"
    >
      <Modal.Body className="fastag-modal-body">
        <button
          className="fastag-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="fastag-modal-title fastag-modal-title-center">
          <span className="fastag-modal-title-blue">Get started with Carosa</span>
        </h2>
        <p className="fastag-modal-subtitle">Fast, simple & secure way to pay</p>
        
        <div className="fastag-otp-illustration">
          <div className="fastag-otp-phone-icon">
            <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
              <rect x="10" y="5" width="60" height="110" rx="8" fill="#E3F2FD" stroke="#0C3E8B" strokeWidth="2"/>
              <rect x="20" y="15" width="40" height="60" rx="4" fill="#86CB3A"/>
              <circle cx="40" cy="90" r="8" fill="#0C3E8B"/>
            </svg>
          </div>
          <div className="fastag-otp-stars">
            <span>⭐⭐⭐⭐</span>
          </div>
        </div>
        
        <div className="fastag-modal-form">
          <p className="fastag-otp-info">
            Code send to <strong>+91-{phoneNumber}</strong>{" "}
            <span className="fastag-otp-edit" onClick={onEditPhone}>Edit</span>
          </p>
          
          <div className="fastag-form-group">
            <label className="fastag-form-label text-center">Enter Code</label>
            <div className="fastag-otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="fastag-otp-input"
                  inputMode="numeric"
                  placeholder="-"
                />
              ))}
            </div>
          </div>
          
          <p 
            className="fastag-otp-resend" 
            onClick={handleResendOtp} 
            style={{ cursor: resendTimer === 0 ? 'pointer' : 'default' }}
          >
            Resend Code {resendTimer > 0 && `(${resendTimer}sec)`}
          </p>
          
          <Button
            className="fastag-modal-btn-primary"
            onClick={handleVerifyOtp}
            disabled={otp.join("").length !== 4}
          >
            Verify OTP
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpVerificationModal;

