// Test Drive Service for API integration
import { API_BASE_URL } from '../config/environment';

class TestDriveService {
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
   * Schedule a test drive
   * @param {Object} testDriveData - Test drive data
   * @param {number} testDriveData.carId - Car ID
   * @param {number} testDriveData.carDealId - Car Deal ID (optional)
   * @param {string} testDriveData.scheduledAt - Scheduled date/time (ISO string)
   * @param {string} testDriveData.notes - Optional notes
   * @returns {Promise<Object>} API response
   */
  static async scheduleTestDrive({ carId, carDealId, scheduledAt, notes = null }) {
    try {
      const response = await this.makeRequest('/api/test-drives', {
        method: 'POST',
        body: JSON.stringify({
          carId: parseInt(carId, 10),
          carDealId: carDealId ? parseInt(carDealId, 10) : null,
          scheduledAt,
          notes,
        }),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Test drive scheduled successfully',
      };
    } catch (error) {
      console.error('Error scheduling test drive:', error);
      return {
        success: false,
        error: error.message || 'Failed to schedule test drive',
        data: null,
      };
    }
  }

  /**
   * Cancel a test drive
   * @param {number} testDriveId - Test drive ID
   * @param {string} reason - Optional reason for cancellation
   * @returns {Promise<Object>} API response
   */
  static async cancelTestDrive(testDriveId, reason = null) {
    try {
      const requestBody = reason ? { reason } : {};
      const response = await this.makeRequest(`/api/test-drives/${testDriveId}/cancel`, {
        method: 'POST',
        body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : undefined,
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Test drive cancelled successfully',
      };
    } catch (error) {
      console.error('Error cancelling test drive:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel test drive',
        data: null,
      };
    }
  }

  /**
   * Reschedule a test drive
   * @param {number} testDriveId - Test drive ID
   * @param {string} scheduledAt - New scheduled date/time (ISO string)
   * @param {string} reason - Optional reason for rescheduling
   * @returns {Promise<Object>} API response
   */
  static async rescheduleTestDrive(testDriveId, scheduledAt, reason = null) {
    try {
      const response = await this.makeRequest(`/api/test-drives/${testDriveId}/reschedule`, {
        method: 'POST',
        body: JSON.stringify({
          scheduledAt,
          reason,
        }),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Test drive rescheduled successfully',
      };
    } catch (error) {
      console.error('Error rescheduling test drive:', error);
      return {
        success: false,
        error: error.message || 'Failed to reschedule test drive',
        data: null,
      };
    }
  }

  /**
   * Confirm a test drive (seller/dealer only)
   * @param {number} testDriveId - Test drive ID
   * @returns {Promise<Object>} API response
   */
  static async confirmTestDrive(testDriveId) {
    try {
      const response = await this.makeRequest(`/api/test-drives/${testDriveId}/confirm`, {
        method: 'POST',
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Test drive confirmed successfully',
      };
    } catch (error) {
      console.error('Error confirming test drive:', error);
      return {
        success: false,
        error: error.message || 'Failed to confirm test drive',
        data: null,
      };
    }
  }

  /**
   * Get deal status
   * @param {number} dealId - Deal ID
   * @returns {Promise<Object>} API response with deal status
   */
  static async getDealStatus(dealId) {
    try {
      const response = await this.makeRequest(`/api/car-deals/${dealId}`, {
        method: 'GET',
      });

      return {
        success: true,
        data: response.data,
        status: response.data?.status || null,
      };
    } catch (error) {
      console.error('Error fetching deal status:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal status',
        status: null,
      };
    }
  }

  /**
   * Submit test drive feedback (rating and review)
   * @param {number} testDriveId - Test drive ID
   * @param {number} rating - Rating (1-5)
   * @param {string} review - Optional review text
   * @returns {Promise<Object>} API response
   */
  static async submitFeedback(testDriveId, rating, review = null) {
    try {
      const response = await this.makeRequest(`/api/test-drives/${testDriveId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({
          rating: parseInt(rating, 10),
          review: review || null,
        }),
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Feedback submitted successfully',
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit feedback',
        data: null,
      };
    }
  }

  /**
   * Get dealer cars with test drives that have payments made
   * @param {string} search - Optional search term
   * @returns {Promise<Object>} API response with cars and test drive details
   */
  static async getDealerTestDrivesWithPayments(search = '') {
    try {
      const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await this.makeRequest(`/api/test-drives/dealer/with-payments${queryParams}`, {
        method: 'GET',
      });

      return {
        success: true,
        data: response.data,
        message: response.message || 'Cars with test drive payments fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching dealer test drives with payments:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch test drives',
        data: { cars: [], total: 0 },
      };
    }
  }
}

export default TestDriveService;

