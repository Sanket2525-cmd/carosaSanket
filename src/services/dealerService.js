// Dealer Service for API integration
import { API_BASE_URL } from '../config/environment';

class DealerService {
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
   * Get dealer profile for the authenticated dealer
   * @returns {Promise<Object>} API response with dealer profile data
   */
  static async getMyDealerProfile() {
    try {
      console.log('Fetching dealer profile...');
      
      const response = await fetch(`${API_BASE_URL}/api/dealer-profiles/my/profile`, {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Dealer profile response:', data);
      
      if (response.ok) {
        return {
          success: true,
          data: data.data || null,
          message: 'Profile fetched successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch dealer profile',
          status: response.status
        };
      }
    } catch (error) {
      console.error('Error fetching dealer profile:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Update dealer profile for the authenticated dealer
   * @param {number} profileId - The dealer profile ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} API response with updated dealer profile data
   */
  static async updateMyDealerProfile(profileId, updateData) {
    try {
      console.log('Updating dealer profile...', { profileId, updateData });
      
      const response = await fetch(`${API_BASE_URL}/api/dealer-profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      console.log('Update dealer profile response:', data);
      
      if (response.ok) {
        return {
          success: true,
          data: data.data || null,
          message: data.message || 'Profile updated successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update dealer profile',
          status: response.status,
          errors: data.errors || null
        };
      }
    } catch (error) {
      console.error('Error updating dealer profile:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

export default DealerService;





















