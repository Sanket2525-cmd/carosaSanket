import { faArrowRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { useFormDataStore } from "../../../../store/formDataStore";

function WarrantyForm({ goStep7, backTo5, carData }) {
  // Use Zustand store for form data
  const { formData: details, updateField } = useFormDataStore();
  // Warranty states
  const [selectedWarranty, setSelectedWarranty] = useState(() => {
    // Initialize from formData if available
    const warrantyFromForm = details.warranty;
    if (warrantyFromForm) {
      const normalized = String(warrantyFromForm).trim().toLowerCase();
      return normalized === 'yes' ? 'Yes' : 'No';
    }
    return "No";
  });
  const [selectedWarrantyType, setSelectedWarrantyType] = useState(details.warrantyType || "Extended");
  const [warrantyDate, setWarrantyDate] = useState(details.warrantyDate || "");
  const [warrantyDropdownOpen, setWarrantyDropdownOpen] = useState(false);
  const warrantyDropdownRef = useRef(null);
  const [userManuallySelectedWarranty, setUserManuallySelectedWarranty] = useState(false);

  // Insurance states
  const [selectedInsurance, setSelectedInsurance] = useState(() => {
    // Initialize from formData if available, handle "Expired" case
    const insuranceFromForm = details.insurance;
    if (insuranceFromForm) {
      const normalized = String(insuranceFromForm).trim().toLowerCase();
      if (normalized === 'expired') return 'Expired';
      if (normalized === 'yes' || normalized === 'active') return 'Yes';
      return 'No';
    }
    return "No";
  });
  const [selectedInsuranceType, setSelectedInsuranceType] = useState(details.insuranceType || "Comprehensive");
  const [insuranceDate, setInsuranceDate] = useState(details.insuranceDate || "");
  const [insuranceDropdownOpen, setInsuranceDropdownOpen] = useState(false);
  const insuranceDropdownRef = useRef(null);
  const [userManuallySelectedInsuranceDate, setUserManuallySelectedInsuranceDate] = useState(false);
  const [userManuallySelectedInsurance, setUserManuallySelectedInsurance] = useState(false);

  // Use refs to prevent infinite loops when syncing between formData and local state
  const isSyncingFromFormData = useRef(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});

  // Generate car summary text
  const getCarSummary = () => {
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
    // const year = details.year || details.mfgYear || "2025";
    const brand = details.brand || "";
    const model = details.model || "";
    const variant = details.variant || "";
    const fuel = details.fuel || "Petrol";
    const transmission = details.transmission || "Manual";
    const color = details.color || "White";
    const owner = details.owner === 1 ? "1st" : details.owner === 2 ? "2nd" : details.owner === 3 ? "3rd" : `${details.owner}th`;
    const kms = details.km || "45,000";
    
    // Only include variant if it's different from model (to avoid duplication)
    const variantPart = (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) 
      ? ` ${variant}` 
      : "";
    
    return `${formattedYear} ${brand} ${model}${variantPart} ${fuel} ${transmission}, ${color}, ${owner}, ${kms} Kms`;
  };

  // Calculate progress percentage for transparency gradient
  const progressPercentage = (6 / 9) * 100; // Step 6 of 9 = 66.67%

  // Auto-select insurance validity date from API insUpto field
  useEffect(() => {
    if (userManuallySelectedInsurance || userManuallySelectedInsuranceDate) {
      return;
    }
    
    const apiInsuranceUpto = carData?.insuranceUpto || details.insuranceUpto || '';
    if (!apiInsuranceUpto || !apiInsuranceUpto.trim()) {
      return;
    }
    
    try {
      const insuranceDateStr = apiInsuranceUpto.trim();
      let formattedDate = '';
      
      if (insuranceDateStr.includes('-')) {
        formattedDate = insuranceDateStr.split('T')[0];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
          formattedDate = '';
        }
      } else if (insuranceDateStr.includes('/')) {
        const parts = insuranceDateStr.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          if (day.length <= 2 && month.length <= 2 && year.length === 4) {
            formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }
      }
      
      if (formattedDate && /^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        const insuranceDateObj = new Date(formattedDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        insuranceDateObj.setHours(0, 0, 0, 0);
        
        if (!isNaN(insuranceDateObj.getTime())) {
          if (insuranceDateObj < currentDate) {
            setSelectedInsurance("Expired");
            setInsuranceDate("");
          } else {
            setSelectedInsurance("Yes");
            setInsuranceDate(formattedDate);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing insurance date:", error);
    }
  }, [carData?.insuranceUpto, details.insuranceUpto, userManuallySelectedInsurance, userManuallySelectedInsuranceDate]);

  // Auto-select warranty from formData (only if user hasn't manually selected)
  useEffect(() => {
    if (userManuallySelectedWarranty) return;
    
    // Get warranty from formData (for edit mode)
    const warrantyFromForm = details.warranty;
    if (!warrantyFromForm) return;
    
    // Normalize to "Yes" or "No"
    const normalizedWarranty = String(warrantyFromForm).trim().toLowerCase();
    const warrantyValue = normalizedWarranty === 'yes' ? 'Yes' : 'No';
    
    // Update if different from current selection
    if (selectedWarranty !== warrantyValue) {
      setSelectedWarranty(warrantyValue);
    }
    
    // Also update warranty type if available
    if (details.warrantyType && selectedWarrantyType !== details.warrantyType) {
      setSelectedWarrantyType(details.warrantyType);
    }
    
    // Also update warranty date if available
    if (details.warrantyDate && warrantyDate !== details.warrantyDate) {
      setWarrantyDate(details.warrantyDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details.warranty, details.warrantyType, details.warrantyDate, userManuallySelectedWarranty]);

  // Auto-select insurance from formData (for edit mode, only if no API data)
  useEffect(() => {
    if (userManuallySelectedInsurance) return;
    
    // Prioritize API data over formData
    if (carData?.insuranceUpto || details.insuranceUpto) {
      return;
    }
    
    const insuranceFromForm = details.insurance;
    if (!insuranceFromForm) return;
    
    const normalizedInsurance = String(insuranceFromForm).trim().toLowerCase();
    let insuranceValue = 'No';
    if (normalizedInsurance === 'expired') {
      insuranceValue = 'Expired';
    } else if (normalizedInsurance === 'yes' || normalizedInsurance === 'active') {
      insuranceValue = 'Yes';
    }
    
    if (selectedInsurance !== insuranceValue) {
      isSyncingFromFormData.current = true;
      setSelectedInsurance(insuranceValue);
    }
    
    if (details.insuranceType && selectedInsuranceType !== details.insuranceType) {
      setSelectedInsuranceType(details.insuranceType);
    }
    
    if (details.insuranceDate && insuranceValue !== 'Expired' && insuranceDate !== details.insuranceDate) {
      setInsuranceDate(details.insuranceDate);
    }
    
    const timeoutId = setTimeout(() => {
      isSyncingFromFormData.current = false;
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [details.insurance, details.insuranceType, details.insuranceDate, details.insuranceUpto, carData?.insuranceUpto, userManuallySelectedInsurance]);

  // Update details when selections change (only update if value actually changed)
  useEffect(() => {
    // Skip updates if we're currently syncing from formData to prevent infinite loops
    if (isSyncingFromFormData.current) {
      return;
    }
    
    // Only update if the value has actually changed to prevent infinite loops
    // Check against current details values to avoid unnecessary updates
    if (details.warranty !== selectedWarranty) {
      updateField('warranty', selectedWarranty);
    }
    if (details.warrantyType !== selectedWarrantyType) {
      updateField('warrantyType', selectedWarrantyType);
    }
    if (details.warrantyDate !== warrantyDate) {
      updateField('warrantyDate', warrantyDate);
    }
    if (details.insurance !== selectedInsurance) {
      updateField('insurance', selectedInsurance);
    }
    if (details.insuranceType !== selectedInsuranceType) {
      updateField('insuranceType', selectedInsuranceType);
    }
    if (details.insuranceDate !== insuranceDate) {
      updateField('insuranceDate', insuranceDate);
    }
    // Only depend on local state values, not details to prevent circular updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWarranty, selectedWarrantyType, warrantyDate, selectedInsurance, selectedInsuranceType, insuranceDate, updateField]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Warranty validation
    if (selectedWarranty === "Yes") {
      if (!selectedWarrantyType) {
        errors.warrantyType = "Please select a warranty type";
      }
      if (!warrantyDate) {
        errors.warrantyDate = "Please select a warranty expiry date";
      }
    }

    // Insurance validation
    if (selectedInsurance === "Yes") {
      if (!selectedInsuranceType) {
        errors.insuranceType = "Please select an insurance type";
      }
      if (!insuranceDate) {
        errors.insuranceDate = "Please select an insurance expiry date";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (warrantyDropdownRef.current && !warrantyDropdownRef.current.contains(event.target)) {
        setWarrantyDropdownOpen(false);
      }
      if (insuranceDropdownRef.current && !insuranceDropdownRef.current.contains(event.target)) {
        setInsuranceDropdownOpen(false);
      }
    };

    if (warrantyDropdownOpen || insuranceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [warrantyDropdownOpen, insuranceDropdownOpen]);

  const handleWarrantyTypeSelect = (option) => {
    setSelectedWarrantyType(option);
    setWarrantyDropdownOpen(false);
    clearValidationError("warrantyType");
  };

  const handleInsuranceTypeSelect = (option) => {
    setSelectedInsuranceType(option);
    setInsuranceDropdownOpen(false);
    clearValidationError("insuranceType");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      goStep7();
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
              Provide information about any active warranty coverage and insurance validity.
            </h1>
            
            <p className="registration-description text-wrap">
              Buyers appreciate knowing if the car is still covered by warranty or has a valid insurance plan in place.
            </p>
            
            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 6 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '67%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}
          
          </Col>

          {/* Right Section - Form Card */}
          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Warranty & Insurance</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form warranty">
                {/* Warranty Section */}
                <div className="form-group mb-4" data-field="warranty">
                  <label className="form-label">Warranty</label>
                  <Row>
                    {["Yes", "No"].map((option) => (
                      <Col sm={6} key={option} className="mb-sm-0 mb-2">
                        <button
                          type="button"
                          className={`option-btn py-2 px-3 w-100 ${selectedWarranty === option ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedWarranty(option);
                            setUserManuallySelectedWarranty(true);
                          }}
                        >
                          {option}
                        </button>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Warranty Type and Date - Show only if Warranty is Yes */}
                {selectedWarranty === "Yes" && (
                  <>
                    <div className="form-group mb-4" data-field="warrantyType">
                      <Row>
                        <Col sm={6}>
                          <label className="form-label">Warranty Type</label>
                          <div className="position-relative" ref={warrantyDropdownRef}>
                            <button
                              type="button"
                              className={`option-btn py-2 px-3 w-100 d-flex justify-content-between align-items-center ${selectedWarrantyType ? 'active' : ''}`}
                              onClick={() => setWarrantyDropdownOpen(!warrantyDropdownOpen)}
                            >
                              <span>{selectedWarrantyType || "Select Warranty Type"}</span>
                              <FontAwesomeIcon icon={faChevronDown} className={warrantyDropdownOpen ? 'rotate-180' : ''} style={{ transition: 'transform 0.3s' }} />
                            </button>
                            {warrantyDropdownOpen && (
                              <div className="warranty-dropdown-menu">
                                {["Extended", "Company"].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    className={`warranty-dropdown-item ${selectedWarrantyType === option ? 'active' : ''}`}
                                    onClick={() => handleWarrantyTypeSelect(option)}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {validationErrors.warrantyType && (
                            <div className="text-danger mt-2">
                              {validationErrors.warrantyType}
                            </div>
                          )}
                        </Col>
                        <Col sm={6}>
                          <div className="">
                            <label className="form-label small text-muted mb-0">Warranty Expiry Date</label>
                            <input
                              type="date"
                              className="option-btn py-2 px-3 w-100"
                              value={warrantyDate}
                              onChange={(e) => {
                                setWarrantyDate(e.target.value);
                                clearValidationError("warrantyDate");
                              }}
                              placeholder="Select Expiry Date"
                            />
                            {validationErrors.warrantyDate && (
                              <div className="text-danger mt-2">
                                {validationErrors.warrantyDate}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {/* Insurance Section */}
                <div className="form-group mb-4" data-field="insurance">
                  <label className="form-label">Insurance</label>
                  <Row>
                    {["Yes", "Expired"].map((option) => (
                      <Col sm={6} key={option} className="mb-sm-0 mb-2">
                        <button
                          type="button"
                          className={`option-btn py-2 px-3 w-100 ${selectedInsurance === option ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedInsurance(option);
                            setUserManuallySelectedInsurance(true);
                            // Clear date field when "Expired" is selected
                            if (option === "Expired") {
                              setInsuranceDate("");
                              setUserManuallySelectedInsuranceDate(true);
                            }
                          }}
                        >
                          {option}
                        </button>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Insurance Type and Date - Show only if Insurance is Yes */}
                {selectedInsurance === "Yes" && (
                  <>
                    <div className="form-group mb-4" data-field="insuranceType">
                      <Row>
                        <Col sm={6}>
                          <label className="form-label">Insurance Type</label>
                          <div className="position-relative" ref={insuranceDropdownRef}>
                            <button
                              type="button"
                              className={`option-btn py-2 px-3 w-100 d-flex justify-content-between align-items-center ${selectedInsuranceType ? 'active' : ''}`}
                              onClick={() => setInsuranceDropdownOpen(!insuranceDropdownOpen)}
                            >
                              <span>{selectedInsuranceType || "Select Insurance Type"}</span>
                              <FontAwesomeIcon icon={faChevronDown} className={insuranceDropdownOpen ? 'rotate-180' : ''} style={{ transition: 'transform 0.3s' }} />
                            </button>
                            {insuranceDropdownOpen && (
                              <div className="warranty-dropdown-menu">
                                {["Comprehensive", "Zero Dept", "3rd Party"].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    className={`warranty-dropdown-item ${selectedInsuranceType === option ? 'active' : ''}`}
                                    onClick={() => handleInsuranceTypeSelect(option)}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {validationErrors.insuranceType && (
                            <div className="text-danger mt-2">
                              {validationErrors.insuranceType}
                            </div>
                          )}
                        </Col>
                        <Col sm={6}>
                          <div className="">
                            <label className="form-label small text-muted mb-0">Insurance Validity Date</label>
                            <input
                              type="date"
                              className="option-btn py-2 px-3 w-100"
                              value={insuranceDate}
                              onChange={(e) => {
                                setInsuranceDate(e.target.value);
                                setUserManuallySelectedInsuranceDate(true);
                                clearValidationError("insuranceDate");
                              }}
                              placeholder="Select Validity Date"
                            />
                            {validationErrors.insuranceDate && (
                              <div className="text-danger mt-2">
                                {validationErrors.insuranceDate}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </form>

              {/* Back and Next Buttons - Right Section */}
            </div>
          </Col>
          
          <Col xs={12} className="">
            <div className="warraping d-flex align-items-center justify-content-between">
              <div className="registration-left-actions">
                <button type="button" className="nav-btn nav-btn-reset">
                  Reset
                </button>
              </div>
          
              <div className="registration-right-actions">
                <button 
                  type="button" 
                  className="nav-btn nav-btn-back"
                  onClick={backTo5}
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

export default WarrantyForm;
