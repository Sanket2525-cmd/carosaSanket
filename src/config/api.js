// API Configuration for Carosa Frontend
// This file contains all API-related configuration

import { API_BASE_URL } from './environment';

const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: API_BASE_URL,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      VERIFY: '/api/auth/verify',
      GENERATE_LOGIN_CODE: '/api/auth/generate-login-code',
      REGENERATE_TOKEN: '/api/auth/verify/regenerate',
      LOGOUT: '/api/auth/logout',
      KEEP_ALIVE: '/api/keep-alive'
    },
    
    // Car endpoints
    CARS: {
      PUBLIC: '/api/cars/public',
      OWNED: '/api/cars/owned',
      CREATE: '/api/cars',
      UPDATE: '/api/cars',
      DELETE: '/api/cars'
    },
    
    // User endpoints
    USERS: {
      PROFILE: '/api/users/profile',
      UPDATE: '/api/users'
    },
    
    // Deal endpoints
    DEALS: {
      CREATE: '/api/car-deals',
      GET_ALL: '/api/car-deals',
      GET_MY: '/api/car-deals/my'
    },
    
    // Payment endpoints
    PAYMENTS: {
      CREATE_ORDER: '/api/payment/create-order',
      WEBHOOK: '/api/payment/webhook',
      STATUS: '/api/payment/status'
    },
    
    // Lead endpoints
    LEADS: {
      INITIATE: '/api/leads/initiate',
      VERIFY: '/api/leads/verify'
    }
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    TIMEOUT: 30050, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
  }
};

export default API_CONFIG;
