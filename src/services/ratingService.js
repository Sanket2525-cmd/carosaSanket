// Rating Service for API integration
import { API_BASE_URL } from '../config/environment';

class RatingService {
  /**
   * Get CSRF token from cookies
   */
  static getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  /**
   * Make authenticated request to backend
   */
  static async makeRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Create a rating
   * @param {number} dealId - Car Deal ID
   * @param {number} rating - Rating value (0-5)
   * @param {string} comment - Comment text
   * @param {string} type - Rating type
   * @returns {Promise<Object>} API response
   */
  static async createRating(dealId, rating, comment, type = 'TEST_DRIVE') {
    try {
      const response = await this.makeRequest(`/api/ratings/${dealId}`, {
        method: 'POST',
        body: JSON.stringify({
          carDealId: parseInt(dealId, 10),
          rating: parseFloat(rating),
          comment: comment,
          type: type,
        }),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Rating created successfully',
      };
    } catch (error) {
      console.error('Error creating rating:', error);
      return {
        success: false,
        error: error.message || 'Failed to create rating',
        data: null,
      };
    }
  }
}

export default RatingService;

