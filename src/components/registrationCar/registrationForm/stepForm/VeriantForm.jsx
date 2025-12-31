import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import ModelSearchService from "../../../../services/modelSearchService";
import variantsData from "../../../../data/Variant.json";
import { useFormDataStore } from "../../../../store/formDataStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
function VeriantForm({
  backTo3,
  goStep5,
  carData,
  variant
}) {
  // Use Zustand store for form data
  const { formData: details, updateField } = useFormDataStore();
  // Variant-related state
  const [variants, setVariants] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [variantError, setVariantError] = useState("");
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [userManuallySelectedFuel, setUserManuallySelectedFuel] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fuel and transmission options
  const fuelTypes = ["Petrol", "Diesel", "CNG+Petrol", "Electric", "Hybrid + Petrol", "LPG + Petrol","Diesel + Hybrid"];
  const transmissionTypes = ["Manual", "Automatic"];

  // Fetch variants for selected brand and model (optional - fails silently)
  const fetchVariants = async (brand, model) => {
    if (!brand || !model) return;

    setIsLoadingVariants(true);
    setVariantError("");

    try {
      // Silently attempt to fetch variants - if it fails, we'll use fallbacks
      const result = await ModelSearchService.getTrims(brand.toLowerCase(), model.toLowerCase());

      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        const formattedVariants = ModelSearchService.formatTrimsData(result.data, brand, model);
        if (formattedVariants && formattedVariants.length > 0) {
          setVariants(formattedVariants);
          setVariantError(""); // Clear any previous errors
        } else {
          // Silently fail - use fallbacks
          setVariants([]);
        }
      } else {
        // Silently fail - use fallbacks (JSON variants, generic options, or API variant)
        setVariants([]);
      }
    } catch (error) {
      // Silently fail - use fallbacks
      setVariants([]);
    } finally {
      setIsLoadingVariants(false);
    }
  };

  // Fetch variants when component mounts or brand/model changes (optional - non-blocking)
  useEffect(() => {
    if (details.brand && details.model) {
      // Only fetch if we don't have an API variant option (to avoid unnecessary calls)
      const hasApiVariant = carData?.model || details.variant;
      if (!hasApiVariant) {
        // Silently attempt to fetch variants (will use fallbacks if it fails)
        fetchVariants(details.brand, details.model);
      }
      // Reset manual selection when brand/model changes
      setUserManuallySelected(false);
      setUserManuallySelectedFuel(false);
    }
  }, [details.brand, details.model]);

  // Get variants from Variant.json data as fallback
  const getVariantsFromJson = (brand, model) => {
    if (!brand || !model) return [];

    // Filter variants from Variant.json based on the selected brand and model
    // The Variant.json structure has: { id, name, image, brandName, modelName }
    const brandModelVariants = variantsData
      .filter(variant =>
        variant.brandName &&
        variant.modelName &&
        variant.image &&
        variant.brandName.toLowerCase() === brand.toLowerCase() &&
        variant.modelName.toLowerCase() === model.toLowerCase()
      )
      .map(variant => ({
        id: variant.id,
        name: variant.name,
        image: variant.image
      }));

    // Remove duplicates based on variant name
    const uniqueVariants = brandModelVariants.filter((variant, index, self) =>
      index === self.findIndex(v => v.name === variant.name)
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(`Found ${uniqueVariants.length} variants for brand "${brand}" and model "${model}" from Variant.json:`, uniqueVariants);
      console.log('First variant image URL:', uniqueVariants[0]?.image);
    }

    return uniqueVariants;
  };

  // Get generic model options when no variants are found
  const getGenericModelOptions = (brand, model) => {
    const genericOptions = [
      {
        id: 'base-model',
        name: 'Base Model',
        image: '/images/generic-car.png', // You can add a generic car image
        brandName: brand,
        modelName: model,
        isGeneric: true
      },
      {
        id: 'mid-model',
        name: 'Mid Model',
        image: '/images/generic-car.png',
        brandName: brand,
        modelName: model,
        isGeneric: true
      },
      {
        id: 'top-model',
        name: 'Top Model',
        image: '/images/generic-car.png',
        brandName: brand,
        modelName: model,
        isGeneric: true
      }
    ];

    if (process.env.NODE_ENV === 'development') {
      console.log(`Using generic model options for brand "${brand}" and model "${model}":`, genericOptions);
    }

    return genericOptions;
  };

  // Get variant from API makerModal value - show as single option
  const apiModel = carData?.model || details.model || '';
  const apiVariant = apiModel.trim();

  // Create a single variant option from API makerModal value
  const apiVariantOption = apiVariant ? {
    id: 'api-variant',
    name: apiVariant,
    image: 'https://i.ibb.co/4RWtjPjd/car-icon-model-resize.jpg', // Use same car icon as model
    isApiVariant: true
  } : null;

  // Use API variant if available, otherwise use API variants, JSON fallback, or generic options
  const jsonVariants = getVariantsFromJson(details.brand, details.model);
  const displayVariants = apiVariantOption ? [apiVariantOption] :
    (variants.length > 0 ? variants :
      (jsonVariants.length > 0 ? jsonVariants :
        getGenericModelOptions(details.brand, details.model)));

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 VariantForm Debug:', {
      brand: details.brand,
      model: details.model,
      variantsFromAPI: variants,
      variantsFromAPI_Length: variants.length,
      variantsFromJson: jsonVariants,
      variantsFromJson_Length: jsonVariants.length,
      displayVariants: displayVariants,
      displayVariants_Length: displayVariants.length,
      isLoadingVariants: isLoadingVariants,
      hasApiVariantOption: !!apiVariantOption
    });
  }

  // Auto-select variant from API makerModal value (only if user hasn't manually selected)
  useEffect(() => {
    if (userManuallySelected) return;

    // Get makerModal value from API (this is the model name from API response)
    const apiModel = carData?.model || '';
    if (!apiModel || !apiModel.trim()) return;

    // Set variant to the exact makerModal value
    const trimmedModel = apiModel.trim();
    if (details.variant !== trimmedModel) {
      updateField('variant', trimmedModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData?.model, userManuallySelected]);

  // Auto-select fuel type from API response or formData (only if user hasn't manually selected)
  useEffect(() => {
    if (userManuallySelectedFuel) return;

    // Get fuelType from formData first (for edit mode), then from API response
    const fuelTypeFromForm = details.fuelType || details.fuel || '';
    const apiFuelType = carData?.fuelType || fuelTypeFromForm || '';
    if (!apiFuelType || !apiFuelType.trim()) return;

    // Normalize API fuel type for matching
    const apiFuelLower = apiFuelType.toLowerCase().trim();

    // Map API fuel types to available fuel options
    // Priority order matters - check more specific matches first
    let matchedFuel = null;

    // Check for exact or partial matches (order matters - most specific first)
    // if ((apiFuelLower.includes('petrol') && apiFuelLower.includes('hybrid')) || 
    //     (apiFuelLower.includes('hybrid') && apiFuelLower.includes('petrol'))) {
    //   matchedFuel = 'Hybrid + Petrol';
    // } else if ((apiFuelLower.includes('petrol') && apiFuelLower.includes('cng')) ||
    //            (apiFuelLower.includes('cng') && apiFuelLower.includes('petrol'))) {
    //   matchedFuel = 'CNG+Petrol';
    // } else if (apiFuelLower.includes('electric') || apiFuelLower.includes('ev') || apiFuelLower === 'electric') {
    //   matchedFuel = 'Electric';
    // } else if (apiFuelLower.includes('diesel') || apiFuelLower === 'diesel') {
    //   matchedFuel = 'Diesel';
    // } else if (apiFuelLower.includes('petrol') || apiFuelLower === 'petrol') {
    //   matchedFuel = 'Petrol';
    // } else if (apiFuelLower.includes('hybrid')) {
    //   // If only "hybrid" is mentioned without petrol, still match to "Hybrid + Petrol"
    //   matchedFuel = 'Hybrid + Petrol';
    // }

    if (
      (apiFuelLower.includes("petrol") && apiFuelLower.includes("hybrid")) ||
      (apiFuelLower.includes("hybrid") && apiFuelLower.includes("petrol"))
    ) {
      matchedFuel = "Hybrid + Petrol";
    } else if (
      (apiFuelLower.includes("petrol") && apiFuelLower.includes("cng")) ||
      (apiFuelLower.includes("cng") && apiFuelLower.includes("petrol"))
    ) {
      matchedFuel = "CNG+Petrol";
    } else if (
      (apiFuelLower.includes("petrol") && apiFuelLower.includes("lpg")) ||
      (apiFuelLower.includes("lpg") && apiFuelLower.includes("petrol"))
    ) {
      matchedFuel = "LPG + Petrol";
    } else if (
      (apiFuelLower.includes("diesel") && apiFuelLower.includes("hybrid")) ||
      (apiFuelLower.includes("hybrid") && apiFuelLower.includes("diesel"))
    ) {
      matchedFuel = "Diesel + Hybrid";
    } else if (
      apiFuelLower.includes("electric") ||
      apiFuelLower.includes("ev") ||
      apiFuelLower === "electric"
    ) {
      matchedFuel = "Electric";
    } else if (apiFuelLower.includes("diesel") || apiFuelLower === "diesel") {
      matchedFuel = "Diesel";
    } else if (apiFuelLower.includes("petrol") || apiFuelLower === "petrol") {
      matchedFuel = "Petrol";
    } else if (apiFuelLower.includes("hybrid")) {
      matchedFuel = "Hybrid + Petrol";
    }

    // Auto-select if match found and different from current selection
    if (matchedFuel && details.fuel !== matchedFuel) {
      updateField('fuel', matchedFuel);
      updateField('fuelType', matchedFuel); // Also update fuelType for consistency
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carData?.fuelType, details.fuelType, details.fuel, userManuallySelectedFuel]);

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

    console.log("=== VALIDATION CHECK ===");
    console.log("details.variant:", details.variant);
    console.log("details.fuel:", details.fuel);
    console.log("details.transmission:", details.transmission);
    console.log("variant trim check:", details.variant ? details.variant.toString().trim() : "undefined/null");
    console.log("variant isEmpty:", !details.variant || details.variant.toString().trim() === "");

    if (!details.variant || details.variant.toString().trim() === "") {
      errors.variant = "Please select a variant";
      console.log("Variant validation FAILED");
    } else {
      console.log("Variant validation PASSED");
    }

    if (!details.fuel || details.fuel.toString().trim() === "") {
      errors.fuel = "Please select a fuel type";
      console.log("Fuel validation FAILED");
    } else {
      console.log("Fuel validation PASSED");
    }

    if (!details.transmission || details.transmission.toString().trim() === "") {
      errors.transmission = "Please select a transmission type";
      console.log("Transmission validation FAILED");
    } else {
      console.log("Transmission validation PASSED");
    }

    console.log("Errors object:", errors);
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log("Is valid:", isValid);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug: Log details to understand what's happening
    console.log("=== FORM SUBMISSION ===");
    console.log("details object:", details);
    console.log("details.variant value:", details.variant);
    console.log("details.variant type:", typeof details.variant);
    console.log("details.variant length:", details.variant?.length);
    console.log("Fuel:", details.fuel);
    console.log("Transmission:", details.transmission);

    const isValid = validateForm();
    console.log("Validation result:", isValid);
    console.log("Validation errors:", validationErrors);

    if (isValid) {
      console.log("Validation passed - proceeding to step 5");
      goStep5();
    } else {
      console.log("Validation failed - errors:", validationErrors);
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

  // Generate car summary text - only update variant, fuel, and transmission at this step
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

    // Get fields from previous steps - these remain unchanged
    const mfgYear = details.mfgYear || carData?.mfgYear || "";
    const brand = details.brand || carData?.brand || carData?.make || "";
    const model = details.model || carData?.model || "";
    const color = details.color || carData?.color || "";

    // Only get variant, fuel, and transmission from this step (Step 4)
    let variant = details.variant || carData?.variant || "";
    const fuel = details.fuel || details.fuelType || carData?.fuelType || "";
    const transmission = details.transmission || carData?.transmission || "";

    // Clean variant name - remove unwanted parts like "SELF DISC & ALLOY"
    if (variant) {
      variant = variant
        .replace(/\s*SELF\s*DISC\s*&\s*ALLOY\s*/gi, '') // Remove "SELF DISC & ALLOY"
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
    }

    // Build summary with only available fields
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
    // Only add variant if it's different from model (to avoid duplication like "HONDA JAZZ XMT HONDA JAZZ XMT")
    if (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) {
      parts.push(variant);
    }
    if (fuel && fuel.trim()) {
      parts.push(fuel);
    }
    if (transmission && transmission.trim()) {
      parts.push(transmission);
    }
    if (color && color.trim()) {
      parts.push(color);
    }

    return parts.length > 0 ? parts.join(" ") : "Variant, Fuel & Transmission";
  };

  // Calculate progress percentage for transparency gradient
  const progressPercentage = (4 / 9) * 100; // Step 4 of 9 = 44.44%

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
              Pick your car's trim/variant, transmission type (manual or automatic), and fuel type (petrol, diesel, CNG, electric, hybrid, or LPG).
            </h1>

            <p className="registration-description text-wrap">
              These details highlight your car's configuration and help match it to specific buyer preferences.
            </p>

            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 4 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '44%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}

          </Col>

          {/* Right Section - Form Card */}
          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Variant, Fuel & Transmission</h4>
              </div>

              <form onSubmit={handleSubmit} className="registration-form">
                {/* Trim/Variant Section - Two Column Layout */}
                <div className="form-group mb-4">
                  <Row>
                    <Col xl={6}>
                      <label className="form-label">Trim / Variant</label>
                    </Col>
                    <Col xl={6}>
                      <div className="brand-search-container-left">
                        <Image
                          src="/images/Search.png"
                          className="brand-search-icon-left"
                          width={16}
                          height={16}
                          alt="search"
                        />
                        <input
                          placeholder="Search by Trim / Variant"
                          className="form-control searcher__field"
                          value=""
                          onChange={() => { }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* Variants Grid */}
                  <div className="form-group mt-3" data-field="variant">
                    <Row className="brand-grid speciel_height_variant">
                      {displayVariants.length > 0 ? (
                        displayVariants.map((variantItem, ind) => {
                          const isActive = details.variant === variantItem.name;
                          const isAutoFilled = carData && carData.variant &&
                            ModelSearchService.autoSelectVariant(displayVariants, carData)?.name === variantItem.name;

                          return (
                            <Col xl={3} xs={6} key={`${variantItem.id}-${variantItem.image}` || ind} className="mb-3">
                              <button
                                type="button"
                                className={`brand-card ${isActive ? "active" : ""
                                  } ${isAutoFilled ? "auto-filled" : ""} ${validationErrors.variant ? "error" : ""
                                  }`}
                                onClick={() => {
                                  console.log("Clicking variant:", variantItem.name);
                                  updateField('variant', variantItem.name);
                                  updateField('transmission', '');
                                  setUserManuallySelected(true);
                                  clearValidationError("variant");
                                }}
                              >
                                <img
                                  src={`${variantItem.image}?t=${Date.now()}`}
                                  alt={variantItem.name}
                                  style={{ width: '60px', objectFit: 'contain' }}
                                  onError={(e) => {
                                    if (e.target.src.includes('?t=')) {
                                      e.target.src = variantItem.image;
                                    } else {
                                      e.target.style.display = 'none';
                                    }
                                  }}
                                />
                                <p className="brand-name">
                                  {variantItem.name}
                                  {isAutoFilled && <span className="text-primary ms-1">✓</span>}
                                </p>
                              </button>
                            </Col>
                          );
                        })
                      ) : (
                        <div className="col-12 text-center py-4 text-muted">
                          <span>No variants available</span>
                        </div>
                      )}
                    </Row>
                    {validationErrors.variant && (
                      <div className="text-danger mt-2">
                        {validationErrors.variant}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fuel Section */}
                <Row>
                  <Col lg={8} xs={6}>
                    <div className="form-group mb-4">
                      <label className="form-label">Fuel</label>
                      <div className="option-buttons" style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', alignItems: 'flex-start',overflowX: 'auto' }}>
                        {fuelTypes.map((fuel) => {
                          return (
                            <button
                              key={fuel}
                              type="button"
                              className={`option-btn p-2 ${details.fuel === fuel ? 'active' : ''}`}
                              style={{ flex: '0 0 auto', minWidth: 'fit-content',marginBottom:'0.5rem' }}
                              onClick={() => {
                                updateField('fuel', fuel);
                                updateField('fuelType', fuel); // Also update fuelType for consistency
                                setUserManuallySelectedFuel(true);
                                clearValidationError("fuel");
                              }}
                            >
                              {fuel}
                            </button>
                          );
                        })}
                      </div>
                      {validationErrors.fuel && (
                        <div className="text-danger mt-2">
                          {validationErrors.fuel}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} xs={6}>
                    <div className="form-group mb-4">
                      <label className="form-label">Transmission</label>
                      <div className="option-buttons">
                        {transmissionTypes.map((transmission) => (
                          <button
                            key={transmission}
                            type="button"
                            className={`option-btn p-2  ${details.transmission === transmission ? 'active' : ''}`}
                            onClick={() => {
                              updateField('transmission', transmission);
                              clearValidationError("transmission");
                            }}
                          >
                            {transmission}
                          </button>
                        ))}
                      </div>
                      {validationErrors.transmission && (
                        <div className="text-danger mt-2">
                          {validationErrors.transmission}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>


                {/* Transmission Section */}

              </form>

              {/* Back and Next Buttons - Right Section */}

            </div>
          </Col>
          <Col xs={12} className="">
            <div className="warraping d-flex align-items-center justify-content-between">
              <div className="registration-left-actions">
                <button
                  type="button"
                  className="nav-btn nav-btn-reset"
                  onClick={() => {
                    updateField('variant', '');
                    updateField('fuel', '');
                    updateField('transmission', '');
                    setUserManuallySelected(false);
                    setUserManuallySelectedFuel(false);
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
                  onClick={backTo3}
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

export default VeriantForm;
