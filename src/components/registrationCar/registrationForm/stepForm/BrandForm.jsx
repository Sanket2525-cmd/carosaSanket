import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useFormDataStore } from "../../../../store/formDataStore";

function BrandForm({
  filteredBrands,
  allBrands, // Full brands array for auto-selection (not filtered by search)
  searchBrand,
  setSearchBrand,
  backTo1,
  goStep3,
  carData, // Add carData prop to show auto-filled indicator
}) {
  const [validationErrors, setValidationErrors] = useState({});
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  
  // Use Zustand store for form data
  const { formData: details, updateField } = useFormDataStore();

  // Brand names to auto-select - dynamically generated from allBrands
  // Order matters: longer/more specific names first to avoid partial matches
  // (e.g., "Land Rover" should match before "Jaguar" in "JAGUAR LAND ROVER LIMITED")
  // (e.g., "Mercedes Benz" should match before "Mercedes" if it exists)
  // This ensures all brands in Brands.json are automatically included for auto-selection
  // Using allBrands (not filteredBrands) ensures auto-selection works even when search is active
  const autoSelectBrands = useMemo(() => {
    // Use allBrands if provided, otherwise fallback to filteredBrands
    const brandsToUse = allBrands || filteredBrands;
    if (!brandsToUse || brandsToUse.length === 0) return [];
    
    // Extract brand names from brands array
    const brandNames = brandsToUse
      .map(brand => brand.brandName || brand.name || '')
      .filter(name => name.trim() !== '');
    
    // Sort by length (longest first) to prioritize more specific matches
    // This ensures "Mercedes Benz" matches before "Mercedes", "Land Rover" before "Rover", etc.
    return brandNames.sort((a, b) => b.length - a.length);
  }, [allBrands, filteredBrands]);

  // Function to match API maker field with brand names
  const findMatchingBrand = (makerValue) => {
    if (!makerValue) return null;
    
    const makerLower = makerValue.toLowerCase();
    
    // Use allBrands for searching to ensure we find brands even if they're filtered out by search
    const brandsToSearch = allBrands || filteredBrands;
    
    // Check each brand name to see if it's contained in the maker string
    // Longer names are checked first to avoid partial matches
    for (const brandName of autoSelectBrands) {
      const brandLower = brandName.toLowerCase();
      if (makerLower.includes(brandLower)) {
        // Find the matching brand object from allBrands (not filteredBrands)
        const matchingBrand = brandsToSearch.find(brand => {
          const name = brand.brandName || brand.name || '';
          return name.toLowerCase() === brandName.toLowerCase();
        });
        if (matchingBrand) {
          return matchingBrand;
        }
      }
    }
    
    return null;
  };

  // Auto-select brand based on API maker field
  useEffect(() => {
    if (userManuallySelected) return; // Don't auto-select if user manually selected
    
    // Get maker value from carData (this comes from API's maker field)
    const apiMaker = carData?.make || '';
    if (!apiMaker) return;
    
    // Find matching brand
    const matchingBrand = findMatchingBrand(apiMaker);
    if (!matchingBrand) return;
    
    const brandName = matchingBrand.brandName || matchingBrand.name || '';
    
    // Only auto-select if not already selected or if different from current selection
    if (details.brand !== brandName) {
      updateField('brand', brandName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData?.make, userManuallySelected]);

  // Helper function to convert "February 2011" format to "2011-02" format
  const convertToMonthFormat = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM format, return as is
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's "February 2011" format, convert it
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const parts = dateString.trim().split(' ');
    if (parts.length >= 2) {
      const monthName = parts[0];
      const year = parts[1];
      
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      if (monthIndex !== -1 && /^\d{4}$/.test(year)) {
        const month = String(monthIndex + 1).padStart(2, '0');
        return `${year}-${month}`;
      }
    }
    
    // If it's just a year (YYYY), default to January
    if (/^\d{4}$/.test(dateString)) {
      return `${dateString}-01`;
    }
    
    return '';
  };

  // Convert stored values to month format when component mounts or when carData/details change
  useEffect(() => {
    if (details.year && !details.year.match(/^\d{4}-\d{2}$/)) {
      const convertedYear = convertToMonthFormat(details.year);
      if (convertedYear && convertedYear !== details.year) {
        updateField('year', convertedYear);
      }
    }
    if (details.mfgYear && !details.mfgYear.match(/^\d{4}-\d{2}$/)) {
      const convertedMfgYear = convertToMonthFormat(details.mfgYear);
      if (convertedMfgYear && convertedMfgYear !== details.mfgYear) {
        updateField('mfgYear', convertedMfgYear);
      }
    }
  }, [carData, details.year, details.mfgYear]); // Run when carData or details change

  // Helper to parse YYYY-MM format and extract month/year components
  const parseMonthYear = (monthYearStr) => {
    if (!monthYearStr || typeof monthYearStr !== 'string') return null;
    
    const match = monthYearStr.match(/^(\d{4})-(\d{1,2})$/);
    if (!match) return null;
    
    const year = parseInt(match[1], 10);
    const monthNum = parseInt(match[2], 10);
    
    if (!Number.isFinite(year) || !Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) {
      return null;
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return {
      year,
      month: monthNum,
      monthNumber: monthNum,
      monthName: monthNames[monthNum - 1]
    };
  };

  const handleYearChange = (e) => {
    const value = e.target.value; // Format: "YYYY-MM"
    updateField('year', value);
    
    // Also update regYear, regMonth, regMonthNumber, regMonthName for proper formatting
    const parsed = parseMonthYear(value);
    if (parsed) {
      updateField('regYear', parsed.year);
      updateField('regMonth', parsed.month);
      updateField('regMonthNumber', parsed.monthNumber);
      updateField('regMonthName', parsed.monthName);
    }
    
    clearValidationError("year");
  };

  const handleMfgYearChange = (e) => {
    const value = e.target.value; // Format: "YYYY-MM"
    updateField('mfgYear', value);
    
    // Also update mfgMonth, mfgMonthNumber, mfgMonthName for proper formatting
    const parsed = parseMonthYear(value);
    if (parsed) {
      updateField('mfgMonth', parsed.month);
      updateField('mfgMonthNumber', parsed.monthNumber);
      updateField('mfgMonthName', parsed.monthName);
    }
    
    clearValidationError("mfgYear");
  };

  const selectBrand = (b) => {
    updateField('brand', b.brandName || b.name || "");
    setUserManuallySelected(true); // Mark as manually selected
    clearValidationError("brand");
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

  // Generate car summary text
const getCarSummary = () => {
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date)) return value; // fallback if invalid
    // Format: "Feb, 2011"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    }).replace(" ", ", ");
  };

  const yearRaw = details.year || carData?.year || details.mfgYear || carData?.mfgYear || "";
  const mfgYearRaw = details.mfgYear || carData?.mfgYear || "";
  const brand = details.brand || carData?.brand || carData?.make || "";

  const year = formatDate(yearRaw);
  const mfgYear = formatDate(mfgYearRaw);

  const parts = [];
  if (mfgYear) parts.push(mfgYear);
  if (brand) parts.push(brand);
  if (year && year !== mfgYear) parts.push(`Reg. ${year}`);

  return parts.length > 0 ? parts.join(" ") : "Brand, Reg. Year, Mfg. Year";
};
  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!details.year?.trim()) {
      errors.year = "Please enter registration year";
    }
    if (!details.mfgYear?.trim()) {
      errors.mfgYear = "Please enter manufacturing year";
    }
    if (!details.brand?.trim()) {
      errors.brand = "Please select a brand";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      goStep3();
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
    <div className="enter-registration-page">
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
              Select your car's manufacturing year, registration year, and brand name (e.g., Maruti Suzuki, Hyundai, Tata).
            </h1>
            
            <p className="registration-description text-wrap">
              This information helps potential buyers quickly identify your car's make and authenticity.
            </p>
            
            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 2 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '22%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}
           
          </Col>

          {/* Right Section - Form Card */}
          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Year & Brand</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form">
                <Row>
                <Col xs={12} md={6}>
                    <div className="form-group mb-3" data-field="mfgYear">
                      <label className="form-label pb-2">
                        Mfg. Year
                        {carData && details.mfgYear && (
                          <small className="text-success ms-2">✓ Auto-filled</small>
                        )}
                      </label>
                      <input
                        type="month"
                        className={`form-control d-block plate-input-container ${
                          validationErrors.mfgYear ? 'border-danger' : ''
                        }`}
                        value={convertToMonthFormat(details.mfgYear || '')}
                        onChange={handleMfgYearChange}
                        style={{ 
                          backgroundColor: carData && details.mfgYear ? '#f8f9fa' : 'white',
                          border: validationErrors.mfgYear ? '1px solid #dc3545' : undefined
                        }}
                      />
                      {validationErrors.mfgYear && (
                        <div className="text-danger mt-1">
                          {validationErrors.mfgYear}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form-group mb-3" data-field="year">
                      <label className="form-label pb-2">
                        Reg. Year
                        {carData && details.year && (
                          <small className="text-success ms-2">✓ Auto-filled</small>
                        )}
                      </label>
                      <input
                        type="month"
                        className={`form-control  d-block plate-input-container ${
                          validationErrors.year ? 'border-danger' : ''
                        }`}
                        value={convertToMonthFormat(details.year || '')}
                        onChange={handleYearChange}
                        style={{ 
                          backgroundColor: carData && details.year ? '#f8f9fa' : 'white',
                          border: validationErrors.year ? '1px solid #dc3545' : undefined
                        }}
                      />
                      {validationErrors.year && (
                        <div className="text-danger mt-1">
                          {validationErrors.year}
                        </div>
                      )}
                    </div>
                  </Col>
                 
                </Row>

                {/* Brand Search */}
                <div className="form-group mb-3">
                Search by Model
                </div>

                {/* Brand Selection */}
                <div className="form-group" data-field="brand">
                  <Row className="brand-grid">
                    {(() => {
                      // Reorder brands to show auto-selected brand first (only if not manually changed)
                      const sortedBrands = [...filteredBrands].sort((a, b) => {
                        const nameA = a.brandName || a.name || "";
                        const nameB = b.brandName || b.name || "";
                        
                        // Check if brand is auto-selected (matches details.brand, carData exists, and not manually changed)
                        const isAAutoSelected = carData && details.brand === nameA && !userManuallySelected;
                        const isBAutoSelected = carData && details.brand === nameB && !userManuallySelected;
                        
                        // Move auto-selected brand to the front (only if it hasn't been manually changed)
                        if (isAAutoSelected && !isBAutoSelected) return -1;
                        if (!isAAutoSelected && isBAutoSelected) return 1;
                        return 0; // Maintain original order for others
                      });
                      
                      return sortedBrands.map((items, i) => {
                        const name = items.brandName || items.name || "";
                        const isActive = details.brand === name;
                        const isAutoFilled = carData && details.brand === name;
                      return (
                        <Col xl={2} md={4} xs={4} key={i} className="mb-3">
                          <button
                            type="button"
                            className={`brand-card ${
                              isActive ? "active" : ""
                            } ${isAutoFilled ? "auto-filled" : ""} ${
                              validationErrors.brand ? "error" : ""
                            }`}
                            onClick={() => selectBrand(items)}
                          >
                            <img src={items.image} alt={name} />
                            {/* <p className="brand-name">
                              {name}
                              {isAutoFilled && (
                                <small className="text-primary ms-1">✓</small>
                              )}
                            </p> */}
                          </button>
                        </Col>
                      );
                      });
                    })()}
                  </Row>
                  {validationErrors.brand && (
                    <div className="text-danger mt-2">
                      {validationErrors.brand}
                    </div>
                  )}
                </div>
              </form>

              {/* Back and Next Buttons - Right Section */}
              
            </div>
          </Col>
          <Col xl={12} className="">
          <div className="d-flex align-items-center justify-content-between warraping">
          <div className="registration-left-actions">
              <button type="button" className="nav-btn nav-btn-reset" >
                Reset
              </button>
            </div>
          <div className="registration-right-actions">
                <button 
                  type="button" 
                  className="nav-btn nav-btn-back"
                  onClick={backTo1}
                >
                  Back
                </button>
                <button 
                  type="submit" 
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

export default BrandForm;
