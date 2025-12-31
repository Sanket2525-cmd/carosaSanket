"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeadService from "@/services/leadService";

function CallUsForm({ onOTPStateChange }) {
  const router = useRouter();
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

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Call initiateLead API
      setIsLoading(true);
      setErrors({});

      try {
        // Clean phone number - remove all non-digits
        const cleanedPhoneNumber = formData.phoneNumber.trim().replace(/\D/g, '');

        // For homepage/navbar, carTitle, carVariant, carId, and city are all optional
        // Not passing them at all (undefined) - leadService will omit them from request
        const result = await LeadService.initiateLead({
          fullName: formData.fullName.trim(),
          phoneNumber: cleanedPhoneNumber
          // city, carTitle, carVariant, carId are not passed (optional fields)
        });

        if (result.success) {
          // Store tokenId for OTP verification
          setTokenId(result.data.token);
          setShowOTP(true);
          setIsOTPSent(true);
          onOTPStateChange?.(true);
          console.log("✅ OTP sent successfully to", cleanedPhoneNumber);
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
          // Reset form state
          setFormData({ fullName: "", phoneNumber: "", otp: "" });
          setShowOTP(false);
          setIsOTPSent(false);
          setTokenId(null);
          setErrors({});
          onOTPStateChange?.(false);
          
          // Redirect to thank-you page
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
    setTokenId(null);
    onOTPStateChange?.(false);
  };

  if (showOTP) {
    return (
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
          <div className="inputBody mb-3">
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
    );
  }

  return (
    <div className="callFormMain">
      <form onSubmit={handleSubmit} className="callBackForm">
        {/* Full Name */}
        <div className="inputBody mb-2">
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
        <div className="inputBody mb-3">
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
  );
}

export default CallUsForm;
