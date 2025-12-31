"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

// Round to nearest interval (2000 for loan/down payment)
const roundToInterval = (value, interval = 2000) => {
  return Math.round(value / interval) * interval;
};

const CarosaLoanCalculator = ({ sellingPrice = 893000, onEMIChange }) => {
  // Extract numeric value from selling price (handle both number and formatted string)
  const getNumericPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove currency symbols, commas, and spaces
      const cleaned = price.replace(/[₹,\s]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 893000 : num;
    }
    return 893000; // Default fallback
  };

  const carSellingPrice = getNumericPrice(sellingPrice);
  const minLoanAmount = 100000;
  const maxLoanAmount = carSellingPrice; // Loan amount ranges from 100000 to selling price
  const minDownPayment = 0;
  const maxDownPayment = carSellingPrice - minLoanAmount; // Down payment ranges from 0 to (selling price - 100000)
  const minLoanDuration = 12;
  const maxLoanDuration = 84;
  const minROI = 10;
  const maxROI = 18;

  // Initialize with defaults based on car selling price
  // Default values:
  // - Down Payment: 20% of car selling price (rounded to nearest ₹2000), but capped at maxDownPayment
  // - Loan Amount: Car selling price - Down Payment (80% of car selling price), but at least minLoanAmount
  // - Loan Duration: 36 months
  // - ROI: 10.49% (with 2 decimal precision)
  const maxDownPaymentCalc = carSellingPrice - minLoanAmount;
  const initialDownPayment = Math.min(roundToInterval(carSellingPrice * 0.2), maxDownPaymentCalc); // 20% of car selling price, capped at max
  const initialLoanAmount = Math.max(minLoanAmount, roundToInterval(carSellingPrice - initialDownPayment)); // Remaining, at least minLoanAmount

  // State for all calculator values - these are the active values used in calculations
  // The calculator always uses these current state values, not the initial defaults
  const [loanAmount, setLoanAmount] = useState(initialLoanAmount);
  const [downPayment, setDownPayment] = useState(initialDownPayment);
  const [loanDuration, setLoanDuration] = useState(36);
  const [rateOfInterest, setRateOfInterest] = useState(10.49); // Default 10.49% with 2 decimals

  // Calculated values
  const [emi, setEmi] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);

  // Update loan amount and down payment when selling price changes (car changes)
  useEffect(() => {
    // When car selling price changes, reset to defaults:
    // Down payment = 20% of car selling price (capped at maxDownPayment), Loan amount = car selling price - down payment (at least minLoanAmount)
    const maxDownPaymentCalc = carSellingPrice - minLoanAmount;
    const newDownPayment = Math.min(roundToInterval(carSellingPrice * 0.2), maxDownPaymentCalc);
    const newLoanAmount = Math.max(minLoanAmount, roundToInterval(carSellingPrice - newDownPayment));
    
    // Reset initial mount flag and update flags to prevent reciprocation during car change
    isInitialMount.current = true;
    isUpdatingRef.current = true;
    sourceOfChangeRef.current = null;
    
    setDownPayment(newDownPayment);
    setLoanAmount(newLoanAmount);
    setRateOfInterest(10.49); // Reset ROI to default 10.49%
    
    // Reset flags after a short delay
    setTimeout(() => {
      isInitialMount.current = false;
      isUpdatingRef.current = false;
      sourceOfChangeRef.current = null;
    }, 100);
  }, [carSellingPrice]);

  // Track if we're updating to prevent infinite loops
  const isUpdatingRef = useRef(false);
  const isInitialMount = useRef(true);
  const sourceOfChangeRef = useRef(null);
  const onEMIChangeRef = useRef(onEMIChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onEMIChangeRef.current = onEMIChange;
  }, [onEMIChange]);

  // When loan amount changes, update down payment
  // Constraint: Loan Amount + Down Payment = Car Selling Price
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isUpdatingRef.current || sourceOfChangeRef.current === 'downPayment') {
      return;
    }
    
    isUpdatingRef.current = true;
    sourceOfChangeRef.current = 'loanAmount';
    
    // Calculate down payment: Car Selling Price - Loan Amount
    const calculatedDownPayment = carSellingPrice - loanAmount;
    const maxDownPaymentCalc = carSellingPrice - minLoanAmount;
    const newDownPayment = Math.max(0, Math.min(roundToInterval(calculatedDownPayment), maxDownPaymentCalc));
    
    setDownPayment(newDownPayment);
    
    setTimeout(() => {
      isUpdatingRef.current = false;
      sourceOfChangeRef.current = null;
    }, 10);
  }, [loanAmount, carSellingPrice, minLoanAmount]);

  // When down payment changes, adjust loan amount to reciprocate
  // Constraint: Loan Amount + Down Payment = Car Selling Price
  useEffect(() => {
    if (isInitialMount.current) return;
    
    if (isUpdatingRef.current || sourceOfChangeRef.current === 'loanAmount') {
      return;
    }
    
    isUpdatingRef.current = true;
    sourceOfChangeRef.current = 'downPayment';
    
    // Calculate loan amount: Car Selling Price - Down Payment
    const calculatedLoanAmount = carSellingPrice - downPayment;
    const newLoanAmount = Math.max(minLoanAmount, roundToInterval(calculatedLoanAmount));
    
    setLoanAmount(newLoanAmount);
    
    setTimeout(() => {
      isUpdatingRef.current = false;
      sourceOfChangeRef.current = null;
    }, 10);
  }, [downPayment, carSellingPrice, minLoanAmount]);

  // Calculate EMI and other values
  useEffect(() => {
    // Principal amount is the loan amount itself (the amount being borrowed)
    const principalAmount = Math.max(0, loanAmount);
    
    // Prevent division by zero
    if (principalAmount === 0 || loanDuration === 0) {
      setPrincipal(0);
      setEmi(0);
      setTotalPayable(0);
      setInterest(0);
      if (onEMIChangeRef.current && typeof onEMIChangeRef.current === 'function') {
        onEMIChangeRef.current(0);
      }
      return;
    }

    const monthlyRate = rateOfInterest / (12 * 100);
    const emiAmount = principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDuration) / (Math.pow(1 + monthlyRate, loanDuration) - 1);
    
    const totalAmount = emiAmount * loanDuration;
    const interestAmount = totalAmount - principalAmount;

    setPrincipal(principalAmount);
    const calculatedEMI = Math.round(emiAmount);
    setEmi(calculatedEMI);
    setTotalPayable(Math.round(totalAmount));
    setInterest(Math.round(interestAmount));
    
    // Notify parent component of EMI change
    if (onEMIChangeRef.current && typeof onEMIChangeRef.current === 'function') {
      onEMIChangeRef.current(calculatedEMI);
    }
  }, [loanAmount, loanDuration, rateOfInterest]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  // Calculate percentage for progress bars
  const getProgressPercentage = (value, min, max) => {
    if (max === min) return 0;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  // Draggable slider hook
  const useDraggableSlider = (value, setValue, min, maxOrGetMax, additionalValidator = null, useInterval = false, interval = 2000) => {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const lastSetValueRef = useRef(value);
    const valueRef = useRef(value);
    
    // Support both static max value and dynamic function
    const getMax = typeof maxOrGetMax === 'function' ? maxOrGetMax : () => maxOrGetMax;

    // Keep valueRef in sync with value prop (without causing re-renders)
    valueRef.current = value;

    const updateValue = useCallback((clientX) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
      const max = getMax();
      let newValue = min + (percentage / 100) * (max - min);
      
      // Round to interval if specified (for loan amount and down payment)
      if (useInterval) {
        newValue = roundToInterval(newValue, interval);
        newValue = Math.max(min, Math.min(max, newValue)); // Ensure within bounds
      }
      
      // Apply additional validation if provided (only once)
      let finalValue;
      if (additionalValidator) {
        finalValue = additionalValidator(newValue);
      } else if (useInterval) {
        finalValue = newValue; // Already rounded to interval
      } else {
        finalValue = Math.round(newValue);
      }
      
      // Only update if value actually changed to prevent infinite loops
      // Compare with both the last set value and current value to handle external updates
      if (lastSetValueRef.current !== finalValue && valueRef.current !== finalValue) {
        lastSetValueRef.current = finalValue;
        setValue(finalValue);
      }
    }, [min, getMax, setValue, additionalValidator, useInterval, interval]);
    
    // Update lastSetValueRef when value changes externally (from typing in input) to keep slider in sync
    useEffect(() => {
      if (!isDragging) {
        lastSetValueRef.current = value;
        valueRef.current = value;
      }
    }, [isDragging, value]);

    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      updateValue(e.clientX);
    };

    const handleMouseMove = useCallback((e) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    }, [isDragging, updateValue]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.body.style.userSelect = '';
          document.body.style.cursor = '';
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Touch events for mobile
    const handleTouchStart = (e) => {
      e.preventDefault();
      setIsDragging(true);
      updateValue(e.touches[0].clientX);
    };

    const handleTouchMove = useCallback((e) => {
      if (isDragging) {
        updateValue(e.touches[0].clientX);
      }
    }, [isDragging, updateValue]);

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging, handleTouchMove, handleTouchEnd]);

    return {
      sliderRef,
      isDragging,
      handleMouseDown,
      handleTouchStart,
    };
  };

  // Wrapper functions to track source of change
  // Use refs to access current values without causing dependency issues
  const loanAmountRef = useRef(loanAmount);
  const downPaymentRef = useRef(downPayment);
  
  useEffect(() => {
    loanAmountRef.current = loanAmount;
  }, [loanAmount]);
  
  useEffect(() => {
    downPaymentRef.current = downPayment;
  }, [downPayment]);

  const setLoanAmountWithSource = useCallback((newValue) => {
    // Skip update if value hasn't changed
    if (loanAmountRef.current === newValue) {
      return;
    }
    
    // Only set source if we're not already updating and it's a user-initiated change
    if (!isUpdatingRef.current) {
      sourceOfChangeRef.current = 'loanAmount';
    }
    setLoanAmount(newValue);
  }, []);

  const setDownPaymentWithSource = useCallback((newValue) => {
    // Skip update if value hasn't changed
    if (downPaymentRef.current === newValue) {
      return;
    }
    
    // Only set source if we're not already updating and it's a user-initiated change
    if (!isUpdatingRef.current) {
      sourceOfChangeRef.current = 'downPayment';
    }
    setDownPayment(newValue);
  }, []);

  // Create draggable sliders with validators
  // Validators only ensure values are within absolute min/max bounds
  // The useEffect hooks will handle the constraint (loanAmount + downPayment = carSellingPrice)
  const loanAmountSlider = useDraggableSlider(
    loanAmount,
    setLoanAmountWithSource,
    minLoanAmount,
    maxLoanAmount, // Fixed max: car selling price
    (value) => {
      // Only ensure value is within absolute bounds and rounded to interval
      return Math.max(minLoanAmount, Math.min(roundToInterval(value), maxLoanAmount));
    },
    true, // Use 2000 interval
    2000
  );

  const downPaymentSlider = useDraggableSlider(
    downPayment,
    setDownPaymentWithSource,
    minDownPayment,
    maxDownPayment, // Fixed max: car selling price - 100000
    (value) => {
      // Only ensure value is within absolute bounds and rounded to interval
      return Math.max(minDownPayment, Math.min(roundToInterval(value), maxDownPayment));
    },
    true, // Use 2000 interval
    2000
  );

  const loanDurationSlider = useDraggableSlider(
    loanDuration,
    setLoanDuration,
    minLoanDuration,
    maxLoanDuration
  );

  const roiSlider = useDraggableSlider(
    rateOfInterest,
    setRateOfInterest,
    minROI,
    maxROI,
    (value) => Math.round(value * 100) / 100 // Round to 2 decimal places
  );

  // Handle progress bar clicks (fallback for non-draggable interaction)
  const handleProgressClick = (event, setter, min, max, additionalValidator = null, useInterval = false, interval = 2000) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    let newValue = min + (percentage / 100) * (max - min);
    
    // Round to interval if specified
    if (useInterval) {
      newValue = roundToInterval(newValue, interval);
    }
    
    if (additionalValidator) {
      newValue = additionalValidator(newValue);
    } else if (!useInterval) {
      // For ROI, round to 2 decimals; otherwise round to integer
      if (min >= 10 && max <= 18) {
        newValue = Math.round(newValue * 100) / 100; // ROI: 2 decimals
      } else {
        newValue = Math.round(newValue); // Other values: integer
      }
    }
    
    setter(newValue);
  };

  // Handle input changes - ensures sliders update when text fields are edited
  const handleInputChange = (setter, min, max, additionalValidator, isDecimal = false, useInterval = false, interval = 2000) => (event) => {
    const rawValue = event.target.value;
    if (rawValue === '') {
      const defaultValue = useInterval ? roundToInterval(min, interval) : min;
      setter(defaultValue);
      return;
    }
    
    let value = isDecimal ? parseFloat(rawValue) : parseInt(rawValue);
    if (isNaN(value)) return;
    
    // Round to interval if specified (for loan/down payment)
    if (useInterval) {
      value = roundToInterval(value, interval);
    }
    
    // For decimal values (ROI), round to 2 decimal places if no interval specified
    if (isDecimal && !useInterval && interval === 0.01) {
      value = Math.round(value * 100) / 100;
    }
    
    if (value >= min && value <= max) {
      // Apply additional validation if provided (e.g., down payment shouldn't exceed loan amount)
      if (additionalValidator) {
        value = additionalValidator(value);
      }
      setter(value);
    } else if (value < min) {
      const finalMin = useInterval ? roundToInterval(min, interval) : (isDecimal && !useInterval ? Math.round(min * 100) / 100 : min);
      setter(finalMin);
    } else if (value > max) {
      let finalValue = useInterval ? roundToInterval(max, interval) : (isDecimal && !useInterval ? Math.round(max * 100) / 100 : max);
      if (additionalValidator) {
        finalValue = additionalValidator(finalValue);
      }
      setter(finalValue);
    }
  };

  // Validator for down payment - ensure it doesn't exceed loan amount
  const validateDownPayment = (value) => {
    return value <= loanAmount;
  };

  // Donut chart data
  const donutData = {
    principal: principal,
    interest: interest,
    total: totalPayable
  };

  const principalPercentage = (donutData.principal / donutData.total) * 100;
  const interestPercentage = (donutData.interest / donutData.total) * 100;

  return (
    <div className="hdTile rounded-3 p-4 mb-4 bg-white">
      <h6 className="fsSize-7-5 fw-bold loan_font  mb-4">
        Car<span className="acc-osa fw-semibold">osa</span> Loan Calculator
      </h6>
      
      <Row>
        {/* Left Column - Input Controls */}
        <Col lg={6}>
          {/* Loan Amount */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Loan Amount</label>
            <div className="progress-container position-relative">
              <div 
                ref={loanAmountSlider.sliderRef}
                className="progress-bar-custom"
                onMouseDown={loanAmountSlider.handleMouseDown}
                onTouchStart={loanAmountSlider.handleTouchStart}
                onClick={(e) => {
                  if (!loanAmountSlider.isDragging) {
                    handleProgressClick(e, setLoanAmountWithSource, minLoanAmount, maxLoanAmount, (value) => {
                      return Math.max(minLoanAmount, Math.min(roundToInterval(value), maxLoanAmount));
                    }, true, 2000);
                  }
                }}
                style={{ cursor: loanAmountSlider.isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="progress-fill"
                  style={{
                    width: `${getProgressPercentage(loanAmount, minLoanAmount, maxLoanAmount)}%`,
                    transition: loanAmountSlider.isDragging ? 'none' : 'width 0.1s ease'
                  }}
                >
                  <div className="progress-thumb" style={{ cursor: loanAmountSlider.isDragging ? 'grabbing' : 'grab' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fSize-3 text-muted">₹{formatCurrency(minLoanAmount)}</span>
                <input
                  type="number"
                  value={loanAmount || 0}
                  onChange={handleInputChange(setLoanAmountWithSource, minLoanAmount, maxLoanAmount, (value) => {
                    return Math.max(minLoanAmount, Math.min(roundToInterval(value), maxLoanAmount));
                  }, false, true, 2000)}
                  className="form-control form-control-sm text-center fw-semibold"
                  style={{ width: '120px', fontSize: '14px' }}
                  min={minLoanAmount}
                  max={maxLoanAmount}
                  step="2000"
                />
                <span className="fSize-3 text-muted">₹{formatCurrency(maxLoanAmount)}</span>
              </div>
            </div>
          </div>

          {/* Down Payment */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Down Payment</label>
            <div className="progress-container position-relative">
              <div 
                ref={downPaymentSlider.sliderRef}
                className="progress-bar-custom"
                onMouseDown={downPaymentSlider.handleMouseDown}
                onTouchStart={downPaymentSlider.handleTouchStart}
                onClick={(e) => {
                  if (!downPaymentSlider.isDragging) {
                    handleProgressClick(e, setDownPaymentWithSource, minDownPayment, maxDownPayment, (value) => {
                      return Math.max(minDownPayment, Math.min(roundToInterval(value), maxDownPayment));
                    }, true, 2000);
                  }
                }}
                style={{ cursor: downPaymentSlider.isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="progress-fill"
                  style={{
                    width: `${getProgressPercentage(downPayment, minDownPayment, maxDownPayment)}%`,
                    transition: downPaymentSlider.isDragging ? 'none' : 'width 0.1s ease'
                  }}
                >
                  <div className="progress-thumb" style={{ cursor: downPaymentSlider.isDragging ? 'grabbing' : 'grab' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fSize-3 text-muted">₹{formatCurrency(minDownPayment)}</span>
                <input
                  type="number"
                  value={downPayment || 0}
                  onChange={handleInputChange(setDownPaymentWithSource, minDownPayment, maxDownPayment, (value) => {
                    return Math.max(minDownPayment, Math.min(roundToInterval(value), maxDownPayment));
                  }, false, true, 2000)}
                  className="form-control form-control-sm text-center fw-semibold"
                  style={{ width: '120px', fontSize: '14px' }}
                  min={minDownPayment}
                  max={maxDownPayment}
                  step="2000"
                />
                <span className="fSize-3 text-muted">₹{formatCurrency(maxDownPayment)}</span>
              </div>
            </div>
          </div>

          {/* Loan Duration */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Loan Duration (Months)</label>
            <div className="progress-container position-relative">
              <div 
                ref={loanDurationSlider.sliderRef}
                className="progress-bar-custom"
                onMouseDown={loanDurationSlider.handleMouseDown}
                onTouchStart={loanDurationSlider.handleTouchStart}
                onClick={(e) => {
                  if (!loanDurationSlider.isDragging) {
                    handleProgressClick(e, setLoanDuration, minLoanDuration, maxLoanDuration);
                  }
                }}
                style={{ cursor: loanDurationSlider.isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="progress-fill"
                  style={{
                    width: `${getProgressPercentage(loanDuration, minLoanDuration, maxLoanDuration)}%`,
                    transition: loanDurationSlider.isDragging ? 'none' : 'width 0.1s ease'
                  }}
                >
                  <div className="progress-thumb" style={{ cursor: loanDurationSlider.isDragging ? 'grabbing' : 'grab' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fSize-3 text-muted">{minLoanDuration}</span>
                <input
                  type="number"
                  value={loanDuration}
                  onChange={handleInputChange(setLoanDuration, minLoanDuration, maxLoanDuration)}
                  className="form-control form-control-sm text-center fw-semibold"
                  style={{ width: '120px', fontSize: '14px' }}
                  min={minLoanDuration}
                  max={maxLoanDuration}
                />
                <span className="fSize-3 text-muted">{maxLoanDuration}</span>
              </div>
            </div>
          </div>

          {/* Rate of Interest */}
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Rate of Interest (ROI)</label>
            <div className="progress-container position-relative">
              <div 
                ref={roiSlider.sliderRef}
                className="progress-bar-custom"
                onMouseDown={roiSlider.handleMouseDown}
                onTouchStart={roiSlider.handleTouchStart}
                onClick={(e) => {
                  if (!roiSlider.isDragging) {
                    handleProgressClick(e, setRateOfInterest, minROI, maxROI, (value) => Math.round(value * 100) / 100);
                  }
                }}
                style={{ cursor: roiSlider.isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="progress-fill"
                  style={{
                    width: `${getProgressPercentage(rateOfInterest, minROI, maxROI)}%`,
                    transition: roiSlider.isDragging ? 'none' : 'width 0.1s ease'
                  }}
                >
                  <div className="progress-thumb" style={{ cursor: roiSlider.isDragging ? 'grabbing' : 'grab' }} />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="fSize-3 text-muted">{minROI}%</span>
                <input
                  type="number"
                  value={rateOfInterest}
                  onChange={handleInputChange(setRateOfInterest, minROI, maxROI, (value) => Math.round(value * 100) / 100, true, false, 0.01)}
                  className="form-control form-control-sm text-center fw-semibold"
                  style={{ width: '120px', fontSize: '14px' }}
                  min={minROI}
                  max={maxROI}
                  step="0.01"
                />
                <span className="fSize-3 text-muted">{maxROI}%</span>
              </div>
            </div>
          </div>

          {/* Apply Loan Button */}
          <div className="d-flex justify-md-content-end justify-content-center">
            <Button className="btn-apply-loan fSize-3 fw-medium px-4 py-2 mb-md-0 mb-3 rounded-2">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="me-2" />
              APPLY LOAN
            </Button>
          </div>
        </Col>

        {/* Right Column - Results */}
        <Col lg={6}>
          {/* Estimated EMI */}
          <div className="mb-4 text-center">
            <h6 className="estimated-emi-title fw-semibold mb-2">Estimated EMI</h6>
            <h3 className="estimated-emi-value fSize-11 fw-bold mb-0">
              ₹{formatCurrency(emi)}/month
            </h3>
          </div>

          {/* Donut Chart */}
          <div className="donut-chart-container mb-4 d-flex justify-content-center">
            <div className="position-relative">
              <svg width="200" height="200" className="position-absolute">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e9ecef"
                  strokeWidth="20"
                />
                {/* Principal segment */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#2a3a92"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 80 * (principalPercentage / 100)} ${2 * Math.PI * 80}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                />
                {/* Interest segment */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ff6b35"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 80 * (interestPercentage / 100)} ${2 * Math.PI * 80}`}
                  strokeDashoffset={`-${2 * Math.PI * 80 * (principalPercentage / 100)}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              {/* Center text */}
              <div className="donut-chart-center-positioning">
                <h6 className="donut-chart-center-text fw-semibold mb-1">Total Payable</h6>
                <h4 className="donut-chart-center-value fsSize-2 fw-semibold mb-0">
                  ₹{formatCurrency(totalPayable)}
                </h4>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <Row className="g-2">
            <Col xs={12}>
              <div className="summary-card-principal summary-card p-2 rounded-2 text-center">
                <h6 className="fSize-4 fw-medium mb-1">Principal <span>₹{formatCurrency(principal)}</span></h6>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="summary-card-interest summary-card p-2 rounded-2 text-center">
                <h6 className="fSize-4 fw-medium mb-1">Interest <span>₹{formatCurrency(interest)}</span></h6>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="summary-card-roi summary-card p-2 rounded-2 text-center">
                <h6 className="fSize-4 fw-medium mb-1">ROI <span>{rateOfInterest.toFixed(2)}%</span></h6>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <p className="m-0 text-black" style={{paddingTop: '40px'}}> <span className="text-black fw-semibold">Note:</span> Final loan rate and amount depend on your credit score and profile.</p>
    </div>
  );
};

export default CarosaLoanCalculator;
