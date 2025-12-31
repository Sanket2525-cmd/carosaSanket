// Socket Service for Real-time Offer Notifications
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config/environment';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.API_BASE_URL = API_BASE_URL;
    this.isInitialized = false;
  }

  /**
   * Initialize socket connection (singleton pattern)
   */
  async init() {
    // Return existing socket if already initialized and connected
    if (this.socket && this.isConnected) {
      console.log('SocketService: Using existing connected socket');
      return this.socket;
    }

    // Return existing socket if already initialized (even if not connected)
    if (this.socket && this.isInitialized) {
      console.log('SocketService: Using existing socket (reconnecting...)');
      return this.socket;
    }

    // Validate API_BASE_URL
    if (!this.API_BASE_URL) {
      console.error('SocketService: API_BASE_URL is not defined');
      return null;
    }

    // Test server connection first
    console.log('SocketService: Testing server connection...');
    const serverTest = await this.testConnection();
    if (!serverTest) {
      console.error('SocketService: Server connection test failed, skipping socket initialization');
      return null;
    }

    try {
      console.log('SocketService: Connecting to', this.API_BASE_URL);
      console.log('SocketService: Environment:', process.env.NODE_ENV);
      console.log('SocketService: User Agent:', navigator.userAgent);
      
      this.socket = io(this.API_BASE_URL, {
        withCredentials: true,
        transports: ['polling', 'websocket'], // Try polling first, then websocket
        timeout: 20000, // 20 second timeout for live server
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
        autoConnect: true,
        upgrade: true,
        rememberUpgrade: false,
        // Additional options for live server
        path: '/socket.io/',
        query: {
          transport: 'polling'
        }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
        this.isConnected = true;
        this.isInitialized = true;
        this.emit('socket_connected', { socketId: this.socket.id });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
        this.emit('socket_disconnected', { reason });
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
        this.emit('socket_connect_error', { error: error.message });
        
        // Try to reconnect after a delay
        setTimeout(() => {
          if (!this.isConnected) {
            console.log('SocketService: Attempting to reconnect...');
            this.socket.connect();
          }
        }, 5000);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.emit('socket_error', { error: error.message });
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.emit('socket_reconnected', { attemptNumber });
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
        this.emit('socket_reconnect_error', { error: error.message });
      });

      this.socket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed after all attempts');
        this.emit('socket_reconnect_failed');
      });

      this.socket.on('identified', (data) => {
        console.log('Socket identified:', data);
        this.emit('socket_identified', data);
      });

      // Offer-related events
      this.socket.on('offer_submitted', (data) => {
        console.log('Offer submitted notification:', data);
        this.emit('offer_submitted', data);
      });

      this.socket.on('offer_rejected', (data) => {
        console.log('Offer rejected notification:', data);
        this.emit('offer_rejected', data);
      });

      this.socket.on('offer_accepted', (data) => {
        console.log('Offer accepted notification:', data);
        this.emit('offer_accepted', data);
      });

      this.socket.on('counter_offer', (data) => {
        console.log('Counter offer notification:', data);
        this.emit('counter_offer', data);
      });

      return this.socket;
    } catch (error) {
      console.error('Socket initialization error:', error);
      return null;
    }
  }

  /**
   * Identify user with access token
   */
  async identify(accessToken = null) {
    if (!this.socket) {
      // Silent return - socket not initialized is expected during initial load
      return false;
    }

    if (!this.socket.connected) {
      // Silent return - socket not connected is expected during initial load
      return false;
    }

    if (!this.isAuthenticated()) {
      // Silent return - user not authenticated is expected for public pages
      return false;
    }

    let token = accessToken;
    if (!token) {
      // Try to get token from multiple sources
      token = this.getAccessToken();
    }

    // If still no token, try to fetch it from a protected endpoint
    if (!token) {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ [SocketService] No token found locally, attempting to fetch...');
      }
      try {
        // Make a request to get current user - this will include the token in response
        // or we can check response headers/cookies
        const response = await fetch(`${this.API_BASE_URL}/api/auth/me`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.token) {
            token = data.data.token;
            // Store it for future use
            if (typeof window !== 'undefined') {
              try {
                sessionStorage.setItem('accessToken', token);
              } catch (e) {
                // Silent fail - storage might be disabled
              }
            }
          }
        }
      } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ [SocketService] Failed to fetch token:', error);
        }
      }
    }

    if (token) {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [SocketService] Identifying user on socket with token:', token.substring(0, 20) + '...');
      }
      this.socket.emit('identify', { accessToken: token });
      return true;
    } else {
      // Only log errors in development mode when user is authenticated
      // This indicates a real problem - user is logged in but token is missing
      if (process.env.NODE_ENV === 'development' && this.isAuthenticated()) {
        console.warn('⚠️ [SocketService] Cannot identify: authenticated user but no access token found');
      }
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    // Use Zustand store to check authentication
    const authState = useAuthStore.getState();
    return authState.isAuthenticated && !!authState.user;
  }

  /**
   * Check if socket is connected and working
   */
  isSocketWorking() {
    return this.socket && this.isConnected;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isInitialized: this.isInitialized,
      socketId: this.socket?.id || null
    };
  }

  /**
   * Graceful fallback for when socket is not available
   */
  async submitOfferWithFallback(carId, amount, message = null) {
    // Try with socket first
    if (this.isSocketWorking()) {
      return await this.submitOffer(carId, amount, message);
    }
    
    // Fallback to API-only submission
    console.warn('Socket not available, using API-only submission');
    return await this.submitOffer(carId, amount, message);
  }

  /**
   * Test connection to the server
   * Uses cached result to avoid excessive API calls
   */
  async testConnection() {
    // Cache connection test result for 30 seconds
    const cacheKey = 'socket_connection_test_cache';
    const cacheTimestampKey = 'socket_connection_test_timestamp';
    const cacheTTL = 30 * 1000; // 30 seconds
    
    try {
      // Check cache first
      if (typeof window !== 'undefined') {
        const cachedResult = sessionStorage.getItem(cacheKey);
        const cachedTimestamp = sessionStorage.getItem(cacheTimestampKey);
        
        if (cachedResult && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          
          if (now - timestamp < cacheTTL) {
            // Cache is still valid
            return cachedResult === 'true';
          } else {
            // Cache expired, remove it
            sessionStorage.removeItem(cacheKey);
            sessionStorage.removeItem(cacheTimestampKey);
          }
        }
      }
      
      // Make actual request
      const response = await fetch(`${this.API_BASE_URL}/api/keep-alive`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const isOk = response.ok;
      
      // Cache the result
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(cacheKey, isOk.toString());
          sessionStorage.setItem(cacheTimestampKey, Date.now().toString());
        } catch (e) {
          // Silent fail - sessionStorage might be disabled
        }
      }
      
      if (isOk) {
        console.log('✅ Server connection test successful');
        return true;
      } else {
        console.error('❌ Server connection test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Server connection test error:', error);
      return false;
    }
  }

  /**
   * Submit offer and notify seller
   */
  async submitOffer(carId, amount, message = null) {
    // Check authentication first
    if (!this.isAuthenticated()) {
      return {
        success: false,
        message: 'Please log in to submit an offer'
      };
    }

    try {
      // First, submit to new offers API
      const response = await fetch(`${this.API_BASE_URL}/api/offers/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify({
          carId: carId,
          amount: amount,
          message: message
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Emit socket event for real-time notification (if socket is available)
        if (this.socket && this.isConnected) {
          this.socket.emit('offer_submitted', {
            carId: carId,
            dealId: data.data.dealId,
            amount,
            message,
            negotiationId: data.data.negotiationId
          });
        } else {
          console.warn('Socket not connected, offer submitted but no real-time notification sent');
        }

        return {
          success: true,
          data: data.data,
          message: 'Offer submitted successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to submit offer'
        };
      }
    } catch (error) {
      console.error('Submit offer error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Accept offer
   * Uses deal-negotiations endpoint which allows both buyer and seller to accept offers
   */
  async acceptOffer(dealId, negotiationId) {
    // Check authentication first
    if (!this.isAuthenticated()) {
      return {
        success: false,
        message: 'Please log in to accept an offer'
      };
    }

    try {
      // Use deal-negotiations endpoint which allows both buyer and seller to accept
      const response = await fetch(`${this.API_BASE_URL}/api/deal-negotiations/${negotiationId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        credentials: 'include'
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Emit socket event for real-time notification
        this.socket.emit('offer_accepted', {
          dealId,
          negotiationId
        });

        return {
          success: true,
          data: data.data,
          message: 'Offer accepted successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to accept offer'
        };
      }
    } catch (error) {
      console.error('Accept offer error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Reject offer
   */
  async rejectOffer(dealId, negotiationId, reason = null) {
    // Check authentication first
    if (!this.isAuthenticated()) {
      return {
        success: false,
        message: 'Please log in to reject an offer'
      };
    }

    try {
      // Use deal-negotiations endpoint which allows both buyer and seller to reject
      const response = await fetch(`${this.API_BASE_URL}/api/deal-negotiations/${negotiationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify({ reason })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Emit socket event for real-time notification
        this.socket.emit('offer_rejected', {
          dealId,
          negotiationId,
          reason
        });

        return {
          success: true,
          data: data.data,
          message: 'Offer rejected'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to reject offer'
        };
      }
    } catch (error) {
      console.error('Reject offer error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Submit counter offer
   */
  async submitCounterOffer(dealId, amount, message = null) {
    try {
      // Ensure dealId and amount are proper integers
      const carDealId = typeof dealId === 'string' ? parseInt(dealId, 10) : Number(dealId);
      const offerAmount = typeof amount === 'string' ? parseInt(amount.replace(/[₹,\s]/g, ''), 10) : Math.round(Number(amount));
      
      // Validate inputs
      if (!carDealId || isNaN(carDealId) || carDealId <= 0) {
        return {
          success: false,
          message: 'Invalid deal ID. Please refresh and try again.'
        };
      }
      
      if (!offerAmount || isNaN(offerAmount) || offerAmount <= 0) {
        return {
          success: false,
          message: 'Invalid offer amount. Please enter a valid amount.'
        };
      }

      const response = await fetch(`${this.API_BASE_URL}/api/deal-negotiations/${carDealId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify({
          carDealId: carDealId,
          amount: offerAmount,
          message: message || null
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors and other API errors
        const errorMessage = data.message || data.errors || 'Failed to submit counter offer';
        const errorDetails = data.errors ? Object.values(data.errors).join(', ') : errorMessage;
        return {
          success: false,
          message: errorDetails || 'Failed to submit counter offer. Please check your input and try again.'
        };
      }

      if (data.success) {
        this.socket.emit('counter_offer', {
          dealId: carDealId,
          amount: offerAmount,
          message,
          negotiationId: data.data.id
        });

        return {
          success: true,
          data: data.data,
          message: 'Counter offer submitted successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to submit counter offer'
        };
      }
    } catch (error) {
      console.error('Submit counter offer error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please try again.'
      };
    }
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Get CSRF token from cookies
   */
  getCsrfToken() {
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
   * Get access token from multiple sources
   */
  getAccessToken() {
    if (typeof window === 'undefined') return null;

    // 1. Try to get from sessionStorage (stored during login)
    try {
      const sessionToken = sessionStorage.getItem('accessToken');
      if (sessionToken) {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [SocketService] Found token in sessionStorage');
        }
        return sessionToken;
      }
    } catch (e) {
      // Silent fail - sessionStorage might be disabled
    }

    // 2. Try to get from auth store (might have token property)
    try {
      const authState = useAuthStore.getState();
      if (authState.user?.token) {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [SocketService] Found token in auth store');
        }
        return authState.user.token;
      }
    } catch (e) {
      // Silent fail - auth store might not be initialized
    }

    // 3. Try to get from cookies (though httpOnly cookies won't be readable)
    try {
      const name = 'accessToken=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookieArray = decodedCookie.split(';');
      for(let cookie of cookieArray) {
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
          const token = cookie.substring(name.length, cookie.length);
          if (token) {
            // Only log in development mode
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ [SocketService] Found token in cookies');
            }
            return token;
          }
        }
      }
    } catch (e) {
      // Silent fail - cookies might be disabled
    }

    // Only warn in development mode and when user is authenticated
    // It's normal for unauthenticated users to not have a token
    if (process.env.NODE_ENV === 'development' && this.isAuthenticated()) {
      console.warn('⚠️ [SocketService] No access token found in any source (user is authenticated)');
    }
    return null;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
