import { API_BASE_URL } from '@/config/environment';

class DeliveryService {
  // Helper function to get CSRF token from cookies
  static getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return '';
  }

  /**
   * Schedule delivery for a car deal
   * @param {number} dealId - The car deal ID
   * @param {string} scheduledAt - ISO date string for delivery schedule
   * @returns {Promise<Object>} API response
   */
  static async scheduleDelivery(dealId, scheduledAt) {
    try {
      const numericDealId = typeof dealId === 'string' ? parseInt(dealId, 10) : Number(dealId);

      if (isNaN(numericDealId) || numericDealId <= 0) {
        return {
          success: false,
          message: 'Invalid deal ID. Please refresh and try again.',
        };
      }

      if (!scheduledAt) {
        return {
          success: false,
          message: 'Please select a date and time for delivery.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/car-deals/${numericDealId}/schedule-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          scheduledAt: scheduledAt,
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return {
          success: false,
          message: `Server error (${response?.status || 'Unknown'}). Please try again.`,
        };
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: 'Delivery scheduled successfully',
        };
      } else {
        return {
          success: false,
          message: data?.message || data?.errors || `Failed to schedule delivery (${response?.status || 'Unknown'})`,
        };
      }
    } catch (error) {
      console.error('Error scheduling delivery:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.',
      };
    }
  }

  /**
   * Confirm delivery (seller only)
   * @param {number} deliveryId - The delivery ID
   * @returns {Promise<Object>} API response
   */
  static async confirmDelivery(deliveryId) {
    try {
      const numericDeliveryId = typeof deliveryId === 'string' ? parseInt(deliveryId, 10) : Number(deliveryId);

      if (isNaN(numericDeliveryId) || numericDeliveryId <= 0) {
        return {
          success: false,
          message: 'Invalid delivery ID. Please refresh and try again.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/car-deals/delivery/${numericDeliveryId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
      });

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return {
          success: false,
          message: `Server error (${response?.status || 'Unknown'}). Please try again.`,
        };
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: 'Delivery confirmed successfully',
        };
      } else {
        return {
          success: false,
          message: data?.message || data?.errors || `Failed to confirm delivery (${response?.status || 'Unknown'})`,
        };
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.',
      };
    }
  }

  /**
   * Cancel delivery for a car deal
   * @param {number} deliveryId - The delivery ID
   * @param {string} reason - Optional reason for cancellation
   * @returns {Promise<Object>} API response
   */
  static async cancelDelivery(deliveryId, reason = '') {
    try {
      const numericDeliveryId = typeof deliveryId === 'string' ? parseInt(deliveryId, 10) : Number(deliveryId);

      if (isNaN(numericDeliveryId) || numericDeliveryId <= 0) {
        return {
          success: false,
          message: 'Invalid delivery ID. Please refresh and try again.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/car-deals/delivery/${numericDeliveryId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          reason: reason,
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return {
          success: false,
          message: `Server error (${response?.status || 'Unknown'}). Please try again.`,
        };
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: 'Delivery cancellation requested successfully',
        };
      } else {
        return {
          success: false,
          message: data?.message || data?.errors || `Failed to cancel delivery (${response?.status || 'Unknown'})`,
        };
      }
    } catch (error) {
      console.error('Error canceling delivery:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.',
      };
    }
  }

  /**
   * Reschedule delivery for a car deal
   * @param {number} deliveryId - The delivery ID
   * @param {string} scheduledAt - ISO date string for new delivery schedule
   * @param {string} reason - Optional reason for rescheduling
   * @returns {Promise<Object>} API response
   */
  static async rescheduleDelivery(deliveryId, scheduledAt, reason = '') {
    try {
      const numericDeliveryId = typeof deliveryId === 'string' ? parseInt(deliveryId, 10) : Number(deliveryId);

      if (isNaN(numericDeliveryId) || numericDeliveryId <= 0) {
        return {
          success: false,
          message: 'Invalid delivery ID. Please refresh and try again.',
        };
      }

      if (!scheduledAt) {
        return {
          success: false,
          message: 'Please select a date and time for delivery.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/car-deals/delivery/${numericDeliveryId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          scheduledAt: scheduledAt,
          reason: reason,
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return {
          success: false,
          message: `Server error (${response?.status || 'Unknown'}). Please try again.`,
        };
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: 'Delivery reschedule requested successfully',
        };
      } else {
        return {
          success: false,
          message: data?.message || data?.errors || `Failed to reschedule delivery (${response?.status || 'Unknown'})`,
        };
      }
    } catch (error) {
      console.error('Error rescheduling delivery:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.',
      };
    }
  }
}

export default DeliveryService;

