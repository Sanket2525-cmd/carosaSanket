"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeadService from "@/services/leadService";

const LeadModal = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState("form"); // 'form', 'otp', 'thankyou'
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    preferredCar: "",
    budgetRange: "",
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Check if modal was previously closed
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const wasClosed = localStorage.getItem("leadModalClosed");
      if (!wasClosed) {
        // Show modal after 3-4 seconds
        const timer = setTimeout(() => {
          setShow(true);
        }, 3500); // 3.5 seconds

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    // Store in localStorage that user closed the modal
    if (typeof window !== "undefined") {
      localStorage.setItem("leadModalClosed", "true");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile number, only allow digits (exactly like GetCallBackModal)
    if (name === "mobileNumber") {
      const digitsOnly = value.replace(/\D/g, ""); // Remove all non-digits
      // Limit to 10 digits
      if (digitsOnly.length <= 10) {
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

  const handleOtpChange = (e) => {
    // Only allow digits (4-6 digits like GetCallBackModal)
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
    if (errors.otp) {
      setErrors({ ...errors, otp: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Phone Number is required";
    } else {
      // Validate phone number format (should be exactly 10 digits, no spaces or special chars)
      const phoneNumber = formData.mobileNumber.trim().replace(/\D/g, ''); // Remove all non-digits
      if (phoneNumber.length !== 10) {
        newErrors.mobileNumber = "Please enter a valid 10-digit phone number";
      }
    }
    
    if (!formData.preferredCar.trim()) {
      newErrors.preferredCar = "Preferred car is required";
    }
    
    if (!formData.budgetRange) {
      newErrors.budgetRange = "Budget range is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Clean phone number - remove all non-digits (exactly like GetCallBackModal)
      const cleanedPhoneNumber = formData.mobileNumber.trim().replace(/\D/g, '');
      
      const result = await LeadService.initiateLead({
        fullName: formData.name.trim(),
        phoneNumber: cleanedPhoneNumber,
        carTitle: formData.preferredCar.trim(),
        notes: `Budget Range: ${formData.budgetRange}`,
      });

      if (result.success) {
        // Store tokenId for OTP verification (exactly like GetCallBackModal)
        setTokenId(result.data.token);
        setPhoneNumber(cleanedPhoneNumber);
        setStep("otp");
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
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    // OTP verification (exactly like GetCallBackModal)
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    // Validate OTP format (should be 4 digits in dev, but allow up to 6) - same as GetCallBackModal
    if (otp.trim() && !/^\d{4,6}$/.test(otp.trim())) {
      setErrors({ otp: "Please enter a valid OTP" });
      return;
    }

    if (!tokenId) {
      setErrors({ otp: "Session expired. Please start again." });
      return;
    }

    // Call verifyLead API (exactly like GetCallBackModal)
    setIsLoading(true);
    setErrors({});

    try {
      const result = await LeadService.verifyLead(tokenId, otp.trim());

      if (result.success) {
        // Mark modal as closed in localStorage so it won't show again after successful submission
        if (typeof window !== "undefined") {
          localStorage.setItem("leadModalClosed", "true");
        }
        // Close modal first, then navigate to thank-you page
        setShow(false);
        // Small delay to ensure modal closes smoothly before navigation
        setTimeout(() => {
          router.push("/thank-you");
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
  };

  if (!show) return null;

  return (
    <div className="lead-popup-overlay" onClick={handleClose}>
      <div className="lead-popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="lead-close-btn" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {step === "form" && (
          <>
            <h2 className="lead-title">Looking to Buy a Car?</h2>
            <p className="lead-subtitle">
              Get <strong>100% verified cars</strong> with inspection, warranty & doorstep
              delivery. Share your details and our expert will reach out within minutes!
            </p>

            <form className="lead-popup-form" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "error" : ""}
                  required
                />
                {errors.name && <div className="lead-error-message">{errors.name}</div>}

                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={errors.mobileNumber ? "error" : ""}
                  maxLength="10"
                  inputMode="numeric"
                  required
                />
                {errors.mobileNumber && (
                  <div className="lead-error-message">{errors.mobileNumber}</div>
                )}

                <input
                  type="text"
                  name="preferredCar"
                  placeholder="Preferred Car (e.g., Creta, Swift)"
                  value={formData.preferredCar}
                  onChange={handleInputChange}
                  className={errors.preferredCar ? "error" : ""}
                  required
                />
                {errors.preferredCar && (
                  <div className="lead-error-message">{errors.preferredCar}</div>
                )}

                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className={errors.budgetRange ? "error" : ""}
                  required
                >
                  <option value="">Budget Range</option>
                  <option value="₹2–4 Lakh">₹2–4 Lakh</option>
                  <option value="₹4–7 Lakh">₹4–7 Lakh</option>
                  <option value="₹7–12 Lakh">₹7–12 Lakh</option>
                  <option value="₹12–20 Lakh">₹12–20 Lakh</option>
                  <option value="₹20 Lakh+">₹20 Lakh+</option>
                </select>
                {errors.budgetRange && (
                  <div className="lead-error-message">{errors.budgetRange}</div>
                )}

                {errors.submit && (
                  <div className="lead-error-message" style={{ textAlign: "center", marginTop: "10px" }}>
                    {errors.submit}
                  </div>
                )}

                <button type="submit" className="lead-cta-btn" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Get Best Deals Now"}
                </button>
              </form>

              <p className="lead-trusted-tag">
                ✔ Trusted Plateform • 100% Genuine Cars • No Hidden Charges
              </p>
            </>
          )}

        {step === "otp" && (
          <>
            <h2 className="lead-title">Verify OTP</h2>
            <p className="lead-subtitle">
              Code sent to <strong>+91-{phoneNumber}</strong>
              <span className="lead-edit-phone" onClick={() => setStep("form")}>
                Edit
              </span>
            </p>

            <form className="lead-popup-form" onSubmit={handleOtpSubmit}>
              <div className="lead-otp-container">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className={errors.otp ? "error" : ""}
                  maxLength="6"
                  inputMode="numeric"
                  required
                  style={{ textAlign: "center", letterSpacing: "8px", fontSize: "20px" }}
                  pattern="[0-9]{4,6}"
                />
                {errors.otp && (
                  <div className="lead-error-message" style={{ textAlign: "center" }}>
                    {errors.otp}
                  </div>
                )}
              </div>

              <button type="submit" className="lead-cta-btn" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadModal;

