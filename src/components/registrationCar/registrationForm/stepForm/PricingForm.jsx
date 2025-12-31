"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useFormDataStore } from "../../../../store/formDataStore";

function PricingForm({ backTo8, handleSubmitFinal, isAuthenticated }) {
  // Zustand global store
  const { formData: details, updateField } = useFormDataStore();

  // --- Helpers: INR format/unformat ---
  const inrFormatter = useMemo(
    () => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }),
    []
  );

  const unformatNumber = (v) => {
    if (v == null) return "";
    // Sirf digits rakho
    const digits = String(v).replace(/[^\d]/g, "");
    return digits;
  };

  const formatINR = (v) => {
    const digits = unformatNumber(v);
    if (!digits) return "";
    // Leading zeros trim
    const clean = digits.replace(/^0+(?=\d)/, "");
    if (!clean) return "0";
    return inrFormatter.format(Number(clean));
  };

  // --- Local state (formatted strings for UI) ---
  const [listingPrice, setListingPrice] = useState(formatINR(details.listingPrice));
  const [offerPrice, setOfferPrice] = useState(formatINR(details.offerPrice));
  const [validationErrors, setValidationErrors] = useState({});

  // Generate car summary
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
    const owner =
      details.owner === 1
        ? "1st"
        : details.owner === 2
          ? "2nd"
          : details.owner === 3
            ? "3rd"
            : `${details.owner}nd`;
    const kms = details.km || "45,000";
    
    // Only include variant if it's different from model (to avoid duplication)
    const variantPart = (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) 
      ? ` ${variant}` 
      : "";
    
    return `${formattedYear} ${brand} ${model}${variantPart} ${fuel} ${transmission}, ${color}, ${owner}, ${kms} Kms`;
  };

  // Progress bar
  const progressPercentage = (9 / 9) * 100;

  // Clear validation error dynamically
  const clearValidationError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate inputs (uses numeric values)
  const validateForm = (numListing, numOffer) => {
    const errors = {};
    if (!numListing || isNaN(numListing) || Number(numListing) <= 0) {
      errors.listingPrice = "Please enter a valid price";
    }
    if (!numOffer || isNaN(numOffer) || Number(numOffer) <= 0) {
      errors.offerPrice = "Please enter a valid price";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers: keep input numeric & show as INR formatted
  const handleListingChange = (e) => {
    const formatted = formatINR(e.target.value);
    setListingPrice(formatted);
    clearValidationError("listingPrice");
  };

  const handleOfferChange = (e) => {
    const formatted = formatINR(e.target.value);
    setOfferPrice(formatted);
    clearValidationError("offerPrice");
  };

  // Prevent non-digit paste
  const onlyDigitsPaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    if (/[^\d]/.test(pasted)) {
      e.preventDefault();
      const digits = pasted.replace(/[^\d]/g, "");
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newVal = target.value.slice(0, start) + digits + target.value.slice(end);
      // Manually set value then trigger change handlers
      if (target.name === "listingPrice") {
        setListingPrice(formatINR(newVal));
      } else {
        setOfferPrice(formatINR(newVal));
      }
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert to numeric (plain) for validation & submit
    const listingPlain = unformatNumber(listingPrice);
    const offerPlain = unformatNumber(offerPrice);

    const numListing = Number(listingPlain || 0);
    const numOffer = Number(offerPlain || 0);

    if (validateForm(numListing, numOffer)) {
      // Update global Zustand state with plain numeric (recommended)
      updateField("listingPrice", numListing);
      updateField("offerPrice", numOffer);

      // Trigger parent submit with clean values
      handleSubmitFinal(e, { listingPrice: numListing, offerPrice: numOffer });
    } else {
      // Scroll to first error field (after setting errors)
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[data-field="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  // Reset button: clear both
  const handleReset = () => {
    setListingPrice("");
    setOfferPrice("");
    setValidationErrors({});
    // (Optional) Store me bhi clear karna ho to uncomment:
    // updateField("listingPrice", "");
    // updateField("offerPrice", "");
  };

  // If details me numeric value already stored hai, UI me formatted dikhao
  useEffect(() => {
    if (details?.listingPrice != null && details.listingPrice !== "") {
      setListingPrice(formatINR(details.listingPrice));
    }
    if (details?.offerPrice != null && details.offerPrice !== "") {
      setOfferPrice(formatINR(details.offerPrice));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage
          }%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`,
      }}
    >
      <div className="registration-bg-image"></div>

      <Container fluid className="registration-container">
        <form onSubmit={handleSubmit}>
          <Row className="registration-content">
            <Col md={12}>
              <div className="mb-3 d-flex justify-content-end chippyTopText">
                <p className="py-3 px-5">{getCarSummary()}</p>
              </div>
            </Col>

            {/* Left Section */}
            <Col md={6} className="registration-info-section">
              <h1 className="registration-main-title brand-main-title">
                Set your Selling Price (public) and Offer Price (private minimum).
              </h1>
              <p className="registration-description text-wrap">
                A clear public price attracts buyers, while a private minimum protects your bottom line and speeds negotiations.
              </p>

              <div className="registration-progress">
                <div className="progress-text">Step 9 of 9</div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: "100%" }}></div>
                </div>
              </div>
            </Col>

            {/* Right Section */}
            <Col md={6} className="mobilePaddingSet">
              <div className="registration-form-card">
                <div className="form-card-header text-center">
                  <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">
                    Car Pricing
                  </h4>
                </div>

                <div className="registration-form" >
                  <div className="owner__list pb-0 mb-4">
                    <Row>
                      <Col lg={12} className="pb-4" data-field="listingPrice">
                        <div className="carType">
                          <p className="mt-2 fSize-4 text-dark gap-2">
                            <strong className="fw-semibold text-dark">Selling Price</strong>{" "}
                            <span className="fst-italic">
                              {" "}
                              (Price you want to display publicly)
                            </span>
                          </p>
                          <input
                            name="listingPrice"
                            inputMode="numeric"
                            autoComplete="off"
                            type="text"
                            className={`form-control py-3 px-3 rounded-1 fsetprice  w-100 ${validationErrors.listingPrice ? "border-danger" : ""
                              }`}
                            placeholder="Enter e.g. 5,00,000"
                            value={listingPrice}
                            onChange={handleListingChange}
                            onPaste={onlyDigitsPaste}
                            style={{
                              border: validationErrors.listingPrice
                                ? "1px solid #dc3545"
                                : "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          {validationErrors.listingPrice && (
                            <div className="text-danger fSize-1 mt-1">
                              {validationErrors.listingPrice}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={12} data-field="offerPrice">
                        <div className="carType">
                          <p className="mt-2 fSize-4 text-dark gap-2">
                            <strong className="fw-semibold text-dark">Closing Deal Price</strong>{" "}
                            <span className="fst-italic fw-light">
                              {" "}
                              (Minimum price you're willing to accept.)
                            </span>
                          </p>
                          <input
                            name="offerPrice"
                            inputMode="numeric"
                            autoComplete="off"
                            type="text"
                            className={`form-control py-3 px-3 rounded-1 fsetprice w-100 ${validationErrors.offerPrice ? "border-danger" : ""
                              }`}
                            placeholder="Enter e.g. 4,50,000"
                            value={offerPrice}
                            onChange={handleOfferChange}
                            onPaste={onlyDigitsPaste}
                            style={{
                              border: validationErrors.offerPrice
                                ? "1px solid #dc3545"
                                : "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          {validationErrors.offerPrice && (
                            <div className="text-danger fSize-1 mt-1">
                              {validationErrors.offerPrice}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>

                </div>
              </div>
            </Col>
            <div className="warraping d-flex align-items-center justify-content-between">
              <button type="button" className="nav-btn nav-btn-reset" onClick={handleReset}>
                Reset
              </button>

              <div className="registration-right-actions">
                <button
                  type="button"
                  className="nav-btn nav-btn-back"
                  onClick={backTo8}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="nav-btn nav-btn-next"
                >
                  Submit
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </button>
              </div>
            </div>
          </Row>
        </form>
      </Container>
    </div>
  );
}

export default PricingForm;
