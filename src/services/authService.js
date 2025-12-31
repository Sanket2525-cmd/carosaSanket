// Authentication Service for Carosa Frontend
// Handles all authentication-related API calls

import API_CONFIG from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class AuthService {
  // ==================== UTILITY METHODS ====================
  
  /**
   * Get CSRF token from cookies
   */
  static getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
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
   * Fetch CSRF token from backend
   */
  static async fetchCsrfToken() {
    try {
      console.log('🔄 Fetching CSRF token from:', `${API_BASE_URL}/api/keep-alive`);
      
      const response = await fetch(`${API_BASE_URL}/api/keep-alive`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        await response.json(); // This sets the CSRF cookie
        console.log('🔄 CSRF token fetched successfully');
        return true;
      } else {
        console.error('🔄 Failed to fetch CSRF token, status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('🔄 Failed to fetch CSRF token:', error);
      return false;
    }
  }

  /**
   * Make authenticated API request with common headers
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

  // ==================== AUTHENTICATION METHODS ====================

  /**
   * Main authentication method - handles both new and existing users
   * Always hits register API first, which handles both cases
   */
  static async authenticateWithPhone(mobile) {
    try {
      console.log('🚀 Starting phone authentication for:', mobile);
      
      // Always hit register API first (handles both new and existing users)
      const result = await this.registerWithPhone(mobile);
      console.log('🚀 Authentication result:', result);
      
      return result;
    } catch (error) {
      console.error('🚀 Phone authentication error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        isExistingUser: false
      };
    }
  }

  /**
   * Register/Login with phone number (handles both new and existing users)
   */
  static async registerWithPhone(mobile) {
    try {
      console.log('📝 Attempting phone authentication:', mobile);
      
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ mobile })
      });

      console.log('📝 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📝 API error response:', errorText);
        
        // Check if it's a "User already exists" error (400 status)
        if (response.status === 400 && errorText.includes('User already exists')) {
          console.log('📝 User already exists, trying login flow...');
          console.log('📝 Switching from /api/auth/register to /api/auth/login');
          
          // Try the login flow for existing user
          const loginResult = await this.loginExistingUser(mobile);
          console.log('📝 Login result:', loginResult);
          
          if (loginResult.success) {
            console.log('📝 Login successful, returning result');
            return loginResult;
          } else {
            console.log('📝 Login failed, returning error');
            return loginResult;
          }
        }
        
        return {
          success: false,
          message: `Authentication failed with status ${response.status}`,
          isExistingUser: false
        };
      }
      
      const data = await response.json();
      console.log('📝 Authentication response:', data);
      
      if (data.success) {
        return {
          success: true,
          tokenId: data.data.token,
          url: data.data.url,
          isExistingUser: data.data.isExistingUser || false
        };
      } else {
        return {
          success: false,
          message: data.message || 'Authentication failed',
          isExistingUser: false
        };
      }
    } catch (error) {
      console.error('📝 Phone authentication error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        isExistingUser: false
      };
    }
  }

  /**
   * Login with phone number for existing users
   */
  static async loginExistingUser(mobile) {
    try {
      console.log('🔑 Attempting login for existing user:', mobile);
      
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ mobile })
      });

      console.log('🔑 Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔑 Login API error response:', errorText);
        return {
          success: false,
          message: `Login failed with status ${response.status}`,
          isExistingUser: true
        };
      }
      
      const data = await response.json();
      console.log('🔑 Login response:', data);
      
      if (data.success) {
        return {
          success: true,
          tokenId: data.data.token,
          url: data.data.url,
          isExistingUser: true
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
          isExistingUser: true
        };
      }
    } catch (error) {
      console.error('🔑 Login error:', error);
      return {
        success: false,
        message: 'Network error during login. Please try again.',
        isExistingUser: true
      };
    }
  }

  /**
   * Verify OTP - handles both new and existing users
   */
  static async verifyOTP(tokenId, code, isExistingUser = false) {
    try {
      console.log('🔐 Verifying OTP:', { tokenId, isExistingUser });
      
      const response = await this.makeRequest(`/api/auth/verify/${tokenId}`, {
        method: 'POST',
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      console.log('🔐 OTP verification response:', data);
      
      if (response.ok && data.success) {
        console.log('🔐 OTP verification successful, backend should have set accessToken cookie');
        
        // Wait a moment for the cookie to be set by the backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if the accessToken cookie is now present
        const hasAccessToken = document.cookie.includes('accessToken=');
        console.log('🔐 AccessToken cookie after verification:', hasAccessToken);
        
        return {
          success: true,
          user: data.data.user,
          message: data.message || 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'OTP verification failed'
        };
      }
    } catch (error) {
      console.error('🔐 OTP verification error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  }

  /**
   * Regenerate verification token
   */
  static async regenerateToken(tokenId) {
    try {
      const response = await this.makeRequest(`/api/auth/verify/regenerate/${tokenId}`, {
        method: 'PUT'
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          tokenId: data.data.token,
          url: data.data.url
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to regenerate token'
        };
      }
    } catch (error) {
      console.error('🔄 Regenerate token error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Logout user
   */
  static async logout() {
    try {
      const response = await this.makeRequest('/api/auth/logout', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        this.clearUser();
        return {
          success: true,
          message: data.message
        };
      } else {
        return {
          success: false,
          message: data.message || 'Logout failed'
        };
      }
    } catch (error) {
      console.error('🚪 Logout error:', error);
      return {
        success: false,
        message: 'Network error during logout'
      };
    }
  }

  /**
   * Get user profile from API
   */
  static async getProfile() {
    try {
      const response = await this.makeRequest('/api/auth/me', {
        method: 'GET'
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Profile fetched successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch profile'
        };
      }
    } catch (error) {
      console.error('🔍 Get profile error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updateData) {
    try {
      const response = await this.makeRequest('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Profile updated successfully'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update profile'
        };
      }
    } catch (error) {
      console.error('✏️ Update profile error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => cookie.trim().startsWith('accessToken='));
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Set user in localStorage
   */
  static setUser(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  /**
   * Clear user from localStorage
   */
  static clearUser() {
    try {
      // Clear all authentication-related localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
      
      // Also clear any cookies that might be set
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      console.log('🧹 AuthService: Cleared all authentication data from localStorage and cookies');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }

  // ==================== LEGACY METHODS (DEPRECATED) ====================
  // These methods are kept for backward compatibility but should not be used


  /**
   * @deprecated Use registerWithPhone instead
   */
  static async registerWithEmail(email) {
    console.warn('⚠️ registerWithEmail is deprecated. Use registerWithPhone instead.');
    try {
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          tokenId: data.data.token,
          url: data.data.url
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * @deprecated Use verifyOTP instead
   */
  static async loginWithOTP(tokenId, code) {
    console.warn('⚠️ loginWithOTP is deprecated. Use verifyOTP instead.');
    return this.verifyOTP(tokenId, code, true);
  }

  /**
   * @deprecated Not used in current flow
   */
  static async generateLoginCode(email, mobile) {
    console.warn('⚠️ generateLoginCode is deprecated. Use authenticateWithPhone instead.');
    try {
      const response = await this.makeRequest('/api/auth/generate-login-code', {
        method: 'POST',
        body: JSON.stringify({
          email: email ? email.toLowerCase().trim() : undefined,
          mobile: mobile
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          tokenId: data.data.token,
          url: data.data.url
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to generate login code'
        };
      }
    } catch (error) {
      console.error('Generate login code error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

export default AuthService;