// Lead Service for API integration
import { API_BASE_URL } from '../config/environment';

class LeadService {
  // Helper function to get CSRF token from cookies
  static getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let cookie of cookieArray) {
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  /**
   * Make API request with common headers
   */
  static async makeRequest(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': this.getCsrfToken(),
        ...options.headers
      },
      credentials: 'include',
      ...options
    };

    return fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
  }

  /**
   * Initiate a lead - sends OTP to user's phone
   * @param {Object} leadData - Lead data containing fullName, phoneNumber, city, carTitle, carVariant, carId
   * @returns {Promise<Object>} API response with token and expiresAt
   */
  static async initiateLead(leadData) {
    try {
      console.log('🚀 Initiating lead with data:', leadData);

      // Prepare request body according to backend validation
      const requestBody = {
        fullName: leadData.fullName?.trim() || '',
        phoneNumber: leadData.phoneNumber?.trim() || '',
        source: 'WEBSITE',
        notes: 'Please call back'
      };

      // Handle optional fields - only include if they have valid values
      // Joi's .optional() doesn't accept null, so we omit the field entirely if it's null/empty
      if (leadData.city) {
        const trimmedCity = String(leadData.city).trim();
        if (trimmedCity) {
          requestBody.city = trimmedCity;
        }
      }

      if (leadData.carTitle) {
        const trimmedCarTitle = String(leadData.carTitle).trim();
        if (trimmedCarTitle) {
          requestBody.carTitle = trimmedCarTitle;
        }
      }

      if (leadData.carVariant) {
        const trimmedCarVariant = String(leadData.carVariant).trim();
        if (trimmedCarVariant) {
          requestBody.carVariant = trimmedCarVariant;
        }
      }

      // carId must be a number (integer, positive) - only include if valid
      if (leadData.carId) {
        const carIdNum = typeof leadData.carId === 'string' 
          ? parseInt(leadData.carId, 10) 
          : Number(leadData.carId);
        
        // Only include if it's a valid positive integer
        if (!isNaN(carIdNum) && carIdNum > 0 && Number.isInteger(carIdNum)) {
          requestBody.carId = carIdNum;
        }
      }

      console.log('📤 Sending request body:', requestBody);

      const response = await this.makeRequest('/api/leads/initiate', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract detailed error message from validation errors if available
        let errorMessage = data.message || 'Failed to initiate lead';
        if (data.data && typeof data.data === 'object') {
          // If validation errors are present, show them
          const errorDetails = Object.values(data.data).flat().join(', ');
          if (errorDetails) {
            errorMessage = errorDetails;
          }
        }
        throw new Error(errorMessage);
      }

      console.log('✅ Lead initiated successfully:', data);
      return {
        success: true,
        data: data.data,
        message: data.message || 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('❌ Error initiating lead:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  }

  /**
   * Verify OTP and create the lead
   * @param {string} tokenId - Token ID received from initiateLead
   * @param {string} code - OTP code entered by user
   * @returns {Promise<Object>} API response with created lead
   */
  static async verifyLead(tokenId, code) {
    try {
      console.log('🔐 Verifying OTP for token:', tokenId);

      const response = await this.makeRequest(`/api/leads/verify/${tokenId}`, {
        method: 'POST',
        body: JSON.stringify({
          code: code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      console.log('✅ Lead verified and created successfully:', data);
      return {
        success: true,
        data: data.data,
        message: data.message || 'Lead created successfully'
      };
    } catch (error) {
      console.error('❌ Error verifying lead:', error);
      return {
        success: false,
        message: error.message || 'Invalid OTP. Please try again.'
      };
    }
  }
}

export default LeadService;

