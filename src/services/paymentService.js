import { API_BASE_URL } from '@/config/environment';

class PaymentService {
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
   * Create payment order
   * @param {number} amount - Amount in rupees (e.g., 0 for ₹0)
   * @param {number} carDealId - The car deal ID
   * @param {string} type - Payment type: 'TESTDRIVE' (for initial booking) or 'BOOKINGTOKEN' (for 20% after test drive)
   * @returns {Promise<Object>} API response with order details
   */
  static async createPaymentOrder(amount, carDealId, type) {
    try {
      // Validate inputs
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      const numericCarDealId = typeof carDealId === 'string' ? parseInt(carDealId, 10) : Number(carDealId);

      if (isNaN(numericAmount) || numericAmount < 0) {
        return {
          success: false,
          message: 'Invalid amount. Amount must be a number >= 0.',
        };
      }

      if (isNaN(numericCarDealId) || numericCarDealId <= 0) {
        return {
          success: false,
          message: 'Invalid deal ID. Please refresh and try again.',
        };
      }

      // Validate type parameter
      if (!type || (type !== 'TESTDRIVE' && type !== 'BOOKINGTOKEN')) {
        return {
          success: false,
          message: 'Invalid payment type. Must be TESTDRIVE or BOOKINGTOKEN.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: Math.floor(numericAmount), // Ensure integer
          carDealId: numericCarDealId,
          type: type,
        }),
      });

      // Check if response is ok before parsing JSON
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
          message: 'Payment order created successfully',
        };
      } else {
        // Log detailed error for debugging
        console.error('Payment order creation failed:', {
          status: response?.status || 'Unknown',
          statusText: response?.statusText || 'Unknown',
          data: data,
          requestBody: { amount: Math.floor(numericAmount), carDealId: numericCarDealId, type: 'TESTDRIVE' }
        });
        return {
          success: false,
          message: data?.message || data?.errors || `Failed to create payment order (${response?.status || 'Unknown'})`,
        };
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.',
      };
    }
  }

  /**
   * Initialize Razorpay checkout
   * @param {Object} orderData - Order data from createPaymentOrder
   * @param {Function} onSuccess - Callback on payment success
   * @param {Function} onFailure - Callback on payment failure
   */
  static initializeRazorpayCheckout(orderData, onSuccess, onFailure) {
    // If it's a free payment (amount 0), skip Razorpay and call success directly
    if (orderData.isFree || orderData.amount === 0) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: orderData.orderId,
          razorpay_order_id: orderData.orderId,
          razorpay_signature: 'free_booking',
        });
      }
      return Promise.resolve();
    }

    // Load Razorpay script if not already loaded
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.openRazorpayCheckout(orderData, onSuccess, onFailure);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.openRazorpayCheckout(orderData, onSuccess, onFailure);
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Verify payment with backend after Razorpay success
   * @param {string} orderId - Razorpay order ID
   * @param {string} paymentId - Razorpay payment ID
   * @param {string} signature - Razorpay signature
   * @returns {Promise<Object>} Verification result
   */
  static async verifyPayment(orderId, paymentId, signature) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Payment verified successfully',
        };
      } else {
        return {
          success: false,
          message: data?.message || 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        message: error.message || 'Network error during verification',
      };
    }
  }

  /**
   * Open Razorpay checkout modal
   * @param {Object} orderData - Order data from createPaymentOrder
   * @param {Function} onSuccess - Callback on payment success
   * @param {Function} onFailure - Callback on payment failure
   */
  static openRazorpayCheckout(orderData, onSuccess, onFailure) {
    const { orderId, amount, razorpayKey } = orderData;
    const PaymentServiceClass = PaymentService;

    const options = {
      key: razorpayKey,
      amount: amount, // Amount in paisa
      currency: 'INR',
      name: 'Carosa',
      description: 'Booking Token Payment',
      order_id: orderId,
      handler: async function (response) {
        // Payment successful - verify immediately with backend
        console.log('Payment successful, verifying with backend:', response);
        
        try {
          const verifyResult = await PaymentServiceClass.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verifyResult.success) {
            console.log('Payment verified successfully');
            if (onSuccess) {
              onSuccess(response);
            }
          } else {
            // Verification failed, but payment succeeded in Razorpay
            // Webhook will handle status update as source of truth
            console.warn('Verification failed, webhook will update status:', verifyResult.message);
            if (onSuccess) {
              onSuccess(response);
            }
          }
        } catch (verifyError) {
          // Network error during verification
          // Payment succeeded in Razorpay, webhook will update status
          console.error('Error during verification, webhook will update status:', verifyError);
          if (onSuccess) {
            onSuccess(response);
          }
        }
      },
      prefill: {
        // Pre-fill user details if available
      },
      notes: {
        // Additional notes
      },
      theme: {
        color: '#2A3A92',
      },
      modal: {
        ondismiss: function () {
          // User closed the modal
          if (onFailure) {
            onFailure({ error: { description: 'Payment cancelled by user' } });
          }
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      // Payment failed
      console.error('Payment failed:', response);
      if (onFailure) {
        onFailure(response);
      }
    });

    razorpay.open();
  }
}

export default PaymentService;

