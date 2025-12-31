"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import LeadService from "@/services/leadService";
import { normalizeBrand } from "@/utils/brandNormalizer";

function GetCallBackModal({ show, onHide, phoneNumber = "+91-9090909090", car = null }) {
  const router = useRouter();
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value;
    
    // For phone number, only allow digits
    if (e.target.name === 'phoneNumber') {
      value = value.replace(/\D/g, ''); // Remove all non-digits
      // Limit to 10 digits
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBlur = (e) => {
    if (!formData[e.target.name].trim()) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: `${e.target.name === "fullName" ? "Name" : e.target.name === "phoneNumber" ? "Phone Number" : "OTP"} is required`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!showOTP) {
      // Initial form submission - validate name and phone
      if (!formData.fullName.trim()) {
        formErrors.fullName = "Name is required";
      }
      if (!formData.phoneNumber.trim()) {
        formErrors.phoneNumber = "Phone Number is required";
      }

      // Validate phone number format (should be exactly 10 digits, no spaces or special chars)
      const phoneNumber = formData.phoneNumber.trim().replace(/\D/g, ''); // Remove all non-digits
      if (phoneNumber && phoneNumber.length !== 10) {
        formErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
      
      // Update formData with cleaned phone number
      if (phoneNumber) {
        formData.phoneNumber = phoneNumber;
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Call initiateLead API
      setIsLoading(true);
      setErrors({});

      try {
        // Extract and clean car information from original car object
        // carTitle is the car model (e.g., "i20")
        const carTitle = car?.model ? String(car.model).trim() : null;
        
        // carVariant is make_model name (e.g., "Hyundai i20")
        const carVariant = car?.make && car?.model 
          ? `${normalizeBrand(String(car.make).trim())} ${String(car.model).trim()}`.trim() 
          : null;
        
        // carId must be a number (integer, positive) or null
        let carId = null;
        if (car?.id || car?._id) {
          const rawId = car.id || car._id;
          const numId = typeof rawId === 'string' ? parseInt(rawId, 10) : Number(rawId);
          if (!isNaN(numId) && numId > 0 && Number.isInteger(numId)) {
            carId = numId;
          }
        }
        
        // Get city from car customFields location or default to null
        // Ensure it's a string and trim it
        let city = null;
        if (car?.customFields?.location) {
          const cityStr = String(car.customFields.location).trim();
          city = cityStr || null;
        } else if (car?.location) {
          const cityStr = String(car.location).trim();
          city = cityStr || null;
        }

        // Clean phone number - remove all non-digits
        const cleanedPhoneNumber = formData.phoneNumber.trim().replace(/\D/g, '');

        const result = await LeadService.initiateLead({
          fullName: formData.fullName.trim(),
          phoneNumber: cleanedPhoneNumber,
          city: city,
          carTitle: carTitle,
          carVariant: carVariant,
          carId: carId
        });

        if (result.success) {
          // Store tokenId for OTP verification
          setTokenId(result.data.token);
          setShowOTP(true);
          setIsOTPSent(true);
          setIsOTPMode(true);
          console.log("✅ OTP sent successfully to", formData.phoneNumber);
        } else {
          setErrors({ submit: result.message || "Failed to send OTP. Please try again." });
        }
      } catch (error) {
        console.error("Error initiating lead:", error);
        setErrors({ submit: "Network error. Please try again." });
      } finally {
        setIsLoading(false);
      }
    } else {
      // OTP verification
      if (!formData.otp.trim()) {
        formErrors.otp = "OTP is required";
      }

      // Validate OTP format (should be 4 digits in dev, but allow up to 6)
      if (formData.otp.trim() && !/^\d{4,6}$/.test(formData.otp.trim())) {
        formErrors.otp = "Please enter a valid OTP";
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      if (!tokenId) {
        setErrors({ submit: "Session expired. Please start again." });
        return;
      }

      // Call verifyLead API
      setIsLoading(true);
      setErrors({});

      try {
        const result = await LeadService.verifyLead(tokenId, formData.otp.trim());

        if (result.success) {
          // Close modal first, then redirect to thank-you page
          onHide();
          setTimeout(() => {
            router.push('/thank-you');
          }, 100);
        } else {
          setErrors({ otp: result.message || "Invalid OTP. Please try again." });
        }
      } catch (error) {
        console.error("Error verifying lead:", error);
        setErrors({ otp: "Network error. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditPhone = () => {
    setShowOTP(false);
    setIsOTPSent(false);
    setFormData({ ...formData, otp: "" });
    setErrors({});
    setIsOTPMode(false);
    setTokenId(null);
  };

  const handleClose = () => {
    setIsOTPMode(false);
    setShowOTP(false);
    setIsOTPSent(false);
    setFormData({ fullName: "", phoneNumber: "", otp: "" });
    setErrors({});
    setTokenId(null);
    setIsLoading(false);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="call-back-modal"
      size="md"
    >
      <Modal.Body className="p-4 position-relative">
        <FontAwesomeIcon
          icon={faXmark}
          className="close-icon"
          onClick={handleClose}
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            cursor: "pointer",
            fontSize: "18px",
            color: "#666",
          }}
        />
        {!isOTPMode && (
          <>
            {/* <p className="fSize-3 fw-normal text-dark fst-italic">
              Connect With Us:
            </p>
            <p className="fSize-3 fw-semibold text-dark m-0">
              Want the best car advice?
            </p>
            <p className="fSize-3 fw-semibold text-dark m-0">
              Connect with us at <span>{phoneNumber}</span>
            </p> */}
          </>
        )}

        {!isOTPMode && (
          <>
            {/* <div className="OrLine border-bottom position-relative mb-4 mt-3">
              <div className="Or rounded-circle text-white d-flex justify-content-center align-items-center fSize-3 fw-medium">
                Or
              </div>
            </div> */}
            <div className="text-center">
              <p className="fSize-8 fw-bold text_colorblue">
                Request a Call Back
              </p>
              <p>Have questions or need help choosing your next car? Leave your details and our Carosa expert will call you shortly — no spam, just support.</p>
            </div>
          </>
        )}

        {showOTP ? (
          <div className="callFormMain">
            <div className="mb-3">
              <p className="fSize-3 fw-normal text-dark mb-2">
                Code sent to <strong>+91-{formData.phoneNumber}</strong>{" "}
                <button 
                  type="button" 
                  className="btn btn-link p-0 text-primary fSize-3"
                  onClick={handleEditPhone}
                >
                  Edit
                </button>
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="callBackForm">
              {/* OTP Input */}
              <div className="inputBody mb-4">
                <label className="mb-1 fSize-2 fw-medium text-dark">OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="mb-2 p-2 fSize-3 custom-input form-control"
                  value={formData.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="6"
                />
                {errors.otp && <p className="text-danger fSize-1 fw-lighter">{errors.otp}</p>}
              </div>

              {errors.submit && (
                <p className="text-danger fSize-2 fw-normal mb-3">{errors.submit}</p>
              )}

              <div className="callMeBackBtn">
                <button
                  type="submit"
                  className="w-100 fw-semibold fSize-3 custom-otp-btn btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="callFormMain">
            <form onSubmit={handleSubmit} className="callBackForm">
              {/* Full Name */}
              <div className="inputBody mb-4">
                <label className="mb-1 fSize-2 fw-medium text-dark">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Full Name"
                  className="mb-2 p-2 fSize-3 custom-input form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.fullName && <p className="text-danger fSize-1 fw-lighter">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div className="inputBody mb-4">
                <label className="mb-1 fSize-2 fw-medium text-dark">Phone Number*</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter 10-digit Phone Number"
                  className="mb-2 p-2 fSize-3 custom-input form-control"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="10"
                  inputMode="numeric"
                />
                {errors.phoneNumber && <p className="text-danger fSize-1 fw-lighter">{errors.phoneNumber}</p>}
              </div>

              {errors.submit && (
                <p className="text-danger fSize-2 fw-normal mb-3">{errors.submit}</p>
              )}

              <div className="callMeBackBtn">
                <button
                  type="submit"
                  className="w-100 fw-semibold fSize-3 custom-otp-btn btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "CALL ME BACK"}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default GetCallBackModal;

