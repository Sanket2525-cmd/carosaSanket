"use client";

import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const ScheduleInspectionModal = ({ show, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    flat: "",
    area: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    datetime: "",
  });

  const [errors, setErrors] = useState({});

  // State and City data
  const stateCityData = {
    "Delhi": ["New Delhi", "Delhi"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  };

  const states = Object.keys(stateCityData);
  const cities = formData.state ? stateCityData[formData.state] || [] : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      // When state changes, reset city
      setFormData({ ...formData, [name]: value, city: "" });
    } else if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 6) {
        setFormData({ ...formData, [name]: digitsOnly });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.flat.trim()) {
      newErrors.flat = "Flat/Building Name is required";
    }
    if (!formData.area.trim()) {
      newErrors.area = "Area & Locality is required";
    }
    if (!formData.landmark.trim()) {
      newErrors.landmark = "Landmark is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.datetime) {
      newErrors.datetime = "Date & Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      if (onConfirm) {
        onConfirm(formData);
      }
      onClose();
      // Show success message
      alert("Your inspection has been scheduled successfully!");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="schedule-inspection-modal"
      backdrop="static"
      
    >
      <Modal.Header className="schedule-inspection-modal-header">
        <button
          type="button"
          className="raise-inspection-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body className="schedule-inspection-body">
        <h3>Schedule Inspection</h3>

        <label className="schedule-label">Address</label>
        <div className="address-group">
          <div>
            <input
              type="text"
              id="flat"
              name="flat"
              className={`input-field schedule-input ${errors.flat ? "error" : ""}`}
              placeholder="Flat/Building Name"
              value={formData.flat}
              onChange={handleInputChange}
            />
            {errors.flat && (
              <div className="error-message">{errors.flat}</div>
            )}
          </div>
          <div>
            <input
              type="text"
              id="area"
              name="area"
              className={`input-field schedule-input ${errors.area ? "error" : ""}`}
              placeholder="Area & Locality"
              value={formData.area}
              onChange={handleInputChange}
            />
            {errors.area && (
              <div className="error-message">{errors.area}</div>
            )}
          </div>
          <div>
            <input
              type="text"
              id="landmark"
              name="landmark"
              className={`input-field schedule-input ${errors.landmark ? "error" : ""}`}
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleInputChange}
            />
            {errors.landmark && (
              <div className="error-message">{errors.landmark}</div>
            )}
          </div>
          <div>
            <input
              type="text"
              id="pincode"
              name="pincode"
              maxLength="6"
              className={`input-field schedule-input ${errors.pincode ? "error" : ""}`}
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
            />
            {errors.pincode && (
              <div className="error-message">{errors.pincode}</div>
            )}
          </div>
          <div>
            <select
              id="state"
              name="state"
              className={`input-field schedule-input ${errors.state ? "error" : ""}`}
              value={formData.state}
              onChange={handleInputChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="error-message">{errors.state}</div>
            )}
          </div>
          <div>
            <select
              id="city"
              name="city"
              className={`input-field schedule-input ${errors.city ? "error" : ""}`}
              value={formData.city}
              onChange={handleInputChange}
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <div className="error-message">{errors.city}</div>
            )}
          </div>
        </div>

        <label className="schedule-label">Select Date & Time</label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          className={`input-field schedule-input ${errors.datetime ? "error" : ""}`}
          value={formData.datetime}
          onChange={handleInputChange}
        />
        {errors.datetime && (
          <div className="error-message">{errors.datetime}</div>
        )}

        <button
          className="btn raise-inspection-btn raise-inspection-btn-comp w-100 mt-3"
          onClick={handleConfirm}
        >
          Confirm Schedule
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default ScheduleInspectionModal;

