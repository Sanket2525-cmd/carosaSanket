const roundToInterval = (value, interval = 2000) => {
  return Math.round(value / interval) * interval;
};

/**
 * Extract numeric value from price (handle both number and formatted string)
 * @param {number|string} price - The price value
 * @returns {number} Numeric price value
 */
const getNumericPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    
    const cleaned = price.replace(/[₹,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

/**
 * Calculate EMI based on principal amount, rate of interest, and loan duration
 * @param {number} principalAmount - The loan amount
 * @param {number} rateOfInterest - Annual rate of interest (e.g., 10.49 for 10.49%)
 * @param {number} loanDuration - Loan duration in months
 * @returns {number} Calculated EMI amount (rounded)
 */
export const calculateEMI = (principalAmount, rateOfInterest, loanDuration) => {
  if (principalAmount === 0 || loanDuration === 0) return 0;
  
  const monthlyRate = rateOfInterest / (12 * 100);
  const emiAmount = principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDuration) / (Math.pow(1 + monthlyRate, loanDuration) - 1);
  
  return Math.round(emiAmount);
};

/**
 * Calculate default EMI based on car selling price
 * Uses default values: 20% down payment, 80% loan, 36 months, 10.49% ROI
 * @param {number|string} sellingPrice - The car selling price
 * @returns {number} Calculated EMI amount
 */
export const calculateDefaultEMI = (sellingPrice) => {
  const carSellingPrice = getNumericPrice(sellingPrice);
  
  if (!carSellingPrice || carSellingPrice === 0) return 0;
  
  const minLoanAmount = 100000;
  const maxDownPaymentCalc = carSellingPrice - minLoanAmount;
  
  // Down Payment: 20% of car selling price (rounded to nearest ₹2000), but capped at maxDownPayment
  const downPayment = Math.min(roundToInterval(carSellingPrice * 0.2), maxDownPaymentCalc);
  
  // Loan Amount: Car selling price - Down Payment (80% of car selling price), but at least minLoanAmount
  const loanAmount = Math.max(minLoanAmount, roundToInterval(carSellingPrice - downPayment));
  
  // Default values: 36 months, 10.49% ROI
  const loanDuration = 36;
  const rateOfInterest = 10.49;
  
  return calculateEMI(loanAmount, rateOfInterest, loanDuration);
};

const emiCalculator = {
  calculateEMI,
  calculateDefaultEMI,
  getNumericPrice
};

export default emiCalculator;



