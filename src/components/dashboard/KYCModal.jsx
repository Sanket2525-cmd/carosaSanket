"use client";

import React, { useState, useEffect } from 'react';

export default function KYCModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    pan: '',
    aadhaar: ''
  });

  const [progress, setProgress] = useState(0);

  // Calculate progress based on filled fields
  useEffect(() => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length;
    const calculatedProgress = (filledFields / 4) * 100;
    setProgress(calculatedProgress);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('KYC data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="dv2-modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="dv2-modal">
        <div className="dv2-modal-content">
          {/* Header */}
          <div className="dv2-modal-header">
            <div>
              <h4 className="fw-bold mb-1">Complete KYC</h4>
              <p className="text-muted fSize-3 mb-0">Fill in your details to complete verification</p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Progress Bar */}
          <div className="dv2-kyc-progress mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fSize-3 text-muted">KYC Completion</span>
              <span className="fw-bold fSize-4" style={{color: progress === 100 ? '#16A34A' : '#1D61E7'}}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress rounded-pill" style={{height:'10px', background:'#E5E7EB'}}>
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                  background: progress === 100 ? '#16A34A' : '#1D61E7',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="dv2-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  className="form-control dv2-input"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
                {formData.phone && formData.phone.length === 10 && (
                  <small className="text-success fSize-2">✓ Verified</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="dv2-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="form-control dv2-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {formData.email && formData.email.includes('@') && (
                  <small className="text-success fSize-2">✓ Verified</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="dv2-label">
                  PAN <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="pan"
                  placeholder="ABCDE1234F"
                  className="form-control dv2-input"
                  value={formData.pan}
                  onChange={handleChange}
                  maxLength="10"
                  style={{textTransform: 'uppercase'}}
                  required
                />
                {formData.pan && formData.pan.length === 10 && (
                  <small className="text-success fSize-2">✓ Verified</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="dv2-label">
                  Aadhaar Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="12-digit Aadhaar number"
                  className="form-control dv2-input"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  maxLength="12"
                  required
                />
                {formData.aadhaar && formData.aadhaar.length === 12 && (
                  <small className="text-success fSize-2">✓ Verified</small>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn dv2-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn dv2-save-btn"
                disabled={progress < 100}
              >
                {progress === 100 ? 'Complete KYC' : `Complete (${Math.round(progress)}%)`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

