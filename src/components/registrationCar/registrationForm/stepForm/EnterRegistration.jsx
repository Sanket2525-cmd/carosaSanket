import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CarSearchService from "../../../../services/carSearchService";

function EnterRegistration({ setRegNo, error, setError, goStep2, onCarDataFetched }) {
  const [isLoading, setIsLoading] = useState(false);
  const [regNo, setRegNoLocal] = useState("");
  const [carExists, setCarExists] = useState(false);
  const checkTimeoutRef = useRef(null);

  // Format registration number with spaces (e.g., DL 3C BA 6264)
  const formatRegistrationNumber = (value) => {
    // Remove all spaces and convert to uppercase
    const cleanValue = value.replace(/\s/g, '').toUpperCase();
    
    // If empty, return empty string
    if (!cleanValue) return '';
    
    // Format based on length
    if (cleanValue.length <= 2) {
      // Just state code (e.g., "DL")
      return cleanValue;
    } else if (cleanValue.length <= 4) {
      // State code + district (e.g., "DL 3C")
      return `${cleanValue.slice(0, 2)} ${cleanValue.slice(2)}`;
    } else if (cleanValue.length <= 6) {
      // State code + district + series (e.g., "DL 3C BA")
      return `${cleanValue.slice(0, 2)} ${cleanValue.slice(2, 4)} ${cleanValue.slice(4)}`;
    } else {
      // Full format (e.g., "DL 3C BA 6264")
      return `${cleanValue.slice(0, 2)} ${cleanValue.slice(2, 4)} ${cleanValue.slice(4, 6)} ${cleanValue.slice(6, 10)}`;
    }
  };

  // Handle registration number input
  const handleRegNoChange = (value) => {
    const formattedValue = formatRegistrationNumber(value);
    setRegNoLocal(formattedValue);
    setRegNo(formattedValue);
    setError("");
    setCarExists(false);

    const cleanRegNo = formattedValue.replace(/\s/g, '').toUpperCase();
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    
    if (cleanRegNo.length >= 8) {
      checkTimeoutRef.current = setTimeout(async () => {
        const result = await CarSearchService.checkRegistrationExists(cleanRegNo);
        setCarExists(result.exists);
      }, 500);
    }
  };

  // Search car details by registration number
  const searchCarDetails = async () => {
    // Clear any previous errors first
    setError("");

    // Check if registration number is empty
    if (!regNo.trim()) {
      setError("Please enter a registration number.");
      return;
    }

    // Remove spaces for API call (API expects clean format like "DL3CBA6264")
    const cleanRegNo = regNo.replace(/\s/g, '').toUpperCase();
    
    // Basic format validation
    if (cleanRegNo.length < 8 || cleanRegNo.length > 15) {
      setError("Please enter a valid registration number (e.g., DL 3C BA 6264).");
      return;
    }

    setIsLoading(true);

    try {
      // Check if car already exists before proceeding
      const existsCheck = await CarSearchService.checkRegistrationExists(cleanRegNo);
      if (existsCheck.exists) {
        setCarExists(true);
        setIsLoading(false);
        return; // Stop here - do NOT call searchCarByRegistration API
      }

      const result = await CarSearchService.searchCarByRegistration(cleanRegNo);
      
      if (result.success) {
        const formattedData = CarSearchService.formatCarData(result.data);
        
        // Pass car data to parent component
        if (onCarDataFetched) {
          onCarDataFetched(formattedData);
        }
        
        // Proceed to next step
        goStep2();
      } else {
        setError(result.error || "Registration number not found. Please check and try again.");
      }
    } catch (error) {
      console.error("Car search error:", error);
      setError("Unable to fetch car details. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchCarDetails();
  };

  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, []);

  return (
    <div className="enter-registration-page">
      {/* Background Image */}
      <div className="registration-bg-image"></div>
      
      <Container fluid className="registration-container">
        <Row className="registration-content">
          {/* Left Section - Information (col-7) */}
          <Col md={6} className="registration-info-section">
            <h1 className="registration-main-title text-wrap">
              Sell Your Car with <span className="car">Car</span><span className="osa">osa</span> Ka <span className="car">Bhar</span><span className="osa">osa</span>
            </h1>
            
            <p className="registration-subtitle text-wrap">
              Start by entering your car's registration number.
            </p>
            
            <p className="registration-description text-wrap">
              This helps us fetch key vehicle details automatically and ensures your listing matches official records.
            </p>
            
            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 1 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}
           
          </Col>

          {/* Right Section - Form Card (col-5) */}
          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title text-white fSize-6 fw-semibold mb-0">Registration Number</h4>
              </div>
              
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                  <label className="form-label fSize-4 fw-semibold pb-2">Car Registration No.</label>
                  <div className="plate-input-container position-relative">
                    <div className="plate-emblem">
                      <Image
                        src="/assets/img/indiachak.png"
                        height={15}
                        width={15}
                        alt="Ashoka Chakra"
                        className="object-fit-cover"
                      />
                      <span className="ind-badge">IND</span>
                    </div>
                    <input
                      type="text"
                      className="plate-input"
                      placeholder="DL 01 AB12XX"
                      value={regNo}
                      onChange={(e) => handleRegNoChange(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <div className="error-message">
                      <small className="text-danger">{error}</small>
                    </div>
                  )}
                  
                  {carExists && (
                    <div className="error-message mt-2">
                      <small className="text-danger">This car is already listed.</small>
                    </div>
                  )}
                  
                  <div className="form-note">
                    <strong>Note:</strong><small className="fSize-4 fw-light"> Your registration number is used to verify vehicle details and will not be shown on your public listing or anywhere on the website.</small>
                  </div>
                </div>
              </form>

              {/* Back and Next Buttons - Right Section */}
             
            </div>
          </Col>
          <Col xl={12} className="">
          <div className="d-flex align-items-center justify-content-between warraping">
          <div className="registration-left-actions">
              <button type="button" className="nav-btn nav-btn-reset">
                Reset
              </button>
            </div>
          <div className="registration-right-actions">
                <button type="button" className="nav-btn nav-btn-back">
                  Back
                </button>
                <button 
                  type="submit" 
                  className="nav-btn nav-btn-next"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="me-2" spin />
                      Searching...
                    </>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
              </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EnterRegistration;
