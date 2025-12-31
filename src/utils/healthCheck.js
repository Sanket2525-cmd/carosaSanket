/**
 * Health check utility to test backend connectivity
 */

import { API_BASE_URL } from '../config/environment';

/**
 * Check if the backend API is accessible
 * @returns {Promise<Object>} Health check result
 */
export const checkBackendHealth = async () => {
  try {
    console.log('Health check: Testing backend connectivity...');
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/keep-alive`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Health check response status:', response.status);
    console.log('Health check response headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response from backend:', text.substring(0, 500));
      return {
        success: false,
        error: 'Backend returned non-JSON response',
        status: response.status,
        contentType: contentType,
        response: text.substring(0, 200)
      };
    }

    const data = await response.json();
    console.log('Health check data:', data);

    return {
      success: true,
      status: response.status,
      data: data
    };

  } catch (error) {
    console.error('Health check failed:', error);
    return {
      success: false,
      error: error.message,
      type: error.name
    };
  }
};

/**
 * Check WebSocket connectivity
 * @returns {Promise<Object>} WebSocket health check result
 */
export const checkWebSocketHealth = async () => {
  return new Promise((resolve) => {
    try {
      const { io } = require('socket.io-client');
      
      console.log('WebSocket health check: Testing connection...');
      const socket = io(API_BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 5000
      });

      const timeout = setTimeout(() => {
        socket.disconnect();
        resolve({
          success: false,
          error: 'WebSocket connection timeout'
        });
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        socket.disconnect();
        resolve({
          success: true,
          socketId: socket.id
        });
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        socket.disconnect();
        resolve({
          success: false,
          error: error.message
        });
      });

    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};

/**
 * Run comprehensive health check
 * @returns {Promise<Object>} Complete health check results
 */
export const runHealthCheck = async () => {
  console.log('=== RUNNING HEALTH CHECK ===');
  
  const backendCheck = await checkBackendHealth();
  const websocketCheck = await checkWebSocketHealth();
  
  const result = {
    timestamp: new Date().toISOString(),
    backend: backendCheck,
    websocket: websocketCheck,
    overall: backendCheck.success && websocketCheck.success
  };
  
  console.log('=== HEALTH CHECK RESULTS ===');
  console.log(JSON.stringify(result, null, 2));
  
  return result;
};

const healthCheck = {
  checkBackendHealth,
  checkWebSocketHealth,
  runHealthCheck
};

export default healthCheck;





