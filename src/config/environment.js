// Environment Configuration for Carosa Frontend
// This file handles environment-specific settings

// Get the API base URL from environment or use default
// For development, use live API for model search
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get booking amount from environment or use default fallback to 999
export const BOOKING_AMOUNT = parseInt(process.env.NEXT_PUBLIC_BOOKING_AMOUNT || '999');

// Log the configuration for debugging
console.log('Environment Configuration:');
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- BOOKING_AMOUNT:', BOOKING_AMOUNT);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Export configuration object
export const config = {
  API_BASE_URL,
  BOOKING_AMOUNT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

export default config;

