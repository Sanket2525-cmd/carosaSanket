import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { usePathname, useSearchParams } from "next/navigation"; // ★ NEW
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import FormHeadingComponents from "../FormHeadingComponents";
import { useFormDataStore } from "../../../../store/formDataStore";

function ModalForm({
  backTo2,
  goStep4,
  carData,
}) {
  // Zustand store
  const { formData: details, updateField } = useFormDataStore();
  
  // Local state
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Color (manual)
  const [selectedColor, setSelectedColor] = useState("");
  const colorContainerRef = useRef(null);

  // ★ NEW: route awareness (client navigation)
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Colors in semantic order: White → Silver → Black → Blue → Gray → Red
  const colors = [
    { name: "White", value: "#FFFFFF", bgColor: "#FFFFFF", textColor: "#000000" },
    { name: "Silver", value: "#C0C0C0", bgColor: "#C0C0C0" },
    { name: "Black", value: "#000000", bgColor: "#000000" },
    { name: "Blue", value: "#3B82F6", bgColor: "#3B82F6" },
    { name: "Gray", value: "#6B7280", bgColor: "#6B7280" },
    { name: "Red", value: "#EF4444", bgColor: "#EF4444" },
    // Additional colors if needed
    { name: "Green", value: "#10B981", bgColor: "#10B981" },
    { name: "Yellow", value: "#F59E0B", bgColor: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6", bgColor: "#8B5CF6" },
    { name: "Orange", value: "#F97316", bgColor: "#F97316" },
    { name: "Pink", value: "#EC4899", bgColor: "#EC4899" }
  ];

  // Initialize selected color from details if available
  useEffect(() => {
    if (details.color && !selectedColor) {
      // Check if details.color matches any color name
      const matchingColor = colors.find(c => 
        c.name.toLowerCase() === details.color.toLowerCase()
      );
      if (matchingColor) {
        setSelectedColor(matchingColor.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details.color]);

  const handleColorSelect = (color) => {
    setSelectedColor(color.name);
    updateField("color", color.name);
    clearValidationError("color");
  };

  // Handle color deselection on outside click
  const handleColorDeselect = useCallback(() => {
    setSelectedColor("");
    updateField("color", "");
    clearValidationError("color");
  }, [updateField]);

  // Detect clicks outside color selection container
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      
      // Don't deselect if clicking on:
      // - Navigation buttons (Back, Next, Reset)
      // - Any button or form control
      // - Elements within the registration form area
      const isExcludedElement = 
        target.closest('.nav-btn') ||
        target.closest('.registration-right-actions') ||
        target.closest('.registration-left-actions') ||
        target.closest('.warraping') ||
        target.closest('.registration-form') ||
        target.closest('.registration-form-section') ||
        target.closest('.registration-form-card') ||
        target.closest('.registration-container') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('label') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'LABEL';
      
      if (
        colorContainerRef.current &&
        !colorContainerRef.current.contains(target) &&
        selectedColor &&
        !isExcludedElement
      ) {
        handleColorDeselect();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedColor, handleColorDeselect]);

  // Get model from API response (makerModal) - ALWAYS use carData.model from backend, never details.model
  // This ensures we show the exact value from API: "honda jazz xmt" without any transformation
  const apiModel = carData?.model ? carData.model.trim() : null;
  
  // Debug: Log the model value to verify it's correct
  useEffect(() => {
    if (carData) {
      console.log('🔍 Full carData object:', carData);
      console.log('🔍 carData.model (from API makerModal):', carData.model);
      console.log('🔍 apiModel (trimmed):', apiModel);
      console.log('🔍 details.model (stored):', details.model);
      console.log('🔍 engineSize:', carData.engineSize);
    }
  }, [carData, apiModel, details.model]);
  
  // Create single model object from API - use exact value from backend (makerModal field)
  const displayModel = apiModel ? {
    name: apiModel, // This is the exact makerModal value from API response
    image: "https://i.ibb.co/4RWtjPjd/car-icon-model-resize.jpg"
  } : null;

  // Auto-select model from API - always use fresh API value, clear any cached value
  useEffect(() => {
    if (apiModel && !userManuallySelected) {
      // Always update with fresh API value, even if details.model exists (might be cached/old)
      if (details.model !== apiModel) {
        console.log('🔄 Updating model from API:', { 
          oldValue: details.model, 
          newValue: apiModel 
        });
        updateField("model", apiModel);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData?.model, userManuallySelected]);

  const clearValidationError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!details.model?.trim()) errors.model = "Please select a model";
    const colorValue = (selectedColor || details.color || "").trim();
    if (!colorValue) errors.color = "Please select a color";
    const isValid = Object.keys(errors).length === 0;
    setValidationErrors(errors);
    return { isValid, errors };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();
    if (isValid) {
      goStep4();
      return;
    }
    const prio = ["color", "model"];
    const firstError = prio.find((k) => errors[k]) || Object.keys(errors)[0];
      if (firstError) {
      setTimeout(() => {
        const el = document.querySelector(`[data-field="${firstError}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
  };

  // Generate car summary text - only update model and color at this step
  const getCarSummary = () => {
    // Helper to format YYYY-MM to readable format
    const formatYear = (yearStr) => {
      if (!yearStr) return '';
      // If it's in YYYY-MM format, convert to "Month YYYY"
      if (/^\d{4}-\d{2}$/.test(yearStr)) {
        const [year, month] = yearStr.split('-');
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = parseInt(month, 10) - 1;
        return `${monthNames[monthIndex]} ${year}`;
      }
      // If it's already in readable format, return as is
      return yearStr;
    };

    // Get year and brand from previous step (BrandForm) - these remain unchanged
    const mfgYear = details.mfgYear || carData?.mfgYear || "";
    const brand = details.brand || carData?.brand || carData?.make || "";
    
    // Only get model and color from this step (Step 3)
    const model = details.model || carData?.model || "";
    const color = selectedColor || details.color || "";
    
    // Build summary with only available fields at this step
    const parts = [];
    if (mfgYear && mfgYear.trim()) {
      parts.push(formatYear(mfgYear));
    }
    if (brand && brand.trim()) {
      parts.push(brand);
    }
    if (model && model.trim()) {
      parts.push(model);
    }
    if (color && color.trim()) {
      parts.push(color);
    }
    
    return parts.length > 0 ? parts.join(" ") : "Model & Color";
  };

  const progressPercentage = (3 / 9) * 100;
  const isColorSelected = Boolean((selectedColor || details.color || "").trim());
  const isModelSelected = Boolean((details.model || "").trim());

  return (
    <div 
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage}%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`,
      }}
    >
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
          <Col md={6} className="registration-info-section">
            <h1 className="registration-main-title brand-main-title">
              Choose your car&apos;s model name and exterior color.
            </h1>
            <p className="registration-description text-wrap">
            Accurate model and color details make your listing visually appealing and easy to find for interested buyers.
            </p>
            <div className="registration-progress">
              <div className="progress-text">Step 3 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: "33%" }}></div>
              </div>
            </div>
          </Col>

          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title text-white fSize-6 fw-semibold">Model &amp; Color</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form">
                {/* Color */}
                <div className={`form-group mb-4 ${validationErrors.color ? "has-error" : ""}`} data-field="color">
                  <label className="form-label">Color</label>
                  <div className="color-selection-container" ref={colorContainerRef}>
                    <Swiper
                      modules={[Navigation]}
                      navigation={true}
                      slidesPerView={6}
                      spaceBetween={5}
                      breakpoints={{
                        0: { slidesPerView: 3, spaceBetween: 5 },
                        576: { slidesPerView: 4, spaceBetween: 5 },
                        768: { slidesPerView: 5, spaceBetween: 5 },
                        992: { slidesPerView: 6, spaceBetween: 5 },
                        1200: { slidesPerView: 6, spaceBetween: 5 }
                      }}
                      className="color-swiper"
                    >
                      {colors.map((color) => {
                        const isSelected = selectedColor === color.name;
                        return (
                          <SwiperSlide key={color.name}>
                        <button
                          type="button"
                              className={`color-option ${isSelected ? "selected" : ""}`}
                              style={{ backgroundColor: color.bgColor, color: color.textColor || "#FFFFFF" }}
                          onClick={() => handleColorSelect(color)}
                        >
                          {color.name}
                        </button>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                 
                  {validationErrors.color && (
                    <div className="text-danger mt-2">{validationErrors.color}</div>
                  )}
                </div>

                {/* Model Display */}
                <div className="form-group mb-3">
                      <label className="form-label">Model</label>
                </div>

                {/* Model Grid */}
                {displayModel ? (
                  <div className="form-group" data-field="model">
                    <Row className="brand-grid">
                      <Col xl={3} xs={6} className="mb-3">
                            <button
                              type="button"
                          className={`brand-card ${details.model === displayModel.name ? "active" : ""} ${carData && details.model === displayModel.name && !userManuallySelected ? "auto-filled" : ""} ${validationErrors.model ? "error" : ""}`}
                              onClick={() => {
                            updateField("model", displayModel.name);
                                setUserManuallySelected(true);
                                clearValidationError("model");
                              }}
                            >
                          <img src={displayModel.image} alt={displayModel.name} style={{ width: "60px", objectFit: "contain" }} />
                              <p className="brand-name">
                            {displayModel.name}
                            {carData && details.model === displayModel.name && !userManuallySelected && (
                              <small className="text-primary ms-1">✓</small>
                            )}
                              </p>
                            </button>
                          </Col>
                    </Row>
                    {validationErrors.model && (
                      <div className="text-danger mt-2">{validationErrors.model}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <span>Model information will be available after registration number search</span>
                  </div>
                )}

                {/* Footer Actions */}
               
              </form>
            </div>
          </Col>
          <Col md={12}>
          <div className="warraping d-flex align-items-center justify-content-between ">
                    <div className="registration-left-actions">
                    <button
                      type="button"
                      className="nav-btn nav-btn-reset"
                      onClick={() => {
                        setSelectedColor("");
                        updateField("color", "");
                        clearValidationError("color");
                      }}
                    >
                Reset
              </button>
            </div>
            <div className="registration-right-actions">
                    <button type="button" className="nav-btn nav-btn-back" onClick={backTo2}>
                  Back
                </button>
                <button 
                      type="submit"
                  className="nav-btn nav-btn-next"
                  onClick={handleSubmit}
                      title={!isColorSelected ? "Please select a color to continue" : (!isModelSelected ? "Please select a model to continue" : "Next")}
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

export default ModalForm;
