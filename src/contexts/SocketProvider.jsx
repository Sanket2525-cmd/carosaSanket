"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';
import { useAuthStore } from '../store/authStore';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const initializeSocket = async () => {
      console.log('SocketProvider: Initializing socket connection...');
      console.log('SocketProvider: API_BASE_URL:', socketService.API_BASE_URL);
      
      try {
        // Initialize socket service
        const socketInstance = await socketService.init();
        
        if (!socketInstance) {
          console.error('SocketProvider: Failed to initialize socket');
          setConnectionError('Failed to initialize socket connection');
          return;
        }

        setSocket(socketInstance);
      } catch (error) {
        console.error('SocketProvider: Socket initialization error:', error);
        setConnectionError('Socket initialization failed: ' + error.message);
      }
    };

    initializeSocket();
  }, []);

  // Set up event listeners when socket is available
  useEffect(() => {
    if (!socket) return;

    // Check current connection status immediately
    if (socket.connected && !isConnected) {
      console.log('SocketProvider: Socket already connected, updating state');
      setIsConnected(true);
    } else if (!socket.connected && isConnected) {
      console.log('SocketProvider: Socket not connected, updating state');
      setIsConnected(false);
    }

    // Set up connection event listeners
    const handleConnect = () => {
      console.log('SocketProvider: Socket connected');
      setIsConnected(true);
      setConnectionError(null);
      
      // Automatically identify user when socket connects if authenticated
      if (isAuthenticated && user) {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('SocketProvider: User authenticated, identifying on socket...');
        }
        setTimeout(async () => {
          await socketService.identify();
        }, 500); // Small delay to ensure connection is fully established
      }
    };

    const handleDisconnect = (reason) => {
      console.log('SocketProvider: Socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error('SocketProvider: Socket connection error:', error);
      setIsConnected(false);
      setConnectionError(error.error || 'Connection failed');
    };

    const handleError = (error) => {
      console.error('SocketProvider: Socket error:', error);
      setConnectionError(error.error || 'Socket error');
    };

    const handleIdentified = (data) => {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('SocketProvider: User identified on socket:', data);
      }
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('error', handleError);
    socket.on('identified', handleIdentified);

    // If socket is already connected and user is authenticated, identify immediately
    if (socket.connected && isAuthenticated && user) {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('SocketProvider: Socket already connected, identifying user immediately');
      }
      socketService.identify().catch(err => {
        // Only log errors in development mode
        if (process.env.NODE_ENV === 'development') {
          console.error('SocketProvider: Error identifying user:', err);
        }
      });
    }

    // Cleanup function
    return () => {
      console.log('SocketProvider: Cleaning up socket connection...');
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('error', handleError);
      socket.off('identified', handleIdentified);
      
      // Don't disconnect the socket here as it should persist across the app
      // socket.disconnect();
    };
  }, [socket, isConnected, isAuthenticated, user]);

  // Identify user when authentication state changes
  useEffect(() => {
    if (socket && isConnected && isAuthenticated && user) {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('SocketProvider: Authentication state changed, identifying user on socket...');
      }
      socketService.identify().catch(err => {
        // Only log errors in development mode
        if (process.env.NODE_ENV === 'development') {
          console.error('SocketProvider: Error identifying user:', err);
        }
      });
    }
  }, [socket, isConnected, isAuthenticated, user]);

  const value = {
    socket,
    isConnected,
    connectionError,
    socketService
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
