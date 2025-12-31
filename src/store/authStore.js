// Authentication Store using Zustand
// Manages authentication state across the application

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isExistingUser: false,

      // ==================== STATE MANAGEMENT ====================
      
      /**
       * Set user and update authentication state
       */
      setUser: (user, token = null) => {
        // Store token in sessionStorage if provided
        if (token && typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('accessToken', token);
            console.log('🔐 Token stored in sessionStorage');
          } catch (e) {
            console.warn('⚠️ Failed to store token:', e);
          }
          // Also attach token to user object for easy access
          if (user && !user.token) {
            user.token = token;
          }
        }
        
        set({ user, isAuthenticated: !!user, error: null });
        if (user) {
          AuthService.setUser(user);
        } else {
          AuthService.clearUser();
          // Clear token on logout
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.removeItem('accessToken');
            } catch (e) {
              console.warn('⚠️ Failed to clear token:', e);
            }
          }
        }
      },

      /**
       * Direct login for dealers with email and password
       */
      directLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔑 Attempting direct login for:', email);
          
          // Normalize email to match backend processing
          const normalizedEmail = email.toLowerCase().trim();
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/direct-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: normalizedEmail, password: password.trim() })
          });

          const data = await response.json();
          
          if (data.success) {
            // Check if user is a dealer
            if (data.data.user.role === 'Dealer') {
              // Store token if provided
              const token = data.data.token;
              get().setUser(data.data.user, token);
              set({ isLoading: false });
              return { success: true, user: data.data.user };
            } else {
              set({ isLoading: false, error: 'This login is only for dealers' });
              return { success: false, message: 'This login is only for dealers' };
            }
          } else {
            set({ isLoading: false, error: data.message });
            return { success: false, message: data.message };
          }
        } catch (error) {
          console.error('🔑 Direct login error:', error);
          const errorMessage = 'Login failed. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Set loading state
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Set error message
       */
      setError: (error) => set({ error }),

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),

      /**
       * Clear all authentication state
       */
      clearAuthState: () => {
        // Clear Zustand state
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null, 
          isExistingUser: false 
        });
        
        // Clear sessionStorage token
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('accessToken');
          } catch (error) {
            console.error('Error clearing sessionStorage token:', error);
          }
        }
        
        // Also clear localStorage manually to ensure complete cleanup
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
          console.log('🧹 AuthStore: Cleared all authentication state and localStorage');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
      },

      // ==================== AUTHENTICATION METHODS ====================

      /**
       * Main authentication method - handles both new and existing users
       */
      authenticateWithPhone: async (mobile) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🚀 AuthStore: Starting phone authentication for:', mobile);
          
          // Fetch CSRF token first
          await AuthService.fetchCsrfToken();
          
          // Call AuthService for authentication
          const result = await AuthService.authenticateWithPhone(mobile);
          
          if (result.success) {
            set({ 
              isLoading: false, 
              isExistingUser: result.isExistingUser 
            });
            return { 
              success: true, 
              tokenId: result.tokenId,
              isExistingUser: result.isExistingUser 
            };
          } else {
            set({ 
              isLoading: false, 
              error: result.message, 
              isExistingUser: result.isExistingUser 
            });
            return { 
              success: false, 
              message: result.message,
              isExistingUser: result.isExistingUser 
            };
          }
        } catch (error) {
          console.error('🚀 AuthStore: Authentication error:', error);
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage, isExistingUser: false });
          return { success: false, message: errorMessage, isExistingUser: false };
        }
      },

      /**
       * Verify OTP and complete authentication
       */
      verifyOTP: async (tokenId, code) => {
        set({ isLoading: true, error: null });
        
        try {
          const { isExistingUser } = get();
          const result = await AuthService.verifyOTP(tokenId, code, isExistingUser);
          
          if (result.success) {
            // Set user and clear temporary state, include token if available
            const token = result.token || null;
            get().setUser(result.user, token);
            set({ 
              isLoading: false, 
              error: null,
              isExistingUser: false // Reset after successful verification
            });
            return { success: true, user: result.user };
          } else {
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage = 'Verification failed. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Regenerate verification token
       */
      regenerateToken: async (tokenId) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await AuthService.regenerateToken(tokenId);
          
          if (result.success) {
            set({ isLoading: false });
            return { success: true, tokenId: result.tokenId };
          } else {
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.logout();
          
          // Clear all authentication state
          get().clearAuthState();
          set({ isLoading: false });
          
          return { success: true, message: 'Logged out successfully' };
        } catch (error) {
          // Even if logout fails on server, clear local state
          get().clearAuthState();
          set({ isLoading: false });
          return { success: true, message: 'Logged out successfully' };
        }
      },

      // ==================== INITIALIZATION & UTILITIES ====================

      /**
       * Initialize authentication state from localStorage
       */
      initializeAuth: () => {
        try {
          // Check Zustand's persisted storage first
          const authData = localStorage.getItem('auth-storage');
          if (authData) {
            const parsed = JSON.parse(authData);
            if (parsed.state && parsed.state.user && parsed.state.isAuthenticated) {
              console.log('🔐 Initializing auth from Zustand store');
              set({ 
                user: parsed.state.user, 
                isAuthenticated: parsed.state.isAuthenticated,
                isLoading: false,
                error: null,
                isExistingUser: parsed.state.isExistingUser || false
              });
              return;
            }
          }
          
          // Fallback to AuthService methods
          const user = AuthService.getCurrentUser();
          const isAuthenticated = AuthService.isAuthenticated();
          
          console.log('🔐 Initializing auth from AuthService');
          set({ 
            user, 
            isAuthenticated: isAuthenticated && !!user,
            isLoading: false,
            error: null,
            isExistingUser: false
          });
        } catch (error) {
          console.error('🔐 Error initializing auth:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: null,
            isExistingUser: false
          });
        }
      },

      /**
       * Force complete auth state refresh
       */
      forceRefreshAuth: () => {
        console.log('🔄 Force refreshing auth state...');
        get().initializeAuth();
      },

      /**
       * Get current authentication state (for debugging)
       */
      getAuthState: () => {
        const state = get();
        console.log('🔍 Current auth state:', {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isLoading: state.isLoading,
          error: state.error,
          isExistingUser: state.isExistingUser
        });
        return state;
      },

      // ==================== LEGACY METHODS (DEPRECATED) ====================
      // These methods are kept for backward compatibility but should not be used

      /**
       * @deprecated Use authenticateWithPhone instead
       */
      registerWithPhone: async (mobile) => {
        console.warn('⚠️ registerWithPhone is deprecated. Use authenticateWithPhone instead.');
        return get().authenticateWithPhone(mobile);
      },

      /**
       * @deprecated Use verifyOTP instead
       */
      loginWithOTP: async (tokenId, code) => {
        console.warn('⚠️ loginWithOTP is deprecated. Use verifyOTP instead.');
        return get().verifyOTP(tokenId, code);
      },

      /**
       * @deprecated Not used in current flow
       */
      registerWithEmail: async (email) => {
        console.warn('⚠️ registerWithEmail is deprecated. Use authenticateWithPhone instead.');
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.fetchCsrfToken();
          const result = await AuthService.registerWithEmail(email);
          
          if (result.success) {
            set({ isLoading: false });
            return { success: true, tokenId: result.tokenId };
          } else {
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * @deprecated Not used in current flow
       */
      generateLoginCode: async (email, mobile) => {
        console.warn('⚠️ generateLoginCode is deprecated. Use authenticateWithPhone instead.');
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.fetchCsrfToken();
          const result = await AuthService.generateLoginCode(email, mobile);
          
          if (result.success) {
            set({ isLoading: false });
            return { success: true, tokenId: result.tokenId };
          } else {
            set({ isLoading: false, error: result.message });
            return { success: false, message: result.message };
          }
        } catch (error) {
          const errorMessage = 'Network error. Please try again.';
          set({ isLoading: false, error: errorMessage });
          return { success: false, message: errorMessage };
        }
      },

      /**
       * @deprecated Use clearAuthState instead
       */
      clearAuth: () => {
        console.warn('⚠️ clearAuth is deprecated. Use clearAuthState instead.');
        get().clearAuthState();
        AuthService.clearUser();
      },

      /**
       * @deprecated Use initializeAuth instead
       */
      refreshAuthState: () => {
        console.warn('⚠️ refreshAuthState is deprecated. Use initializeAuth instead.');
        get().initializeAuth();
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isExistingUser: state.isExistingUser
      }),
    }
  )
);

export default useAuthStore;