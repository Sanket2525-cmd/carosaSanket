// File: src/components/registrationCar/registrationForm/stepForm/OwnershipForm.jsx
"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUser, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useFormDataStore } from "../../../../store/formDataStore";

const sanitizeNumberInput = (value = "") => value.toString().replace(/[^0-9]/g, "");

const formatIndianNumber = (value = "") => {
  const digits = sanitizeNumberInput(value);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${formattedRest},${lastThree}`;
};

function OwnershipForm({ backTo4, goStep6, carData }) {
  // Use Zustand store for form data
  const { formData: details, updateField } = useFormDataStore();
  
  // Helper to convert owner string/number to number (e.g., "4" -> 4, "1st" -> 1)
  const parseOwnerNumber = (ownerValue) => {
    if (!ownerValue) return 1;
    if (typeof ownerValue === 'number') {
      return Math.max(1, Math.min(5, ownerValue)); // Clamp between 1-5
    }
    const str = String(ownerValue).trim();
    // Extract number from strings like "4", "4th", "1st", etc.
    const numMatch = str.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0], 10);
      return Math.max(1, Math.min(5, num)); // Clamp between 1-5
    }
    return 1;
  };
  
  const [selectedOwner, setSelectedOwner] = useState(() => parseOwnerNumber(details.owner));
  const [selectedSpareKey, setSelectedSpareKey] = useState(details.spareKey || "No");
  const initialKmValue = sanitizeNumberInput(details.kmDriven || details.km || "");
  const [kmInput, setKmInput] = useState(initialKmValue);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [userManuallySelectedSpareKey, setUserManuallySelectedSpareKey] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Generate car summary text
  // const getCarSummary = () => {
  //   const year = details.year || details.mfgYear || "2025";
  //   const brand = details.brand || "";
  //   const model = details.model || "";
  //   const variant = details.variant || "VXI";
  //   const fuel = details.fuel || "Petrol";
  //   const transmission = details.transmission || "Manual";
  //   const color = details.color || "White";
  //   const owner = selectedOwner === 1 ? "1st" : selectedOwner === 2 ? "2nd" : selectedOwner === 3 ? "3rd" : `${selectedOwner}th`;
  //   const kms = kmInput || "45,000";
    
  //   return `${year} ${brand} ${model} ${variant} ${fuel} ${transmission}, ${color}, ${owner}, ${kms} Kms`;
  // };

  const getCarSummary = () => {
  // Handle year and format it as "May, 2014" if format is YYYY-MM
  const rawYear = details.year || details.mfgYear || "2025";
  let formattedYear;

  if (/^\d{4}-\d{2}$/.test(rawYear)) {
    const [y, m] = rawYear.split("-");
    const date = new Date(y, m - 1);
    formattedYear = date
      .toLocaleString("en-US", { month: "long", year: "numeric" })
      .replace(" ", " "); // → "May, 2014"
  } else {
    formattedYear = rawYear.toString();
  }

  const brand = details.brand || "";
  const model = details.model || "";
  const variant = details.variant || "";
  const fuel = details.fuel || "Petrol";
  const transmission = details.transmission || "Manual";
  const color = details.color || "White";
  const owner =
    selectedOwner === 1
      ? "1st"
      : selectedOwner === 2
      ? "2nd"
      : selectedOwner === 3
      ? "3rd"
      : `${selectedOwner}th`;
  const kms = formatIndianNumber(kmInput) || "45,000";

  // Only include variant if it's different from model (to avoid duplication)
  const variantPart = (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) 
    ? ` ${variant}` 
    : "";

  return `${formattedYear} ${brand} ${model}${variantPart} ${fuel} ${transmission}, ${color}, ${owner} Owner, ${kms} Kms`;
};
  // Calculate progress percentage for transparency gradient
  const progressPercentage = (5 / 9) * 100; // Step 5 of 9 = 55.56%

  // Auto-select ownership from API response or formData (only if user hasn't manually selected)
  useEffect(() => {
    if (userManuallySelected) return;
    
    // Get owner from formData first (for edit mode), then from API response
    const ownerFromForm = details.owner || details.ownerSrNo;
    const apiOwner = carData?.ownerSrNo || carData?.owner || ownerFromForm;
    
    if (!apiOwner) return;
    
    // Convert to number using helper function
    const ownerNumber = parseOwnerNumber(apiOwner);
    
    // Update if different from current selection
    if (selectedOwner !== ownerNumber) {
      setSelectedOwner(ownerNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData?.ownerSrNo, carData?.owner, details.owner, details.ownerSrNo, userManuallySelected]);

  // Auto-select spare key from formData (only if user hasn't manually selected)
  useEffect(() => {
    if (userManuallySelectedSpareKey) return;
    
    // Get spareKey from formData (for edit mode)
    const spareKeyFromForm = details.spareKey;
    if (!spareKeyFromForm) return;
    
    // Normalize to "Yes" or "No"
    const normalizedSpareKey = String(spareKeyFromForm).trim();
    const spareKeyValue = normalizedSpareKey.toLowerCase() === 'yes' ? 'Yes' : 'No';
    
    // Update if different from current selection
    if (selectedSpareKey !== spareKeyValue) {
      setSelectedSpareKey(spareKeyValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details.spareKey, userManuallySelectedSpareKey]);

  // Update details when selections change
  useEffect(() => {
    updateField('owner', selectedOwner);
    updateField('spareKey', selectedSpareKey);
    // Save to both km and kmDriven for compatibility
    updateField('kmDriven', kmInput);
    updateField('km', kmInput); // Also save to km for backward compatibility
  }, [selectedOwner, selectedSpareKey, kmInput, updateField]);

  // Clear validation errors when user makes changes
  const clearValidationError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!kmInput?.trim()) {
      errors.km = "Please enter kilometers driven";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      goStep6();
    } else {
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[data-field="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  return (
    <div 
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage}%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`
      }}
    >
      {/* Background Image */}
      <div className="registration-bg-image"></div>
      
      <Container fluid className="registration-container">
        <Row className="registration-content">
          <Col md={12}>
          <div className="mb-3 d-flex justify-content-end chippyTopText">
              <p className="py-3 px-5">
                {getCarSummary()}
              </p>
            </div>
          </Col>
          {/* Left Section - Information */}
          <Col md={6} className="registration-info-section">
            <h1 className="registration-main-title brand-main-title">
              Enter your car's number of previous owners, total kilometers driven, and whether a spare key is available.
            </h1>
            
            <p className="registration-description text-wrap">
              Transparency about ownership and mileage builds buyer trust and improves your chances of a quicker sale.
            </p>
            
            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 5 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '55%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}
          
          </Col>

          {/* Right Section - Form Card */}
          <Col md={6} className="registration-form-section">
            {/* Car Summary - Top Right */}
          

            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Ownership & Kms Driven</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form">
                {/* Owner Section */}
                <div className="form-group mb-4" data-field="owner">
                  <label className="form-label">Ownership No</label>
                  <div className="d-flex align-items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => {
                      return (
                        <button
                          key={num}
                          type="button"
                          className={`owners rounded-circle border d-flex justify-content-center align-items-center flex-column ${
                            selectedOwner === num ? "activeSelect" : ""
                          }`}
                          onClick={() => {
                            setSelectedOwner(num);
                            setUserManuallySelected(true);
                          }}
                          style={{ cursor: "pointer", width: "60px", height: "60px", backgroundColor: selectedOwner === num ? "#0C3A89" : "white", border: selectedOwner === num ? "2px solid #8EC73E" : "1px solid #e5e7eb", color: selectedOwner === num ? "white" : "#64748b" }}
                        >
                          <FontAwesomeIcon icon={faUser} className="fSize-1 my-1" />
                          <span className="fSize-1 fw-semibold">
                            {num === 1 ? '1st' : num === 2 ? '2nd' : num === 3 ? '3rd' : `${num}th`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Kms Driven Section */}
                <div className="form-group mb-4" data-field="km">
                  <label className="form-label">Kms Driven</label>
                  <div className="inputBody">
                
                    <input
                      type="text"
                      placeholder="Enter"
                      className="py-3 ps-4 w-100 rounded-3"
                      value={formatIndianNumber(kmInput)}
                      onChange={(e) => {
                        const sanitizedValue = sanitizeNumberInput(e.target.value);
                        setKmInput(sanitizedValue);
                        clearValidationError("km");
                      }}
                    />
                  </div>
                  {validationErrors.km && (
                    <div className="text-danger mt-2">
                      {validationErrors.km}
                    </div>
                  )}
                </div>

                {/* Spare Key Section */}
                <div className="form-group mb-4" data-field="spareKey">
                  <label className="form-label">Spare Key</label>
                  <div className="option-buttons">
                    {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`option-btn py-2 px-5 ${selectedSpareKey === option ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedSpareKey(option);
                            setUserManuallySelectedSpareKey(true);
                          }}
                        >
                          {option}
                        </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Back and Next Buttons - Right Section */}
            </div>
          </Col>
          
          <Col xs={12} className=" col-12">
            <div className="warraping d-flex align-items-center justify-content-between">
              <div className="registration-left-actions">
                <button 
                  type="button" 
                  className="nav-btn nav-btn-reset"
                  onClick={() => {
                    setSelectedOwner(1);
                    setSelectedSpareKey("No");
                    setKmInput("");
                    setUserManuallySelected(false);
                    updateField('owner', 1);
                    updateField('spareKey', "No");
                    updateField('kmDriven', "");
                    updateField('km', "");
                    setValidationErrors({});
                  }}
                >
                  Reset
                </button>
              </div>
          
              <div className="registration-right-actions">
                <button 
                  type="button" 
                  className="nav-btn nav-btn-back"
                  onClick={backTo4}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="nav-btn nav-btn-next"
                  onClick={handleSubmit}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OwnershipForm;